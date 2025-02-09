const userModel = require('../models/userModel');
const eventModel = require('../models/eventModel')


module.exports.createUser = async ({
    firstname, lastname, email, password
}) => {
    if (!firstname || !email ||  !password) {
        throw new Error('all fields are required');
    } 
    const user = userModel.create({
        fullname:{
            firstname,
            lastname
        },
        email,
        password
    })

    return user;
}

module.exports.joinEvent = async (userId, eventId) => {
    const user = await userModel.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }

    const event = await eventModel.findById(eventId);
    if (!event) {
        throw new Error("Event not found");
    }

    // Check if user already joined the event
    if (user.joinedEvents.includes(eventId)) {
        throw new Error("User already joined this event");
    }

    // Add event to user's joinedEvents array
    user.joinedEvents.push(eventId);
    await user.save();

    // Add user to event's attendees list
    event.attendees.push(userId);
    await event.save();

    return { message: "Successfully joined event", event };
};

module.exports.getUserJoinedEvents = async (userId) => {
    const user = await userModel.findById(userId).populate("joinedEvents");
    if (!user) {
        throw new Error("User not found");
    }

    return user.joinedEvents;
};

module.exports.cancelJoinedEvent = async (userId, eventId) => {
    const user = await userModel.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }

    const event = await eventModel.findById(eventId);
    if (!event) {
        throw new Error("Event not found");
    }

    // Ensure joinedEvents is an array before filtering
    if (!Array.isArray(user.joinedEvents)) {
        user.joinedEvents = [];
    }

    if (!Array.isArray(event.attendees)) {
        event.attendees = [];
    }

    // Check if user actually joined the event
    if (!user.joinedEvents.includes(eventId)) {
        throw new Error("User has not joined this event");
    }

    // Remove event from user's joinedEvents array
    user.joinedEvents = user.joinedEvents.filter(id => id.toString() !== eventId);
    await user.save();

    // Remove user from event's attendees array
    event.attendees = event.attendees.filter(id => id.toString() !== userId);
    await event.save();

    return { message: "Successfully canceled event participation", event };
};