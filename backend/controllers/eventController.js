const eventService = require('../services/eventService');
const { validationResult } = require('express-validator');

module.exports.createEvent =async (req, res, next) => {
    // Validation middleware
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {title , description, date, category} = req.body;

    const event = await eventService.createEvent({
        title,
        description,
        date,
        category,
    });

    res.status(201).json({ event});
   
}

// Get all events
module.exports.getEvents = async (req, res, next) => {
    try {
        const events = await eventService.getEvents();
        res.status(200).json({ events });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update event by ID
module.exports.updateEvent = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const eventId = req.params.id;
    const updateData = req.body;

    try {
        const updatedEvent = await eventService.updateEvent(eventId, updateData);
        
        if (!updatedEvent) {
            return res.status(404).json({ error: "Event not found" });
        }

        res.status(200).json({ message: "Event updated successfully", updatedEvent });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports.deleteEvent = async (req, res) => {
    const eventId = req.params.id;

    try {
        const deletedEvent = await eventService.deleteEvent(eventId);

        if (!deletedEvent) {
            return res.status(404).json({ error: "Event not found" });
        }

        res.status(200).json({ message: "Event deleted successfully", deletedEvent });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};