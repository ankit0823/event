
import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'

const UserRegister = () => {
    const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [error, setError] = useState(""); // General Error State
  const [passwordError, setPasswordError] = useState(""); // Password Error State
  const [loading, setLoading] = useState(false); // Loading State

  const navigate = useNavigate();
  const { setUser } = useContext(UserDataContext);

  const validatePassword = (password) => {
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset errors
    setLoading(true); // Start loading

    // Validate fields
    if (!firstname || !lastname || !email || !password) {
      setError("All fields are required!");
      setLoading(false);
      return;
    }

    // Validate Password
    if (!validatePassword(password)) {
      setLoading(false);
      return;
    }

    const newUser = {
      fullname: {
        firstname,
        lastname,
      },
      email,
      password,
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/register`,newUser
      );

      if (response.status === 201) {
        const data = response.data;
        setUser(data.user);
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Signup failed. Try again.");
      } else {
        setError("Network error. Please check your connection.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className='w-full max-w-md p-8 bg-white shadow-lg rounded-xl'>
        
        <form onSubmit={handleSubmit}>
          <h3 className="text-lg font-medium mb-2">What's your name</h3>
          <div className="flex gap-3 mb-5">
            <input
              className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 text-lg placeholder:text-base"
              type="text"
              placeholder="Firstname"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />

            <input
              className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 text-lg placeholder:text-base"
              type="text"
              placeholder="Lastname"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
          </div>

          <h3 className="text-lg font-medium mb-2">What's your email</h3>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#eeeeee] rounded px-4 py-2 w-full text-lg placeholder:text-base"
            type="email"
            placeholder="example@gmail.com"
          />

          <h3 className="text-lg font-medium mb-2 mt-4">Enter Password</h3>
          <input
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              validatePassword(e.target.value);
            }}
            className="bg-[#eeeeee] mb-3 rounded px-4 py-2 w-full text-lg placeholder:text-base"
            type="password"
            placeholder="Password"
          />

          {/* Password Error Message */}
          {passwordError && <p className="text-red-500 text-sm mb-3">{passwordError}</p>}

          {/* General Error Message */}
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300 ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#c44e1d]"
            }`}
          >
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </form>

        <p className="text-center mt-2">
          Already have an account?{" "}
          <Link to="/" className="text-blue-600">
            Login as User
          </Link>
        </p>

        <div>
        <p className="text-[10px] mt-5 leading-tight">
          By proceeding, you consent to get calls, WhatsApp, or SMS messages,
          including by automated means, from Uber and its affiliates to the
          number you provide.
        </p>
      </div>
      </div>

      
    </div>
  );

}

export default UserRegister
