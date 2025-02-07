const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { body } = require('express-validator');

// Route for creating an event
router.post('/create', [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('date').isISO8601().withMessage('Invalid date format'),
    body('category').notEmpty().withMessage('category is required'),
    ],
    eventController.createEvent
);

    // Route for fetching events
router.get('/allEvents', eventController.getEvents);

// Route for updating an event by ID
router.put('/events/:id', [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
    body('date').optional().isISO8601().withMessage('Invalid date format'),
    body('category').optional().notEmpty().withMessage('Category cannot be empty'),
], eventController.updateEvent);

// Route to delete an event by ID
router.delete('/events/:id', eventController.deleteEvent);


module.exports = router;
