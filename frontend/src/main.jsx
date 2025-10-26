import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import UserContextProvider from './context/UserContext.jsx';
// ✨ 1. Import the Google OAuth Provider
import { GoogleOAuthProvider } from '@react-oauth/google';

// ✨ 2. Get the Client ID from environment variables
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* ✨ 3. Wrap your entire app in the GoogleOAuthProvider */}
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
        <UserContextProvider>
          <App />
        </UserContextProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
