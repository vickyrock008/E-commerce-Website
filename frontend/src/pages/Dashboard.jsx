// src/pages/Dashboard.jsx

import React, { useContext, useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { UserContext } from '../context/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { X, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion'; // <--- THIS WAS THE MISSING IMPORT

import dashboardBgImage from '@/assets/images/bg_img/about.png';

// Modal Component for Confirming Cancellation
const ConfirmCancelModal = ({ order, onClose, onConfirm }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Confirm Cancellation</h2>
        <p className="text-gray-600 mb-6">Are you sure you want to cancel Order <span className="font-bold text-red-600">#{order.order_uid}</span>? This action cannot be undone.</p>
        <div className="flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-colors">
            Nevermind
          </button>
          <button type="button" onClick={() => onConfirm(order.id)} className="px-6 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors">
            Yes, Cancel Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { user, loading: userLoading, token } = useContext(UserContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [cancelModalOrder, setCancelModalOrder] = useState(null);

  const fetchOrders = () => {
    if (token) {
      setOrdersLoading(true);
      api.get(`/api/users/me/orders`)
        .then(response => { setOrders(response.data); })
        .catch(error => { toast.error("Failed to fetch orders."); })
        .finally(() => { setOrdersLoading(false); });
    } else {
      setOrdersLoading(false);
    }
  }

  useEffect(() => {
    if (!userLoading) {
      if (!token) {
        toast.error("Please log in to view your dashboard.");
        navigate('/login');
      } else if (user) {
        fetchOrders();
      }
    }
  }, [user, token, userLoading, navigate]);

  const handleConfirmCancel = (orderId) => {
    toast.promise(
      api.put(`/api/users/me/orders/${orderId}/cancel`),
      {
        loading: 'Cancelling order...',
        success: () => {
          fetchOrders(); // Refresh the order list
          setCancelModalOrder(null); // Close the modal
          return 'Order cancelled successfully.';
        },
        error: 'Failed to cancel order. It may have already been shipped or processed.',
      }
    );
  };

  const getStatusChipClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (userLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <>
      <div
        className="w-full min-h-screen page-section"
        style={{
          backgroundImage: `url(${dashboardBgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="container mx-auto max-w-5xl">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-4 text-gray-800"
          >
            Welcome, {user.name}!
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 mb-10"
          >
            Here you can view and manage your past orders.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/90 backdrop-blur-md p-6 md:p-8 rounded-2xl shadow-2xl"
          >
            <h2 className="text-2xl font-semibold mb-6 border-b pb-4 text-gray-800">Your Order History</h2>
            {ordersLoading ? (
              <div className="flex justify-center items-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                <span className="ml-3 text-lg text-gray-600">Loading your orders...</span>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center p-12">
                <p className="text-lg text-gray-600">You haven't placed any orders yet.</p>
                <Link 
                  to="/shop" 
                  className="mt-6 inline-block bg-red-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-red-700 transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map(order => (
                  <div key={order.id} className="bg-white/70 border border-gray-200 rounded-xl p-4 md:p-6 shadow-md">
                    <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
                      <div>
                        <p className="font-bold text-xl text-red-700">Order #{order.order_uid}</p>
                        <p className="text-sm text-gray-500">
                          Placed on: {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                      <div className="text-left md:text-right mt-3 md:mt-0">
                        <p className="font-bold text-xl text-gray-800">Total: ₹{order.total.toFixed(2)}</p>
                        <span className={`text-sm font-medium px-3 py-1 rounded-full capitalize ${getStatusChipClass(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-2">Items:</h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-600 pl-2">
                            {order.items.map((item, index) => (
                              <li key={index}>
                                {item.qty} x {item.product_name} - <span className="font-medium">₹{item.subtotal.toFixed(2)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        {order.status === 'pending' && (
                          <button
                            onClick={() => setCancelModalOrder(order)}
                            className="bg-red-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors mt-4 md:mt-0 self-start md:self-center"
                          >
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Render the modal */}
      <ConfirmCancelModal
        order={cancelModalOrder}
        onClose={() => setCancelModalOrder(null)}
        onConfirm={handleConfirmCancel}
      />
    </>
  );
}