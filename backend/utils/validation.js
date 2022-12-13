const Joi = require('@hapi/joi');

// Login Validation
const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().required().email(),
        fcmRegistrationToken: Joi.string().required()
    });

    return schema.validate(data);
}

module.exports.loginValidation = loginValidation;