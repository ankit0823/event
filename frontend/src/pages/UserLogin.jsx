import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserDataContext } from '../context/UserContext';
import axios from 'axios';

const UserLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ email: '', password: '', server: '' });
    const { user, setUser } = useContext(UserDataContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({ email: '', password: '', server: '' });

        if (!email.includes('@')) {
            setErrors((prev) => ({ ...prev, email: 'Invalid email address' }));
            return;
        }
        if (password.length < 6) {
            setErrors((prev) => ({ ...prev, password: 'Password must be at least 6 characters long' }));
            return;
        }

        try {
            const userData = { email, password };
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/login`, userData);
            
            if (response.status === 200) {
                const data = response.data;
                setUser(data.user);
                localStorage.setItem('token', data.token);
                navigate('/userHome');
            }
        } catch (error) {
            if (error.response && error.response.data.message) {
                setErrors((prev) => ({ ...prev, server: error.response.data.message }));
            } else {
                setErrors((prev) => ({ ...prev, server: 'Something went wrong. Please try again later.' }));
            }
        }
    };

    // Function for Guest Login
    const handleGuestLogin = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/guest-login`);
            if (response.status === 200) {
                const data = response.data;
                setUser(data.user);
                localStorage.setItem("token", data.token);  // Store token if needed
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Guest login failed:", error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className='w-full max-w-md p-8 bg-white shadow-lg rounded-xl'>
                <form onSubmit={handleSubmit}>
                    <h3 className='text-lg font-medium mb-2'>What's your email</h3>
                    <input 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`bg-[#eeeeee] rounded px-4 py-2 w-full text-lg placeholder:text-base ${errors.email ? 'border border-red-500' : ''}`}
                        type="text" 
                        placeholder="example@gmail.com" 
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}

                    <h3 className='text-lg font-medium mb-2 mt-4'>Enter Password</h3>
                    <input 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`bg-[#eeeeee] rounded px-4 py-2 w-full text-lg placeholder:text-base ${errors.password ? 'border border-red-500' : ''}`}
                        type="password" 
                        placeholder="Password" 
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}

                    <button className='w-full px-4 py-2 rounded bg-[#388eb2] font-semibold text-xl mt-5 text-white'>Login</button>
                </form>

                {errors.server && <p className="text-red-500 text-center mt-4">{errors.server}</p>}

                <p className='text-center mt-2'>
                    New here? <Link to='/user-register' className='text-blue-600'>Register as User</Link>
                </p>
                
                {/* Guest Login Button */}
                <button onClick={handleGuestLogin} className="px-4 py-2 w-full bg-gray-500 text-white rounded">
                Continue as Guest
                </button>
            </div>
        </div>
    );
};

export default UserLogin;
