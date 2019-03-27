const _lib = {};

_lib.createRequestObj = (data = {}) => {
    const newRequest = {};
    
    newRequest.company = data.company && typeof data.company === 'string' ? data.company : null;;

    newRequest.items= data.items && Array.isArray(data.items) && data.items.length > 0 ? [...new Set(data.items)] : [];

    return newRequest;

}

_lib.updatedItemsFields = (data = {}) =>{
    const newRequest = {};

    newRequest.items = data.items && Array.isArray(data.items) && data.items.length > 0 ? data.items : [];

    return newRequest;
};

_lib.updateRequestStatus = (data = {}) =>{
    const newRequest = {};

    if(data.representative){
        newRequest.status = 'assigned'; 
        newRequest.representative = data.representative;
    }else{
        newRequest.status = 'approved'; 
    }
    return newRequest;
};



module.exports = _lib;