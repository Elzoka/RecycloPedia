const _lib = {};

_lib.createCompanyObject = (data = {}) =>{ // default to empty obj to prevent throwing fatal errors
    // create a basic company object so i could pass it to the second step of validation before saving
    const newCompanyObj = {};
    newCompanyObj.name = data.name && typeof data.name === 'string' ? data.name : null;
    if(data.country && data.city){
        newCompanyObj.address = _lib.createAddress(data);
    }
    newCompanyObj.serviceAvailableIn = data.serviceAvailableIn && Array.isArray(data.serviceAvailableIn) && data.serviceAvailableIn.length > 0 ? data.serviceAvailableIn : [];        
    
    const email = data.email && typeof data.email === 'string' ? data.email : null;
    newCompanyObj.email = email;
    newCompanyObj.contactInfo= {
        email: data.WorkEmail && typeof data.WorkEmail === 'string' ? data.WorkEmail : email,
        phone: data.phone && typeof data.phone === 'string' ? data.phone : null,
        fax: data.fax && typeof data.fax === 'string' ? data.fax : null,
    };
    newCompanyObj.password= data.password && typeof data.password === 'string' ? data.password : null;
    console.lo
    return newCompanyObj;
};

_lib.updatedCompanyFields = (data = {}) =>{
    const newCompanyObj = {};

    if(data.name && typeof data.name === 'string'){
        newCompanyObj.name = data.name;
    }

    if(data.email && typeof data.email === 'string'){
        newCompanyObj.email = data.email;
    }

    if(data.password && typeof data.password === 'string'){
        newCompanyObj.password = data.password;
    }

    if(data.logo && typeof data.logo === 'string'){
        newCompanyObj.logo = data.logo;
    }
    return newCompanyObj;
};

_lib.createAddress = (data = {}) => {
    return {
        country: data.country && typeof data.country === 'string' ? data.country : null,
        city: data.city && typeof data.city === 'string' ? data.city : null,
        extra: data.extra && typeof data.extra === 'string' ? data.extra : null,
        coordinates: {
            // get the lon and lat as strings so it wouldn't lose precision
            latitude: data.latitude && typeof data.latitude === 'string' ? data.latitude : null,
            longitude: data.longitude && typeof data.longitude === 'string' ? data.longitude : null
        }
    };
}

_lib.updatedAddressField = (data = {}) => {
    const updateFields = {};
    if(data.country){
        updateFields.country = data.country;
    }

    if(data.city){
        updateFields.city = data.city;
    }
    if(data.extra){
        updateFields.extra = data.extra;
    }

    if(data.longitude){
        updateFields["coordinates.longitude"] = data.longitude;
    }
    if(data.latitude){
        updateFields["coordinates.latitude"] = data.latitude;
    }

    return updateFields;
}

_lib.createContactInfo = (data = {}) => {
    const contactInfo = {};

    if(data.email && typeof data.email === 'string'){
        contactInfo.email = data.email;
    }
    
    if(data.phone && typeof data.phone === 'string'){
        contactInfo.phone = data.phone;
    }
    
    if(data.fax && typeof data.fax === 'string'){
        contactInfo.fax = data.fax;
    }
    
    return contactInfo;
}

module.exports = _lib;