const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const { getJoinedEvents, joinEvent } = require("../controllers/userController");

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

const jwt = require('jsonwebtoken');

// Guest Login Route
router.post('/guest-login', async (req, res) => {
    try {
        // Create a guest user object (you can modify this as needed)
        const guestUser = {
            id: "guest_" + new Date().getTime(), // Generate unique ID
            name: "Guest User",
            email: "guest@example.com",
            role: "guest"
        };

        // Optional: Generate a token for guest users (if needed)
        const token = jwt.sign(guestUser, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            success: true,
            message: "Guest login successful",
            user: guestUser,
            token: token  // Only if needed
        });
    } catch (error) {
        console.error("Guest login error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

router.post('/user/join-event/:eventId', authMiddleware.authUser, userController.joinEvent);

// Route to get all events a user has joined
router.get('/user/joined-events', authMiddleware.authUser, userController.getUserJoinedEvents);

// Route to cancel joined event
router.post("/user/cancel-event/:eventId", authMiddleware.authUser, userController.cancelJoinedEvent);



module.exports = router;