// src/pages/Checkout.jsx

import React, { useState, useContext, useEffect } from 'react';
import api from '../api/axiosConfig';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export default function Checkout({ cartItems, clearCart }) {
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    // ✨ Pre-fill the name field with the logged-in user's name
    if (user) {
      setCustomerInfo(prevInfo => ({...prevInfo, name: user.name, email: user.email }));
    }
  }, [user]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleInputChange = (e) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!user) {
        toast.error("Please log in to place an order.");
        navigate('/login');
        return;
    }

    const orderData = {
      user_id: user.id,
      items: cartItems.map(item => ({
        product_id: item.id,
        qty: item.qty,
      })),
      // ✨ Add the customer's billing details to the data we send
      customer_name: customerInfo.name,
      customer_phone: customerInfo.phone,
      customer_address: customerInfo.address,
    };
    
    toast.promise(
      api.post(`/api/checkout/`, orderData),
      {
        loading: 'Placing your order...',
        success: (response) => {
          const orderUID = response.data.order_uid;
          clearCart();
          navigate('/order-confirmation'); 
          return `Order placed successfully!`;
        },
        error: 'Failed to place order. An item in your cart may be out of stock.',
      }
    );
  };

  if (cartItems.length === 0) {
    return (
        <div className="text-center p-12">
            <h1 className="text-2xl font-bold">Your Cart is Empty</h1>
            <p className="mt-2 text-gray-600">Please add some products to your cart before checking out.</p>
        </div>
    );
  }
  
  return (
    <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-center mb-10">Checkout</h1>
        <div className="grid md:grid-cols-2 gap-12">
            {/* Billing Details Form */}
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 border-b pb-4">Billing Details</h2>
                <form onSubmit={handleSubmitOrder} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium">Full Name *</label>
                        <input type="text" name="name" id="name" required value={customerInfo.name} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium">Email Address *</label>
                        <input type="email" name="email" id="email" required value={user?.email || ''} readOnly className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-gray-100 cursor-not-allowed" />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium">Phone Number *</label>
                        <input type="tel" name="phone" id="phone" required value={customerInfo.phone} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium">Street Address *</label>
                        <textarea name="address" id="address" required value={customerInfo.address} onChange={handleInputChange} rows="3" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"></textarea>
                    </div>

                    <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 font-semibold mt-6">
                        Place Order (Cash on Delivery)
                    </button>
                </form>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-100 p-8 rounded-lg shadow-inner">
                <h2 className="text-2xl font-bold mb-6 border-b pb-4">Your Order</h2>
                <div className="space-y-4">
                    {cartItems.map(item => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                            <span>{item.name} × {item.qty}</span>
                            <span className="font-medium">₹{(item.price * item.qty).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                <hr className="my-6 border-gray-300" />
                <div className="flex justify-between font-bold text-xl">
                    <span>Total</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                </div>
            </div>
        </div>
    </div>
  );
}