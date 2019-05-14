const path = require('path');
const fs = require('fs');
const { ObjectId } = require('mongodb');
const User = require('../models/user.js');

const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userDelete = await User.findOneAndDelete({_id: ObjectId(id)});
        if (!userDelete) {
            return next(new Error('user_not_found'));
        }
        return res.status(200).json({
            message : 'delete user successful',
            data: userDelete
        });
    } catch (e) {
        return next(e);
    }
};

const addUser = async (req, res, next) => {
    try {
        const { username, password} = req.body;
        const existedUser = await User.findOne({username});
        if (existedUser) {
            return next(new Error('username_already_exists'));
        } 
        const newUser = new User({
            username,
            password
        })
        const createUser = await newUser.save();
        return res.status(201).json({
            message: "create user successfull",
            data: createUser // yeu cau in ra 1 user nen ops[0] 
        });
    } catch (e) {
        return next(e);
    }
};

const getListUser = async (req, res, next) => {
    try {
        const users = await User.find();
        if (!users) {
            return next(new Error('No_data'));
        }
        return res.status(200).json({
            message: 'List users',
            data: users
        });
    } catch (e) {
        return next(e);
    }
};

const getUser = async (req, res, next) => {
    try {
    
        const { id } = req.params;
        const user = await User.findOne({_id: ObjectId(id)});        
        if (!user) {
            return next(new Error('User_not_found'));
        }
        return res.status(200).json({
            message: 'User',
            data: user
        });
    } catch (e) {
        return next(e);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const {
            username,
            password
        } = req.body;
        
        const existedUser = await User.findOne({username});
        if (existedUser) {
            return next(new Error('Username_already_exist'))
        }
        const newValues = {
            username,
            password
        }
        Object.keys(newValues).forEach(function(key) {
            if (newValues[key] === undefined) {
                delete newValues[key];
            }
        });
        const updateInfo = { $set: newValues };
        const userUpdate = await User.findOneAndUpdate({_id: ObjectId(id)}, updateInfo, {
            new: true
        }).lean();
        if (!userUpdate) {
            return next(new Error('user_not_found'));
        }
        return res.status(200).json({
            message : 'update successful',
            data: userUpdate,
            data_update: newValues
        });
    } catch (e) {
        return next(e);
    }
};

module.exports = {
    deleteUser,
    addUser,
    getListUser,
    getUser,
    updateUser
};