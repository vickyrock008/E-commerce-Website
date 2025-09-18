// src/components/Navbar.jsx

import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartPopup from './CartPopup';
import { ShoppingCart, User, LogOut, ShieldCheck, Search } from 'lucide-react';
import logoImage from '../assets/images/beef_images/1.png';
import { UserContext } from '../context/UserContext';

export default function Navbar({ cartItems, removeFromCart, updateQuantity }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const { user, logout, token } = useContext(UserContext); // ✨ Get token from context
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`);
      setSearchQuery(""); // Clear search bar after searching
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img src={logoImage} alt="Classic Meat Logo" className="h-24 w-auto object-contain" />
        </Link>

        {/* --- Main Links and Search Bar --- */}
        <div className="flex-grow flex justify-center items-center">
            <div className="hidden md:flex space-x-8 items-center">
                <Link to="/" className="text-gray-700 hover:text-red-600">Home</Link>
                <Link to="/shop" className="text-gray-700 hover:text-red-600">Shop</Link>
                <Link to="/about" className="text-gray-700 hover:text-red-600">About</Link>
                <Link to="/contact" className="text-gray-700 hover:text-red-600">Contact</Link>
                <Link to="/certification" className="text-gray-700 hover:text-red-600">Certifications</Link>
            </div>
            <form onSubmit={handleSearch} className="relative ml-8">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products..."
                    className="border rounded-full py-2 pl-4 pr-10"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2">
                    <Search className="text-gray-500" />
                </button>
            </form>
        </div>

        {/* --- User and Cart Links --- */}
        <div className="flex space-x-4 items-center">
          {/* ✨ This is the fix: check for both user and token */}
          {user && token ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" className="hidden lg:flex items-center text-blue-600 hover:text-blue-800">
                  <ShieldCheck className="h-5 w-5 mr-2" />
                  <span>Admin</span>
                </Link>
              )}
              <Link to="/dashboard" className="hidden lg:flex items-center text-gray-700 hover:text-red-600">
                <User className="h-5 w-5 mr-2" />
                <span>Orders</span>
              </Link>
              <button onClick={logout} className="hidden lg:flex items-center text-gray-700 hover:text-red-600">
                <LogOut className="h-5 w-5 mr-1" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-red-600">Login</Link>
              <Link to="/register" className="text-gray-700 hover:text-red-600">Register</Link>
            </>
          )}

          <button onClick={() => setCartOpen(true)} className="relative flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2" />
            <span className="hidden md:inline">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
      <CartPopup
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
      />
    </nav>
  );
}