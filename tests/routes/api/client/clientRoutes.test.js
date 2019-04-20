const mongoose = require('mongoose');
const request = require('supertest');
const bcrypt = require('bcryptjs');

const app = require('../../../../app');
const {MONGODB_URI} = require('../../../../config');
const Client = require('../../../../models/Client');
const {randomClient, randomAddress} = require('../../../seed');


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
        describe('200: ', () => {

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

        describe('400: ', () => {

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

                expect(body.errors).toMatchObject(expectedObject);

                Client
                    .findOne({email: clientObject.email})
                    .then(client => {
                        expect(client).toBeNull();
                    })
            })
        }

    });

    describe('GET /:id', () => {
        let clientObject;

        
        describe('200:', () => {

            test('should return the client for the provided id', async () => {
                clientObject = randomClient();
                const {_id} = await Client.create(clientObject);
                clientObject._id = _id.toHexString();

                await request(app)
                .get(`${rootRoute}/${clientObject._id}`)
                .expect(({body, status}) => {
                    expect(status).toBe(200);
                    const {client} = body;
                    expect(client._id).toEqual(clientObject._id);
                    expect(client.name).toEqual(clientObject.name);
                    expect(client.phone).toEqual(clientObject.phone);
                    expect(Array.isArray(client.address)).toBe(true);
                    expect(client.address).toHaveLength(0);
                    expect(client).toHaveProperty('pic');
                    expect(client).toHaveProperty('points', 0);
                    expect(client).toHaveProperty('rating', -1);
                    expect(client).toHaveProperty('createdAt');
                });
                
            });          

            test('should return the client for the provided id with address', async () => {
                clientObject = randomClient();
                clientObject.address = randomAddress();
                const {_id} = await Client.create(clientObject);
                clientObject._id = _id.toHexString();


                await request(app)
                .get(`${rootRoute}/${clientObject._id}`)
                .expect(({body, status}) => {
                    expect(status).toBe(200);
                    const {client} = body;
                    expect(client._id).toEqual(clientObject._id);
                    expect(client.name).toEqual(clientObject.name);
                    expect(client.phone).toEqual(clientObject.phone);
                    expect(Array.isArray(client.address)).toBe(true);
                    expect(client.address).toHaveLength(1);
                    expect(client).toHaveProperty('pic');
                    expect(client).toHaveProperty('points', 0);
                    expect(client).toHaveProperty('rating', -1);
                    expect(client).toHaveProperty('createdAt');
                });
            });
        });

        describe('404:', () => {
            test('if client doesn\'t exist', async () => {
                const randomId = mongoose.Types.ObjectId();
                await request(app)
                .get(`${rootRoute}/${randomId}`)
                .expect(({body, status}) => {
                    expect(status).toBe(404);
                    const {client, message} = body;
                    expect(client).toBeNull();
                    expect(message).toEqual("Client not found");
                });
            });
        });

        describe('400:', () => {
            test('if client doesn\'t exist', async () => {
                const invalidId = 13518;
                await request(app)
                .get(`${rootRoute}/${invalidId}`)
                .expect(({body, status}) => {
                    expect(status).toBe(400);
                    expect(body.errors._id).toEqual("invalid object id");
                });
            });
        });

    });

    describe('PUT /', () => {
        let clientObject = null;
        let token = null;
        let updates = {
            name: 'Mahmoud',
            phone: '01234567891',
            password: '123456', // extra update should be ignored
            email: 'mahmoud@yahoo.com'
        }

        beforeEach(async () => {
            let client = randomClient();
            clientObject = await Client.create(client);
            token = await clientObject.generateAuthToken();
        });

        describe('200: ', () => {

            test('should return0 client is updated', async() => {
                await request(app)
                    .put(`${rootRoute}/`)
                    .set('auth', token)
                    .send(updates)
                    .expect(({status, body}) => {
                        expect(status).toBe(200);
                        // check number found (must be one not more)
                        expect(body.result.n).toBe(1);
                        // check number modified
                        expect(body.result.nModified).toBe(1);
                        // check if operation is ok
                        expect(body.result.ok).toBe(1);
    
                        Client.findOne({_id: clientObject._id})
                            .then(dbClient => {
                                expect(dbClient.name).toEqual(updates.name);
                                expect(dbClient.phone).toEqual(updates.phone);
                                expect(dbClient.email).toEqual(updates.email);
                            })
                    })
            });

            test('should return client is not updated', async() => {
                await request(app)
                    .put(`${rootRoute}/`)
                    .set('auth', token)
                    .send({})
                    .expect(({status, body}) => {
                        expect(status).toBe(200);
                        // check number found (must be one not more)
                        expect(body.result.n).toBe(0);
                        // check number modified
                        expect(body.result.nModified).toBe(0);
                        // check if operation is ok
                        expect(body.result.ok).toBe(0);
    
                        Client.findOne({_id: clientObject._id})
                            .then(dbClient => {
                                // not updated
                                expect(dbClient.name).toEqual(clientObject.name);
                                expect(dbClient.phone).toEqual(clientObject.phone);
                                expect(dbClient.email).toEqual(clientObject.email);
                            })
                    })
            });
        });
        describe('401: ', () => {


            test('if invalid client token is provided', async() => {

                request(app)
                    .put(`${rootRoute}/`)
                    .send(updates) // don't change
                    .expect(({status, body}) => {
                    .set('auth', token + '1')
                        expect(status).toBe(401);
                        expect(body.message).toEqual("UnAuthorized")
                        return Client.findOne({_id: clientObject._id})
                            .then(dbClient => {
                                expect(dbClient.name).toEqual(clientObject.name);
                                expect(dbClient.phone).toEqual(clientObject.phone);
                                expect(dbClient.email).toEqual(clientObject.email);
                            })
                    })
                });

            test('if no client token is provided', async() => {
                await request(app)
                    .put(`${rootRoute}/`)
                    .set('auth', '')
                    .send(updates) // don't change
                    .expect(({status, body}) => {
                        expect(status).toBe(401);
                        expect(body.message).toEqual("UnAuthorized")
                        return Client.findOne({_id: clientObject._id})
                            .then(dbClient => {
                                expect(dbClient.name).toEqual(clientObject.name);
                                expect(dbClient.phone).toEqual(clientObject.phone);
                                expect(dbClient.email).toEqual(clientObject.email);
                            })
                    })
            });


            test('if token that leads to non existing client', async() => {
                await Client.deleteMany({});
                await request(app)
                .put(`${rootRoute}/`)
                .set('auth', token)
                .send(updates) // don't change
                .expect(({status, body}) => {
                    expect(status).toBe(401);
                    expect(body.message).toEqual("UnAuthorized");
                })

            });
        });


    });
});
