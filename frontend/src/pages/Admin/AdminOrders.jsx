// src/pages/Admin/AdminOrders.jsx

import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react'; // Import the 'X' icon for the close button

// ✨ New Modal Component for Order Details
const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4">Order #{order.order_uid} Details</h2>
        
        {/* Billing Details Section */}
        <div className="mb-6">
            <h3 className="text-lg font-semibold border-b pb-2 mb-2">Billing Information</h3>
            <p><strong>Name:</strong> {order.customer_name}</p>
            <p><strong>Email:</strong> {order.customer.email}</p>
            <p><strong>Phone:</strong> {order.customer_phone}</p>
            <p><strong>Address:</strong> {order.customer_address}</p>
        </div>

        {/* Order Items Section */}
        <div>
            <h3 className="text-lg font-semibold border-b pb-2 mb-2">Order Items</h3>
            <ul className="space-y-2">
                {order.items.map((item, index) => (
                    <li key={index} className="flex justify-between">
                        <span>{item.qty} x {item.product_name}</span>
                        <span>₹{item.subtotal.toFixed(2)}</span>
                    </li>
                ))}
            </ul>
            <div className="text-right font-bold text-xl mt-4 pt-4 border-t">
                Total: ₹{order.total.toFixed(2)}
            </div>
        </div>
      </div>
    </div>
  );
};


export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null); // ✨ State for the modal

  const fetchOrders = () => {
    setLoading(true);
    api.get(`/api/orders/?show_archived=${showArchived}`)
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => toast.error("Could not fetch orders."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, [showArchived]);

  const handleStatusChange = (orderId, newStatus) => {
    toast.promise(
      api.put(`/api/orders/${orderId}`, { status: newStatus }),
      {
        loading: 'Updating status...',
        success: () => {
          fetchOrders();
          return 'Order status updated!';
        },
        error: 'Failed to update status.',
      }
    );
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Orders</h1>
        <label className="flex items-center cursor-pointer">
          <span className="mr-3 text-sm font-medium text-gray-900">Show Archived Orders</span>
          <div className="relative">
            <input type="checkbox" checked={showArchived} onChange={() => setShowArchived(!showArchived)} className="sr-only"/>
            <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${showArchived ? 'transform translate-x-6' : ''}`}></div>
          </div>
        </label>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer Name</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
                <tr><td colSpan="6" className="text-center p-8 text-gray-500">{showArchived ? 'No archived orders found.' : 'No active orders found.'}</td></tr>
            ) : orders.map(order => (
              <tr key={order.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">#{order.order_uid}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{order.customer_name}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{new Date(order.created_at).toLocaleDateString()}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">₹{order.total.toFixed(2)}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="p-1 border rounded-md"
                    disabled={order.is_archived}
                  >
                    <option value="pending">Pending</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {/* ✨ Add the button to open the modal */}
                  <button onClick={() => setSelectedOrder(order)} className="text-blue-600 hover:underline">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✨ Render the modal if an order is selected */}
      <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </div>
  );
}