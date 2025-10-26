// src/pages/OrderConfirmation.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

import confirmBgImage from '../assets/images/beef_images/white.png';

export default function OrderConfirmation() {
  return (
    <div
      className="w-full min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: `url(${confirmBgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-black/10"></div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
        className="relative z-10 w-full max-w-lg text-center"
      >
        <div className="bg-white/90 backdrop-blur-md p-10 md:p-16 rounded-2xl shadow-2xl">
          <CheckCircle className="text-green-600 w-24 h-24 mb-8 mx-auto" />
          <h1 className="text-4xl font-extrabold text-gray-800">Thank You For Your Order!</h1>
          <p className="mt-4 text-lg text-gray-600">
            Payment will be collected upon delivery (Cash on Delivery).
          </p>
          <p className="mt-2 text-lg text-gray-600">
            We will contact you shortly to confirm your order details.
          </p>
          <Link
            to="/shop"
            className="mt-10 inline-block bg-red-600 text-white font-semibold py-3 px-10 rounded-full shadow-lg hover:bg-red-700 transition-colors transform hover:scale-105"
          >
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
