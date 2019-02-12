const _lib = {};

_lib.createRepObject = (data = {}, companyId) =>{ // default to empty obj to prevent throwing fatal errors
    // create a basic company object so i could pass it to the second step of validation before saving
    const newRepObj = {};
    newRepObj.company = companyId;
    newRepObj.name = data.name && typeof data.name === 'string' ? data.name : null;
    newRepObj.username = data.username && typeof data.username === 'string' ? data.username : null;
    
    newRepObj.password= data.password && typeof data.password === 'string' ? data.password : null;

    return newRepObj;
};

_lib.updatedRepFields = (data = {}) =>{
    const newRepObj = {};

    if(data.name && typeof data.name === 'string'){
        newRepObj.name = data.name;
    }

    if(data.username && typeof data.username === 'string'){
        newRepObj.username = data.username;
    }

    if(data.password && typeof data.password === 'string'){
        newRepObj.password = data.password;
    }

    if(data.pic && typeof data.pic === 'string'){
        newRepObj.pic = data.pic;
    }

    return newRepObj;
};

module.exports = _lib;