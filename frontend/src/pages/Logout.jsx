import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const logoutUser = async () => {
            try {
                await axios.post(`${import.meta.env.VITE_BASE_URL}/events/logout`); // Adjust endpoint as needed
            } catch (error) {
                console.error('Error during logout:', error);
            } finally {
                // Clear any stored authentication data
                localStorage.removeItem('token');
                // Redirect the user to the login page
                navigate('/');
            }
        };

        logoutUser();
    }, [navigate]);

    return (
        <div>
            <p>Logging out...</p>
        </div>
    );
};

export default Logout;