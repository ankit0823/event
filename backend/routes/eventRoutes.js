const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { getJoinedEvents } = require('../controllers/eventController');
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');

// Route for creating an event
router.post('/create', [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('date').isISO8601().withMessage('Invalid date format'),
    body('category').notEmpty().withMessage('Category is required'),
], eventController.createEvent);

// Route for fetching all events
router.get('/allEvents', eventController.getEvents);

// ✅ Fix: Route to fetch a single event by ID
router.get('/eventsId/:id', eventController.getEventById);

// ✅ Fix: Corrected update event route
router.put('/update/:id', [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
    body('date').optional().isISO8601().withMessage('Invalid date format'),
    body('category').optional().notEmpty().withMessage('Category cannot be empty'),
], eventController.updateEvent);

// Route to delete an event by ID
router.delete("/delete/:eventId",authMiddleware.authUser, eventController.deleteEvent);

router.get('/event/:eventId/attendees',authMiddleware.authUser, eventController.getUsersByEvent);


module.exports = router;
