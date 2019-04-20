const faker = require('faker');

const _lib = {};

_lib.randomClient = () => {
    return {
        name: faker.name.findName(),
        phone: '01000506070',
        email: faker.internet.email().toLowerCase(),
        password: faker.internet.password(),
    }
}

_lib.randomClientArray = (clientsNumber) => {
    const clientsArray = [];
    for(let i = 0; i < clientsNumber; i++){
        clientsArray[i] = _lib.randomClient();
    }

    return clientsArray;
}

_lib.randomAddress = () => {
    return {
        country: faker.address.country(),
        city: faker.address.city(),
        extra: faker.lorem.sentence(),
        latitude: faker.address.latitude(),
        longitude: faker.address.longitude()
    };
}






module.exports = _lib;