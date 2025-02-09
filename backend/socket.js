const socketIo = require('socket.io');
const userModel = require('./models/userModel')
const eventModel = require('./models/eventModel')

let io;

function initializeSocket(server) {
    io = socketIo(server,{
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);
    
        socket.on("joinEvent", async (eventId) => {
            try {
                const event = await Event.findById(eventId);
                if (!event) return;
    
                event.attendees += 1;  // Increment attendee count
                await event.save();
    
                io.emit("updateAttendees", { eventId, attendees: event.attendees });  // Broadcast update
            } catch (error) {
                console.error("Error updating attendees:", error);
            }
        });
    
        socket.on("leaveEvent", async (eventId) => {
            try {
                const event = await Event.findById(eventId);
                if (!event) return;
    
                event.attendees = Math.max(0, event.attendees - 1);  // Decrease count safely
                await event.save();
    
                io.emit("updateAttendees", { eventId, attendees: event.attendees });
            } catch (error) {
                console.error("Error updating attendees:", error);
            }
        });
    
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
}


module.exports = {
    initializeSocket,
    
};
