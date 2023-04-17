const joi = require("joi");

const register = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required()
});

const login = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
});

const createTask = joi.object({
    title: joi.string().required(),
    description: joi.string().required()
});

const updateTask = joi.object({
    title: joi.string(),
    description: joi.string(),
    completed: joi.boolean()

})

module.exports = {
    register,
    login,
    createTask,
    updateTask
}