const _lib = {};


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

module.exports = _lib;