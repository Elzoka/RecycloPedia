const mongoose = require('mongoose');
const request = require('supertest');

const app = require('../../../../app');
const {MONGODB_URI} = require('../../../../config');
const Client = require('../../../../models/Client');
const {randomClient} = require('../../../seed');


beforeAll(async () => {
    await mongoose.connect(MONGODB_URI, {useNewUrlParser: true});
});
    
afterAll((done) => {
    mongoose.connection.db.dropDatabase().then(() => {
        mongoose.disconnect(done);
    });
});


beforeEach(async () => {
    // remove collection
    await Client.deleteMany({});
});

const rootRoute = '/api/client';

describe(`${rootRoute}`, () => {
    describe('POST /', () => {
        let clientObject;

        beforeEach(() => {
            clientObject = randomClient();
        });
        describe('should return 200: ', () => {

            test('if valid data is provided', async () => {
                await request(app)
                .post(rootRoute)
                .send(clientObject)
                .expect(({body, status}) =>{
                    expect(status).toBe(200);
                    expect(body.token).toBeTruthy();
                    expect(body.auth).toBe(true);

                    Client
                        .findOne({email: clientObject.email}, {name: 1, email: 1, phone: 1, password: 1, points: 1})
                        .then(client => {
                            expect(client.name).toEqual(clientObject.name);
                            expect(client.email).toEqual(clientObject.email);
                            expect(client.phone).toEqual(clientObject.phone);
                            expect(client.password).not.toEqual(clientObject.password);
                            expect(client.points).toBe(0);
                        })
                })
            });

        });

        describe('should return 400: ', () => {

            test('if email is not provided', () => {
                const {email, ...newClientObject} = clientObject;
                _testInvalidField(newClientObject, 'email');
            });

            test('if name is not provided', () => {
                const {name, ...newClientObject} = clientObject;
                _testInvalidField(newClientObject, 'name');

            });

            test('if phone is not provided', () => {
                const {phone, ...newClientObject} = clientObject;
                _testInvalidField(newClientObject, 'phone');
            });

            test('if password is not provided', () => {
                const {password, ...newClientObject} = clientObject;
                _testInvalidField(newClientObject, 'password');
            });

            test('if name is more than 25 character', () => {
                const changedValue = 'name';
                clientObject[changedValue] = Array(26).fill('a').join("");
                _testInvalidField(clientObject, changedValue, `${changedValue} field lenght is too long.`);
            });

            test('if invalid phone is provided', () => {
                const changedValue = 'phone';
                clientObject[changedValue] = '15619816894';
                _testInvalidField(clientObject, changedValue, `${changedValue} field is invalid`);
            });

            test('if invalid email is provided', () => {
                const changedValue = 'email';
                clientObject[changedValue] = 'sdvnsdvio'; // random charachters
                _testInvalidField(clientObject, changedValue, `${changedValue} field is invalid`);
            });

            test('if an empty client object is provided', () => {
                clientObject = {};
                _testInvalidField(clientObject, ['name', 'email', 'password', 'phone']);
            });

            test('if an email is not unique', async() => {
                await Client.create(clientObject);
                clientObject.name = 'different name';

                await request(app)
                .post(rootRoute)
                .send(clientObject)
                .expect(({body, status}) =>{
                    expect(status).toBe(400);
                    expect(body.auth).toBe(false);
                    
                    expect(body.errors).toMatchObject({ email: 'duplicated key' });
            
                    Client
                        .findOne({email: clientObject.email}, {name: 1})
                        .then(client => {
                            expect(client).toBeTruthy();
                            expect(client.name).not.toEqual(clientObject.name);
                        });
                });
                                
            });
        });

    });
});

async function _testInvalidField(clientObject, fieldNames = [], errorMessage = null){
    fieldNames = fieldNames && (typeof fieldNames === 'string') ? [fieldNames] : fieldNames;
    await request(app)
    .post(rootRoute)
    .send(clientObject)
    .expect(({body, status}) =>{
        expect(status).toBe(400);
        expect(body.auth).toBe(false);
        const expectedObject = {};

        fieldNames.forEach(field => {
            expectedObject[field] = errorMessage || `${field} field is required.`
        })
        // console.log(body);
        expect(body.errors).toMatchObject(expectedObject);

        Client
            .findOne({email: clientObject.email})
            .then(client => {
                expect(client).toBeNull();
            })
    })
}