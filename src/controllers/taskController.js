const express = require('express')
const { StatusCodes } = require('http-status-codes');
const Task = require('../models/task')
const joi = require('../joi')

const addTask = async (req, res) => {
    
    try {
        const payload = await joi.createTask.validateAsync(req.body)

        const task = new Task({
            ...payload,
            owner: req.user._id
        })
        await task.save()
        
        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Task created successfully.",
            data: task
        });
    } catch (e) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: e.message ?? "Internal Server Error"
        });
    }
}

const getTasks = async (req, res) => {

    try {
        const pageSize = 10;
        const pageNum = req.query.page || 1;
        const skip = (pageNum - 1) * pageSize;

        const tasks = await Task.find({ owner: req.user._id })
            .sort({ createdAt: 'desc' })
            .skip(skip)
            .limit(pageSize);

        const count = tasks.length;

        const data = {
            tasks: tasks,
            totalTasks: count,
            currentPage: pageNum,
            totalPages: Math.ceil(count / pageSize)
        }
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Fetched tasks successfully.",
            data: data
        });
    } catch (e) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: e.message ?? "Internal Server Error"
        });
    }
}


const updateTask = async (req, res) => {

    try {
        const payload = await joi.updateTask.validateAsync(req.body)
        const updates = Object.keys(payload)
        const allowedUpdates = ['title','description', 'completed']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
        
        if (!isValidOperation) {
          
            throw new Error("Invalid updates!")

        }
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

        if (!task) {

            throw new Error("Task not Found")
        }

        updates.forEach((update) => task[update] = req.body[update])

        await task.save()

        return res.status(StatusCodes.OK).json({
            success: true,
            data: task,
            message: "Task updated successfully."
        });
    } catch (e) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: e.message ?? "Internal Server Error"
        });
    }
}

module.exports = {
    addTask,
    updateTask,
    getTasks
}