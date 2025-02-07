const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register',[
    body('fullname.firstname').isLength({ min: 3}).withMessage("First name must be at least 3 character long"),
    body('email').trim().isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6}).withMessage("Password must be at least 6 character long"),
],
    userController.registerUser
)

router.post('/login',[
    body('email').trim().isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6}).withMessage("Password must be at least 6 character long"),
],
    userController.loginUser
)

router.get('/profile',authMiddleware.authUser, userController.getUserProfile)
router.get('/logout',authMiddleware.authUser, userController.logoutUser)

module.exports = router;