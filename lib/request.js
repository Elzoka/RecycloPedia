const _lib = {};

_lib.createRequestObj = (data = {}, clientId) => {
    const newRequest = {};
    
    newRequest.company = data.company && typeof data.company === 'string' ? data.company : null;;
    newRequest.client = clientId || null;

    newRequest.items= data.items && Array.isArray(data.items) && data.items.length > 0 ? [...new Set(data.items)] : [];

    return newRequest;

}

_lib.updatedItemsFields = (data = {}) =>{
    const newRequest = {};

    // @TODO validate each item
    // @TODO add limit to the number of items pushed 
    newRequest.items = data.items && Array.isArray(data.items) && data.items.length > 0 ? data.items : [];

    return newRequest;
};

_lib.updateRequestStatus = (data = {}) =>{
    const newRequest = {};

    if(data.status && data.status == 'approved'){
        newRequest.status = data.status; 
    }

    if(data.representative){
        newRequest.status = data.status; 
        newRequest.representative = data.representative;
    }
    return newRequest;
};



module.exports = _lib;