import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function OrderConfirmation() {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <CheckCircle className="text-green-500 w-24 h-24 mb-6" />
      <h1 className="text-4xl font-bold text-gray-800">Thank You For Your Order!</h1>
      <p className="mt-4 text-gray-600">You will pay with Cash on Delivery.</p>
      <p className="mt-2 text-gray-600">We will contact you shortly to confirm.</p>
      <Link 
        to="/shop" 
        className="mt-8 px-8 py-3 bg-red-600 text-white font-semibold rounded-full shadow-lg hover:bg-red-700 transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  );
}