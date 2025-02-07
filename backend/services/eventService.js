const eventModel = require('../models/eventModel');

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

// Update event by ID
module.exports.updateEvent = async (eventId, updateData) => {
    const updatedEvent = await eventModel.findByIdAndUpdate(
        eventId,
        { $set: updateData },
        { new: true, runValidators: true } // Return updated document and apply validation
    );

    return updatedEvent;
};

module.exports.deleteEvent = async (eventId) => {
    const deletedEvent = await eventModel.findByIdAndDelete(eventId);
    return deletedEvent;
};