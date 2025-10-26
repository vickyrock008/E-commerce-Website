// src/context/UserContext.jsx

import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast'; // <--- FIX 1: IMPORT TOAST
import api from '../api/axiosConfig';     // <--- FIX 2: IMPORT API

export const UserContext = createContext(null);

export default function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse user data from local storage", error);
        // If data is corrupt, log out to clear it
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    // ✨ THE FIX IS HERE: Redirect to the home page instead of just reloading.
    window.location.href = '/';
  };


  const loginWithGoogle = (credentialResponse, navigate) => {
    return toast.promise(
      // Send the Google token to our new backend endpoint
      api.post('/api/auth/google', {
        token: credentialResponse.credential,
      }),
      {
        loading: 'Signing in...',
        success: (response) => {
          // On success, get the user and our custom JWT from the backend
          const { user, access_token } = response.data;
          
          // Use the existing login function to save the session
          login(user, access_token);
          
          // Send them to the dashboard or home
          navigate(user.role === 'admin' ? '/admin' : '/dashboard');
          return 'Login successful!';
        },
        error: 'Google sign-in failed. Please try again.',
      }
    );
  };

  return (
    <UserContext.Provider
      // ✨ 4. Add loginWithGoogle to the value prop
      value={{ user, token, login, logout, loading, loginWithGoogle }}
    >
      {children}
    </UserContext.Provider>
  );
}