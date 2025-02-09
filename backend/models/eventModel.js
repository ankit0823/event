const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    attendees: {
        type: [mongoose.Schema.Types.ObjectId], // Store user IDs
        ref: 'User',
        default: []
    }
    
    // status: {
    //     type: String,
    //     enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    //     default: 'upcoming'
    // },
    // createdAt: {
    //     type: Date,
    //     default: Date.now
    // }
});

const eventModel = mongoose.model('Event', eventSchema);
module.exports = eventModel;