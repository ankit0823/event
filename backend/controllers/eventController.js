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
// ✅ Fix: Fetch a single event by ID
module.exports.getEventById = async (req, res) => {
    try {
        const event = await eventService.getEventById(req.params.id);
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }
        res.status(200).json({ event });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch event" });
    }
};

// ✅ Fix: Update an event
module.exports.updateEvent = async (req, res) => {
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
    const eventId = req.params.eventId; // ✅ Sahi // FIXED: eventId use karo
    console.log("Received Event ID:", eventId); // Debugging
    console.log("DELETE request received for event ID:", req.params);

    try {
        const deletedEvent = await eventService.deleteEvent(eventId);
        console.log("Deleted Event:", deletedEvent); // Debugging

        if (!deletedEvent) {
            return res.status(404).json({ error: "Event not found" });
        }

        res.status(200).json({ message: "Event deleted successfully", deletedEvent });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports.getUsersByEvent = async (req, res) => {
    const { eventId } = req.params;

    try {
        const users = await eventService.getUsersByEvent(eventId);
        res.status(200).json({ attendees: users });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



