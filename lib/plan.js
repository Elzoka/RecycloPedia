// @TODO validate data with real validators and error messages
const _lib = {};

_lib.createPlanObject = (data = {}, companyId) =>{ // default to empty obj to prevent throwing fatal errors
    // create a basic company object so i could pass it to the second step of validation before saving
    const newPlanObj = {};
    
    newPlanObj.company = companyId;

    newPlanObj.category= data.category && typeof data.category === 'string' ? data.category : null;
    newPlanObj.itemName= data.itemName && typeof data.itemName === 'string' ? data.itemName : null;
    newPlanObj.description= data.description && typeof data.description === 'string' ? data.description : null;
    newPlanObj.points = data.points && Number.parseInt(data.points) ? Number.parseInt(data.points) : null;
    newPlanObj.images= data.images && Array.isArray(data.images) && data.images.length > 0 ? [...new Set(data.images)] : [];

    return newPlanObj;
};

_lib.updatedPlanFields = (data = {}) =>{
    const newPlanObj = {};

    if(data.category && typeof data.category === 'string'){
        newPlanObj.category = data.category;
    }

    if(data.points && Number.parseInt(data.points)){
        newPlanObj.points = Number.parseInt(data.points);
    }

    if(data.itemName && typeof data.itemName === 'string'){
        newPlanObj.itemName = data.itemName;
    }

    if(data.description && typeof data.description === 'string'){
        newPlanObj.description = data.description;
    }
    
    newPlanObj.pushImages = data.pushImages && Array.isArray(data.pushImages) && data.pushImages.length > 0 ? data.pushImages : [];
    newPlanObj.pullImage = data.pullImage && typeof data.pullImage === 'string' ? data.pullImage : null;
    return newPlanObj;
};
module.exports = _lib;