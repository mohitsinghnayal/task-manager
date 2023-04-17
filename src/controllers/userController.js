const express = require('express')

const { StatusCodes } = require('http-status-codes');

const User = require('../models/user')

const joi = require('../joi')

const register = async (req, res) => {
   
    
    try {
        
        const payload = await joi.register.validateAsync(req.body)
        const user = new User(payload)
        await user.save()
        const token = await user.generateAuthToken()

        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "User created successfully.",
            data:  user 
        });
    } catch (e) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: e.message ?? "Internal Server Error"
        });
    }
}

const login = async (req, res) => {
    try {
        const payload = await joi.login.validateAsync(req.body)
        const user = await User.findByCredentials(payload.email, payload.password)

        const token = await user.generateAuthToken()
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Login successfull.",
            data:  user 
        });
    } catch (e) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: e.message ?? "Internal Server Error"
        });
    }
}

const logout = async (req, res) => {
    try {
        req.user.token = " "
        await req.user.save()

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Logout successfull.",
            statusCode: StatusCodes.OK,
        });
    } catch (e) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: e.message ?? "Internal Server Error"
        });
    }
}



module.exports = {
    register,
    login,
    logout
}