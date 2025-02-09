const eventModel = require('../models/eventModel');
const userModel = require('../models/userModel')

module.exports.createEvent = async ({
    title, description, date, category,
}) => {
    if (!title || !description || !date || !category) {
        throw new Error('all fields are required');
    } 
    const event = await eventModel.create({
        title,
        description,
        date,
        category,
    })

    return event;
}

// Fetch all events
module.exports.getEvents = async () => {
    return await eventModel.find(); // Fetch all documents from the events collection
};

module.exports.getEventById = async (eventId) => {
    return await eventModel.findById(eventId);
};

module.exports.updateEvent = async (eventId, updateData) => {
    const updatedEvent = await eventModel.findByIdAndUpdate(
        eventId,
        { $set: updateData },
        { new: true, runValidators: true } // ✅ Fix: Ensures validation is applied
    );
    return updatedEvent;
};


const mongoose = require("mongoose");  // ✅ Ensure mongoose is imported


module.exports.deleteEvent = async (eventId) => {
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        throw new Error("Invalid Event ID");
    }

    try {
        const deletedEvent = await eventModel.findByIdAndDelete(eventId);
        if (!deletedEvent) {
            throw new Error("Event not found");
        }
        return deletedEvent;
    } catch (error) {
        console.error("Error deleting event:", error);
        throw new Error("Failed to delete event");
    }
};



module.exports.getUsersByEvent = async (eventId) => {
    const event = await eventModel.findById(eventId).populate('attendees', 'fullname email');
    if (!event) {
        throw new Error('Event not found');
    }
    return event.attendees; // Return all users who joined the event
};
