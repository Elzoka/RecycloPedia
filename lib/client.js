const _lib = {};

_lib.createClientObject = (data = {}) => {
    const newClient = {};
    
    newClient.name = data.name && typeof data.name === 'string' ? data.name : null;
    if(data.country && data.city){
        newClient.address = _lib.createAddress(data);
    }
    
    
    newClient.phone= data.phone && typeof data.phone === 'string' ? data.phone : null;
    newClient.email= data.email && typeof data.email === 'string' ? data.email : null;
    newClient.password = data.password && typeof data.password === 'string' ? data.password : null;

    return newClient;
}

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

module.exports = _lib;