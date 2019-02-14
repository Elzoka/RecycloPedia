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
    newPlanObj.images= data.images && Array.isArray(data.images) && data.images.length > 0 ? data.images : [];

    return newPlanObj;
};

module.exports = _lib;