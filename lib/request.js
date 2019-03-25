const _lib = {};

_lib.createRequestObj = (data = {}, clientId) => {
    const newRequest = {};
    
    newRequest.company = data.company && typeof data.company === 'string' ? data.company : null;;
    newRequest.client = clientId || null;

    newRequest.items= data.items && Array.isArray(data.items) && data.items.length > 0 ? [...new Set(data.items)] : [];

    return newRequest;

}

module.exports = _lib;