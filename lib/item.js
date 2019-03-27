// @TODO validate data with real validators and error messages
const _lib = {};

_lib.createItemObject = (data = {}, companyId) =>{ // default to empty obj to prevent throwing fatal errors
    // create a basic company object so i could pass it to the second step of validation before saving
    const newItemObj = {};
    
    newItemObj.company = companyId;

    newItemObj.category= data.category && typeof data.category === 'string' ? data.category : null;
    newItemObj.name= data.name && typeof data.name === 'string' ? data.name : null;
    newItemObj.description= data.description && typeof data.description === 'string' ? data.description : null;
    newItemObj.points = data.points && Number.parseInt(data.points) ? Number.parseInt(data.points) : null;
    newItemObj.images= data.images && Array.isArray(data.images) && data.images.length > 0 ? [...new Set(data.images)] : [];

    return newItemObj;
};

_lib.updatedItemFields = (data = {}) =>{
    const newItemObj = {};

    if(data.category && typeof data.category === 'string'){
        newItemObj.category = data.category;
    }

    if(data.points && Number.parseInt(data.points)){
        newItemObj.points = Number.parseInt(data.points);
    }

    if(data.name && typeof data.name === 'string'){
        newItemObj.name = data.name;
    }

    if(data.description && typeof data.description === 'string'){
        newItemObj.description = data.description;
    }
    
    newItemObj.pushImages = data.pushImages && Array.isArray(data.pushImages) && data.pushImages.length > 0 ? data.pushImages : [];
    newItemObj.pullImage = data.pullImage && typeof data.pullImage === 'string' ? data.pullImage : null;
    return newItemObj;
};
module.exports = _lib;