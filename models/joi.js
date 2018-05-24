var Joi = require('joi');

module.exports = Joi.object.keys({
    username:Joi.string().alphanum().min(3).max(10).required(),
    biography:Joi.string().required(),
    gender:Joi.string().required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    passwordConf: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
});
