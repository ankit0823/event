import { useState } from "react";
import axios from "axios";

const DeleteEvent = ({ event, closeModal, refresh }) => {
  const [eventName, setEventName] = useState("");

  const handleDelete = async () => {
    if (eventName !== event.title) {
      alert("Event name does not match. Please enter the correct name.");
      return;
    }
  
    try {
      const token = localStorage.getItem("token"); // Ensure token is retrieved correctly
  
      if (!token) {
        alert("Unauthorized: No token found. Please log in again.");
        return;
      }
  
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/events/delete/${event._id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in request
        },
      });
  
      alert("Event deleted successfully!");
      refresh();
      closeModal();
    } catch (error) {
      console.error("Failed to delete event:", error);
      alert("Failed to delete event. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
        <p className="mb-2">Enter the event name to confirm deletion:</p>
        <input
          type="text"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          className="w-full p-2 border rounded-lg mb-4"
          placeholder="Enter event name"
        />
        <div className="flex justify-end space-x-2">
          <button onClick={closeModal} className="bg-gray-400 text-white px-4 py-2 rounded-lg">Cancel</button>
          <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteEvent;
