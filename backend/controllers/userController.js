const userModel = require('../models/userModel');
const userService = require('../services/userService');
const { validationResult } = require('express-validator');

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