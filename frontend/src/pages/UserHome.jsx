import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import UserJoinedEvent from "../components/UserJoinedEvents";

const UserHome = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [joinedEvents, setJoinedEvents] = useState(new Set()); // Store joined event IDs
  const [showModal, setShowModal] = useState(false);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/events/allEvents`
      );
      setEvents(response.data.events);
      setFilteredEvents(response.data.events);
    } catch (err) {
      setError("Failed to fetch events. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserJoinedEvents = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/user/user/joined-events`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        const joinedEventIds = new Set(
          response.data.events.map((event) => event._id)
        );
        setJoinedEvents(joinedEventIds);
      }
    } catch (err) {
      console.error("Failed to fetch joined events:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchUserJoinedEvents(); // Fetch joined events on component mount
  }, []);

  const handleJoinEvent = async (eventId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to join an event.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/user/join-event/${eventId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        alert("Successfully joined the event!");
        setJoinedEvents((prev) => new Set(prev).add(eventId)); // Update state
      }
    } catch (error) {
      console.error("Error joining event:", error);

      // Handle different error responses from the backend
      if (error.response) {
        if (error.response.status === 400) {
          alert(error.response.data.error || "Invalid request.");
        } else if (error.response.status === 404) {
          alert("Event not found.");
        } else if (error.response.status === 401) {
          alert("Unauthorized. Please log in again.");
        } else {
          alert("Failed to join event. Please try again.");
        }
      } else {
        alert("Network error. Please check your connection.");
      }
    }
  };

  const handleCancelEvent = async (eventId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to cancel your event participation.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/user/cancel-event/${eventId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        alert("Successfully canceled the event!");
        setJoinedEvents((prev) => {
          const updatedEvents = new Set(prev);
          updatedEvents.delete(eventId);
          return updatedEvents;
        });
      }
    } catch (error) {
      console.error("Error canceling event:", error);
      alert(
        error.response?.data?.error ||
          "Failed to cancel event. Please try again."
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-4 space-y-4">
        <h2 className="text-xl font-bold">User Panel</h2>
        <nav>
          <ul className="space-y-2">
            <li className="p-2 bg-gray-800 rounded">Dashboard</li>

            <Link to="/logout" className="p-2 hover:bg-gray-700 rounded">
              Logout
            </Link>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Top Navigation Bar */}
        <div className="flex justify-between items-center bg-white p-4 shadow-md rounded-lg mb-6">
          <h1 className="text-2xl font-bold text-blue-700">Event List</h1>
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
            className="w-1/3 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
          >
            Show Joined Events
          </button>
        </div>

        {/* Event List Table */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Event List</h2>
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">#</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Category</th>
                <th className="border p-2">Organize Date</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event, index) => (
                <tr key={event._id} className="text-center">
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{event.title}</td>
                  <td className="border p-2">{event.category}</td>
                  <td className="border p-2">
                    {new Date(event.date).toDateString()}
                  </td>
                  <td className="border p-2 text-green-500">Active</td>
                  <td className="border p-2 flex justify-center space-x-2">
                    
                      
                    
                      <button
                        className="text-green-500 hover:text-green-700"
                        onClick={() => handleJoinEvent(event._id)}
                      >
                        Join
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleCancelEvent(event._id)}
                      >
                        Cancel
                      </button>
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Popup Modal for Joined Events */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
              <UserJoinedEvent />
              <div className="text-center mt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserHome;
