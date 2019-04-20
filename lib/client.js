const {createAddress} = require('./address');
const _lib = {};

_lib.createClientObject = (data = {}) => {
    const newClient = {};
    newClient.name = data.name && typeof data.name === 'string' ? data.name : null;
    
    if(data.country && data.city){ // @TODO can't procced a request without adding an address
        newClient.address = createAddress(data);
    }
    
    
    newClient.phone= data.phone && typeof data.phone === 'string' ? data.phone : null;
    newClient.email= data.email && typeof data.email === 'string' ? data.email : null;
    newClient.password = data.password && typeof data.password === 'string' ? data.password : null;

    return newClient;
}

_lib.updatedClientFields = (data = {}) =>{
    const newClientObj = {};

    if(data.name && typeof data.name === 'string'){
        newClientObj.name = data.name;
    }

    if(data.email && typeof data.email === 'string'){
        newClientObj.email = data.email;
    }

    if(data.phone && typeof data.phone === 'string'){
        newClientObj.phone = data.phone;
    }

    return newClientObj;
};


module.exports = _lib;