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






module.exports = _lib;