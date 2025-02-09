import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditEvent = ({ onUpdateSuccess, eventId }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        category: ""
    });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!eventId) {
            setMessage("Invalid event ID.");
            return;
        }
        
        const fetchEventDetails = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/events/eventsId/${eventId}`);
                setFormData(response.data);
            } catch (error) {
                console.error("Error fetching event details:", error);
                setMessage("Failed to load event details.");
            }
        };

        fetchEventDetails();
    }, [eventId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        if (!eventId) {
            setMessage("Invalid event ID.");
            return;
        }

        try {
            await axios.put(`${import.meta.env.VITE_BASE_URL}/events/update/${eventId}`, formData);
            setMessage("Event updated successfully!");
            onUpdateSuccess();
            navigate("/dashboard");
        } catch (error) {
            console.error("Update error:", error.response?.data || error.message);
            setMessage(error.response?.data?.error || "Failed to update event. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4">Edit Event</h2>
            {message && <p className="text-red-500">{message}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Event Title"
                    className="w-full p-2 border border-gray-300 rounded"
                />
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Event Description"
                    className="w-full p-2 border border-gray-300 rounded"
                ></textarea>
                <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                />
                <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Event Category"
                    className="w-full p-2 border border-gray-300 rounded"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    {loading ? "Updating..." : "Update Event"}
                </button>
            </form>
        </div>
    );
};

export default EditEvent;
