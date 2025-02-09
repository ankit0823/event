import { useEffect, useState } from "react";
import axios from "axios";

const UserJoinedEvent = () => {
  const [events, setEvents] = useState([]);  // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token for authentication
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/user/user/joined-events`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response);
        

        // ✅ Ensure `response.data.events` exists, otherwise set to empty array
        setEvents(response.data?.joinedEvents
            || []);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, []);

  return (
    <div className="h-[400px] p-6 bg-white shadow-lg overflow-hidden rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-5">Joined Events</h2>

      {loading && <p className="text-center text-gray-600">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && events?.length === 0 && (
        <p className="text-center text-gray-600">You haven't joined any events yet.</p>
      )}

      <div className="grid gap-4 ">
        {events?.map((event) => (
          <div key={event._id} className="bg-gray-100 p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold">{event.title}</h3>
            <p className="text-gray-700">{event.description}</p>
            <p className="text-sm text-gray-500">Category: {event.category}</p>
            <p className="text-sm text-gray-500">
              Date: {new Date(event.date).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserJoinedEvent;
