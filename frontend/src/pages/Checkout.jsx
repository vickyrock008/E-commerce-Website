// src/pages/Checkout.jsx

import React, { useState, useContext, useEffect } from 'react';
import api from '../api/axiosConfig';
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';

import checkoutBgImage from '../assets/images/bg_img/checkout.png';

export default function Checkout({ cartItems, clearCart }) {
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, loading: userLoading } = useContext(UserContext);

  // ▼▼▼ FIX 1: Refined useEffect ▼▼▼
  // This effect now only runs when userLoading changes from true to false,
  // preventing potential re-renders during typing if user data re-fetches.
  useEffect(() => {
    if (!userLoading && user) {
      setCustomerInfo(prevInfo => ({
        ...prevInfo,
        name: user.name || '',
        email: user.email || ''
        // We avoid setting phone/address here unless you specifically want to prefill them
      }));
    }
    // Only depend on userLoading and user object reference
  }, [userLoading, user]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prevInfo => ({
      ...prevInfo,
      [name]: value
    }));
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to place an order.");
      navigate('/login'); // Consider changing '/login' to '/signin' if that's your unified login route
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      navigate('/shop');
      return;
    }

    // Basic phone number validation (example: must be digits, maybe length check)
    if (!/^\d+$/.test(customerInfo.phone)) {
        toast.error("Please enter a valid phone number (digits only).");
        return;
    }
    // Add more specific validation if needed (e.g., length)
    // if (customerInfo.phone.length !== 10) {
    //    toast.error("Phone number must be 10 digits.");
    //    return;
    // }


    setIsSubmitting(true);

    const orderData = {
      user_id: user.id,
      items: cartItems.map(item => ({
        product_id: item.id,
        qty: item.qty,
      })),
      customer_name: customerInfo.name,
      customer_phone: customerInfo.phone,
      customer_address: customerInfo.address,
    };

    toast.promise(
      api.post(`/api/checkout/`, orderData),
      {
        loading: 'Placing your order...',
        success: (response) => {
          clearCart();
          navigate('/order-confirmation');
          return `Order placed successfully!`;
        },
        error: (err) => {
          setIsSubmitting(false);
          return err.response?.data?.detail || 'Failed to place order. An item may be out of stock.';
        },
      }
    );
  };

  if (cartItems.length === 0 && !isSubmitting) {
    return (
      <div className="text-center p-12 md:p-20">
        <h1 className="text-3xl font-bold">Your Cart is Empty</h1>
        <p className="mt-4 text-lg text-gray-600">Please add some products to your cart before checking out.</p>
        <Link
          to="/shop"
          className="mt-8 inline-block bg-red-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-red-700 transition-colors"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  // Adjusted FormInput component definition to be outside the main component if preferred, or keep it inside.
  const FormInput = ({ label, name, type = 'text', required = false, value, onChange, readOnly = false }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} {required && '*'}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        required={required}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className={`mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-3 ${readOnly ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-red-500 focus:border-red-500'}`}
      />
    </div>
  );

  return (
    <div
      className="w-full min-h-screen page-section"
      style={{
        backgroundImage: `url(${checkoutBgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-800">Checkout</h1>
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">

          {/* Billing Details Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-6 border-b pb-4 text-gray-800">Billing Details</h2>
            <form onSubmit={handleSubmitOrder} className="space-y-5">
              <FormInput label="Full Name" name="name" required value={customerInfo.name} onChange={handleInputChange} readOnly={userLoading} />
              <FormInput label="Email Address" name="email" type="email" required value={customerInfo.email || ''} onChange={() => {}} readOnly />

              {/* ▼▼▼ FIX 2: Changed type="tel" to type="text" for diagnostics ▼▼▼ */}
              <FormInput label="Phone Number" name="phone" type="text" required value={customerInfo.phone} onChange={handleInputChange} />

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Street Address *</label>
                <textarea
                  name="address"
                  id="address"
                  required
                  value={customerInfo.address}
                  onChange={handleInputChange}
                  rows="4"
                  className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-3 focus:ring-red-500 focus:border-red-500"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || userLoading}
                className="w-full flex items-center justify-center bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 font-semibold text-lg transition-colors mt-6 disabled:bg-gray-400"
              >
                <Lock className="w-5 h-5 mr-2" />
                {isSubmitting ? 'Placing Order...' : 'Place Order (Cash on Delivery)'}
              </button>
            </form>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl h-fit"
          >
            <h2 className="text-2xl font-bold mb-6 border-b pb-4 text-gray-800">Your Order</h2>
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-800">{item.name} × {item.qty}</span>
                  <span className="font-medium text-gray-600">₹{(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <hr className="my-6 border-gray-300" />
            <div className="flex justify-between font-bold text-2xl text-gray-900">
              <span>Total</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
