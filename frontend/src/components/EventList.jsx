import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io(import.meta.env.VITE_BASE_URL);

const EventList = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetchEvents();

        socket.on("updateAttendees", (data) => {
            setEvents((prevEvents) =>
                prevEvents.map((event) =>
                    event._id === data.eventId ? { ...event, attendees: data.attendees } : event
                )
            );
        });

        return () => socket.off("updateAttendees");
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/events/allEvents`);
            console.log("Fetched Events:", response.data);
            
            // Ensure response is an array
            setEvents(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error fetching events:", error);
            setEvents([]); // Prevent crash
        }
    };

    const joinEvent = (eventId) => {
        socket.emit("joinEvent", eventId);
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Events</h2>
            {events.length > 0 ? (
                events.map((event) => (
                    <div key={event._id} className="p-4 bg-white rounded-lg shadow-md mb-4">
                        <h3 className="text-lg font-semibold">{event.title}</h3>
                        <p>{event.description}</p>
                        <p className="text-sm text-gray-500">Attendees: {event.attendees || 0}</p>
                        <button
                            onClick={() => joinEvent(event._id)}
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            Join Event
                        </button>
                    </div>
                ))
            ) : (
                <p>No events found.</p>
            )}
        </div>
    );
};

export default EventList;
