// src/pages/SignIn.jsx
// This file replaces Login.jsx and Register.jsx

import React, { useState, useContext } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
// ✨ Fix 1: Added .jsx extension to the context import
import { UserContext } from '../context/UserContext.jsx';
import { GoogleLogin } from '@react-oauth/google';
import { Loader2 } from 'lucide-react';

// Using a placeholder image for auth pages
// ✨ Fix 2: Used the '@/' alias for the image path, as seen in your other files
import authBgImage from '@/assets/images/beef_images/white.png';

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginWithGoogle } = useContext(UserContext);

  // Handle Google success
  const handleGoogleSuccess = (credentialResponse) => {
    setLoading(true);
    loginWithGoogle(credentialResponse, navigate).finally(() => {
      setLoading(false);
    });
  };

  // Handle Google failure
  const handleGoogleFailure = () => {
    toast.error("Google sign-in failed. Please try again.");
    setLoading(false);
  };

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: `url(${authBgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-black/30"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-md p-8 md:p-12 rounded-2xl shadow-2xl">
          <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800">
            Sign In / Sign Up
          </h2>
          
          <p className="text-center text-gray-600 mb-8">
            Please use your Google account to continue.
          </p>

          {loading ? (
            <div className="flex justify-center items-center h-10">
              <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            </div>
          ) : (
            <div 
              className="flex justify-center" 
            >
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
                useOneTap
                width="300px"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

