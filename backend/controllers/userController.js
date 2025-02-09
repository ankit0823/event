const userModel = require('../models/userModel');
const userService = require('../services/userService');
const { validationResult } = require('express-validator');
const blacklistedTokenModel = require('../models/blacklistiToken.model');
const mongoose = require('mongoose');

module.exports.registerUser = async (req, res, next) => {

    //check validation eresult
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array() });
    }
    
    const {fullname , email, password} = req.body;

    // const isUserAlreadyExists = await userModel.findOne({email});

    // if(isUserAlreadyExists){
    //     return res.status(400).json({message: 'User already exists with this email'});
    // }

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword,
    });

    const token = user.generateAuthToken();

    res.status(201).json({token, user});

}
module.exports.loginUser = async (req, res, next) => {
    //check validation result
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array() });
    }

    const {email, password} = req.body;

    const user = await userModel.findOne({email}).select('+password');

    if(!user){
        return res.status(401).json({message: 'email or password is incorrect'});

    }

    const isMatch = await user.comparePassword(password);

    if(!isMatch){
        return res.status(401).json({message: 'email or password is incorrect'});
    }

    const token = user.generateAuthToken();
    res.cookie('token', token);

    res.status(200).json({token, user});
}

module.exports.getUserProfile = async (req, res, next) => {

    res.status(200).json(req.user);

}

module.exports.logoutUser = async (req, res, next) => {
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization.split(' ')[1];

    await blacklistedTokenModel.create({ token });
    res.status(200).json({message: 'Logout successfully'});
}


module.exports.joinEvent = async (req, res) => {
    const userId = req.user?.id; // Get userId from authenticated user
    const { eventId } = req.params; // Get eventId from request parameters

    // Validate eventId format (Check if it's a valid MongoDB ObjectId)
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(400).json({ error: "Invalid event ID format" });
    }

    try {
        // Call service to handle event joining logic
        const response = await userService.joinEvent(userId, eventId);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports.getUserJoinedEvents = async (req, res) => {
    const userId = req.user?.id;

    try {
        const joinedEvents = await userService.getUserJoinedEvents(userId);
        res.status(200).json({ joinedEvents });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports.cancelJoinedEvent = async (req, res) => {
    const userId = req.user?.id; // Get userId from authenticated user
    const { eventId } = req.params; // Get eventId from request parameters

    try {
        const response = await userService.cancelJoinedEvent(userId, eventId);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};