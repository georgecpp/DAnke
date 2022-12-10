const Joi = require('@hapi/joi');


// Register Step 2 Validation
const registerFirstStepValidation=(data)=>{
    const schema=Joi.object({
        email: Joi.string().email().required(), 
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        password:Joi.string().required(),
        unit: Joi.string().required()
    });
    return schema.validate(data);
}

// Register Step 2 Validation
const registerSecondStepValidation=(data)=>{
    const schema=Joi.object({
        email: Joi.string().email().required(), 
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        password:Joi.string().required(),
        unit: Joi.string().required(),
        otp_token: Joi.string().required(),
        fcmRegistrationToken: Joi.string().required()
    });
    return schema.validate(data);
}


// Login Validation
const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required(),
        fcmRegistrationToken: Joi.string().required()
    });

    return schema.validate(data);
}

module.exports.registerFirstStepValidation = registerFirstStepValidation;
module.exports.registerSecondStepValidation = registerSecondStepValidation;
module.exports.loginValidation = loginValidation;