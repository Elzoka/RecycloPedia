module.exports = {
    createCompanyObject(data = {}){ // default to empty obj to prevent throwing fatal errors
        // create a basic company object so i could pass it to the second step of validation before saving
        const newCompanyObj = {};
        newCompanyObj.name = data.name && typeof data.name === 'string' ? data.name : null;
        newCompanyObj.address= {
            country: data.country && typeof data.country === 'string' ? data.country : null,
            city: data.city && typeof data.city === 'string' ? data.city : null,
            extra: data.extra && typeof data.extra === 'string' ? data.extra : null,
            coordinates: {
                // get the lon and lat as strings so it wouldn't lose precision
                latitude: data.latitude && typeof data.latitude === 'string' ? data.latitude : null,
                longitude: data.longitude && typeof data.longitude === 'string' ? data.longitude : null
            }
        };
        
        newCompanyObj.serviceAvailableIn = data.serviceAvailableIn && Array.isArray(data.serviceAvailableIn) && data.serviceAvailableIn.length > 0 ? data.serviceAvailableIn : [];        
        
        const email = data.email && typeof data.email === 'string' ? data.email : null;
        newCompanyObj.email = email;
        newCompanyObj.contactInfo= {
            email: data.WorkEmail && typeof data.WorkEmail === 'string' ? data.WorkEmail : email,
            phone: data.phone && typeof data.phone === 'string' ? data.phone : null,
            fax: data.fax && typeof data.fax === 'string' ? data.fax : null,
        };
        newCompanyObj.password= data.password && typeof data.password === 'string' ? data.password : null;

        return newCompanyObj;
    },
    updatedCompanyFields(data = {}){
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
    }
};