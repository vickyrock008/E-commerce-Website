// src/components/Navbar.jsx

import React, { useState, useContext } from 'react';
// ✨ Added missing imports
import { Link, useNavigate } from 'react-router-dom';
import CartPopup from './CartPopup';
import { ShoppingCart, User, LogOut, ShieldCheck, Search, Menu, X } from 'lucide-react';
import logoImage from '../assets/images/beef_images/1.png';
// ✨ Corrected import path
import { UserContext } from '../context/UserContext.jsx';

export default function Navbar({ cartItems, removeFromCart, updateQuantity }) {
  // ✨ Added missing state and variables
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const { user, logout, token } = useContext(UserContext);
  const navigate = useNavigate();

  // ✨ Added missing function body
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`);
      setSearchQuery(""); // Clear search bar after searching
      setIsMobileMenuOpen(false); // Close mobile menu on search
    }
  }; // ✨ This closing brace was duplicated, causing the error. It is now fixed.

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className="text-gray-700 hover:text-red-600 transition-colors py-2"
      onClick={() => setIsMobileMenuOpen(false)}
    >
      {children}
    </Link>
  );

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-lg">
        {/* ✨ Added full component body */}
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <div className="flex justify-between items-center">
            
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
              <img src={logoImage} alt="Classic Meat Logo" className="h-20 md:h-24 w-auto object-contain" />
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/shop">Shop</NavLink>
              <NavLink to="/about">About</NavLink>
              <NavLink to="/contact">Contact</NavLink>
              <NavLink to="/certification">Certifications</NavLink>
            </div>

            {/* Search, Icons, and Mobile Menu Button */}
            <div className="flex items-center space-x-3 md:space-x-4">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="relative hidden sm:block">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="border rounded-full py-2 pl-4 pr-10 w-40 lg:w-56 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600">
                  <Search className="h-5 w-5" />
                </button>
              </form>

              {/* Desktop Icons */}
              <div className="hidden md:flex items-center space-x-3">
                {user && token ? (
                  <>
                    {user.role === 'admin' && (
                      <Link to="/admin" title="Admin Panel" className="p-2 rounded-full text-blue-600 hover:bg-blue-100">
                        <ShieldCheck className="h-6 w-6" />
                      </Link>
                    )}
                    <Link to="/dashboard" title="My Orders" className="p-2 rounded-full text-gray-700 hover:bg-gray-100">
                      <User className="h-6 w-6" />
                    </Link>
                    <button onClick={logout} title="Logout" className="p-2 rounded-full text-gray-700 hover:bg-gray-100">
                      <LogOut className="h-6 w-6" />
                    </button>
                  </>
                ) : (
                  // ✨ 1. Updated Login/Register buttons
                  <>
                    <Link to="/signin" className="px-5 py-2 text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-700">
                      Sign In / Sign Up
                    </Link>
                  </>
                )}
              </div>

              {/* Cart Button (Visible on all sizes) */}
              <button onClick={() => setCartOpen(true)} className="relative p-2 rounded-full text-gray-700 hover:bg-gray-100">
                <ShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-full text-gray-700 hover:bg-gray-100">
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- Mobile Menu --- */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl py-4 z-50">
            <div className="container mx-auto px-4 flex flex-col space-y-3">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/shop">Shop</NavLink>
              <NavLink to="/about">About</NavLink>
              <NavLink to="/contact">Contact</NavLink>
              <NavLink to="/certification">Certifications</NavLink>

              <form onSubmit={handleSearch} className="relative pt-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="border rounded-full py-2 pl-4 pr-10 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 pt-2 text-gray-400 hover:text-red-600">
                  <Search className="h-5 w-5" />
                </button>
              </form>

              <hr className="my-2"/>

              {user && token ? (
                <div className='flex flex-col space-y-3'>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="flex items-center text-blue-600 py-2" onClick={() => setIsMobileMenuOpen(false)}>
                      <ShieldCheck className="h-5 w-5 mr-2" />
                      <span>Admin Panel</span>
                    </Link>
                  )}
                  <Link to="/dashboard" className="flex items-center text-gray-700 py-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <User className="h-5 w-5 mr-2" />
                    <span>My Orders</span>
                  </Link>
                  <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="flex items-center text-gray-700 py-2">
                    <LogOut className="h-5 w-5 mr-2" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                // ✨ 2. Updated mobile menu links
                <div className='flex flex-col space-y-3'>
                  <NavLink to="/signin">Sign In / Sign Up</NavLink>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Cart Popup */}
      <CartPopup
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
      />
    </>
  );
}

