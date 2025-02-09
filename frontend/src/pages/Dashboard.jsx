import { useEffect, useState } from "react";
import axios from "axios";
import CreateEvent from "../components/CreateEvevnt";
import DeleteEvent from "../components/DeleteEvent";
import EditEvent from "../components/EditEvent";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null); // Fix: Added state for selected event

  // Fetch all events from the backend
  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/events/allEvents`);
      setEvents(response.data.events);
      setFilteredEvents(response.data.events);
    } catch (err) {
      setError("Failed to fetch events. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle search bar input
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (query === "") {
      setFilteredEvents(events);
      return;
    }
    const filtered = events.filter(
      (event) =>
        event.title.toLowerCase().includes(query) ||
        event.category.toLowerCase().includes(query) ||
        event.date.includes(query)
    );
    setFilteredEvents(filtered);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-4 space-y-4">
        <h2 className="text-xl font-bold">Admin Panel</h2>
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
          <h1 className="text-2xl font-bold text-blue-700">Dashboard</h1>
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-1/3 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={() => setIsPopupOpen(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
          >
            + Create Event
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
                  <td className="border p-2">{new Date(event.date).toDateString()}</td>
                  <td className="border p-2 text-green-500">Active</td>
                  <td className="border p-2 flex justify-center space-x-2">
                    
                    <button
                      className="text-green-500"
                      onClick={() => {
                        setSelectedEvent(event);// Set selected event
                        setIsEditPopupOpen(true)} // Open edit modal
                      }
                    >
                      ✏️ Edit
                    </button>
                    <button className="text-red-500" onClick={() => { setSelectedEvent(event); setIsDeletePopupOpen(true); }}>🗑 Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Create Event Modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <button
              onClick={() => setIsPopupOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
            >
              ✖
            </button>
            <CreateEvent />
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {isEditPopupOpen && selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <button
              onClick={() => setIsEditPopupOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
            >
              ✖
            </button>
            <EditEvent setIsEditPopupOpen={setIsEditPopupOpen}
              eventId={selectedEvent._id} // Pass only eventId
              onUpdateSuccess={() => {
                // setIsEditPopupOpen(false);
                fetchEvents(); // Refresh event list after update
              }}
            />
          </div>
        </div>
      )}

{isDeletePopupOpen && selectedEvent && <DeleteEvent event={selectedEvent} closeModal={() => setIsDeletePopupOpen(false)} refresh={fetchEvents} />}
    </div>
  );
};

export default Dashboard;
