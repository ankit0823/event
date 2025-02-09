import { useEffect, useState } from "react";
import axios from "axios";

const EventAttendees = ({ eventId }) => {
    const [attendees, setAttendees] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAttendees = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/events/event/${eventId}/attendees`
                );
                setAttendees(response.data.attendees);
            } catch (err) {
                setError("Failed to fetch attendees.");
            }
        };

        fetchAttendees();
    }, [eventId]);

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-3">Attendees</h2>
            {error ? (
                <p className="text-red-500">{error}</p>
            ) : attendees.length > 0 ? (
                <ul className="list-disc pl-4">
                    {attendees.map((user) => (
                        <li key={user._id}>{user.fullname.firstname} ({user.email})</li>
                    ))}
                </ul>
            ) : (
                <p>No attendees yet.</p>
            )}
        </div>
    );
};

export default EventAttendees;
