const mongoose = require('mongoose');
const request = require('supertest');

const app = require('../../../../app');
const {MONGODB_URI} = require('../../../../config');


beforeAll(async () => {
    await mongoose.connect(MONGODB_URI, {useNewUrlParser: true});
});
    
afterAll((done) => {
    mongoose.connection.db.dropDatabase().then(() => {
        mongoose.disconnect(done);
    });
});


beforeEach(async() => {
    // remove collection
});


describe('', () => {
    test('', async () => {
        // request(app)
        expect(2 + 2).toBe(4);
    });
});
