import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { UserDataContext } from '../context/UserContext';

const UserProtectWrapper = ({ children}) => {

    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] =useState(true);
    const { user, setUser } = useContext(UserDataContext);

    useEffect(() => {
        if(!token){
            navigate('/');
        }

        axios.get(`${import.meta.env.VITE_BASE_URL}/user/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((response) => {
            if(response.status === 200){
                setUser( response.data);
                setIsLoaded(false);
            }
        })
        .catch((error) => {
            console.log(error);
            navigate('/');
        })

    }, [token])

    if(isLoaded){
        return (
            <div>
                <h1>Loading...</h1>
            </div>
        )
    }

    return (
    <>
        {children}
    </>
  )
}

export default UserProtectWrapper
