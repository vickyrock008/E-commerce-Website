// src/App.jsx

import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast'; // Import toast here

// Corrected import paths
import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import CertificationPage from './pages/CertificationPage.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Checkout from './pages/Checkout.jsx';
// ✨ 1. Import new SignIn page
import SignIn from './pages/SignIn.jsx';
// ✨ (Removed Login and Register imports)
import Dashboard from './pages/Dashboard.jsx';
import SearchResults from './pages/SearchResults.jsx';
import OrderConfirmation from './pages/OrderConfirmation.jsx';
// ✨ (Removed ForgotPassword and ResetPassword imports)

// Corrected Admin component import paths
import AdminLayout from './pages/Admin/AdminLayout.jsx';
// ✨ Added missing admin component imports
import AdminProducts from './pages/Admin/AdminProducts.jsx';
import ProductForm from './pages/Admin/ProductForm.jsx';
import AdminOrders from './pages/Admin/AdminOrders.jsx';
import AdminCategories from './pages/Admin/AdminCategories.jsx';
import AdminContact from './pages/Admin/AdminContact.jsx';
import AdminCustomers from './pages/Admin/AdminCustomers.jsx';

export default function App() {
  const [cartItems, setCartItems] = useState([]);
  const location = useLocation();

  // Check if the current route is an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  const addToCart = (productToAdd) => {
    // Check if productToAdd exists and has a stock property
    if (!productToAdd || typeof productToAdd.stock === 'undefined') {
        toast.error("Product information is incomplete.");
        return;
    }

    if (productToAdd.stock <= 0) {
      toast.error("Sorry, this item is out of stock.");
      return;
    }

    const existingItem = cartItems.find(item => item.id === productToAdd.id);

    if (existingItem && existingItem.qty >= productToAdd.stock) {
      toast.error(`You cannot add more, only ${productToAdd.stock} units are available.`);
      return;
    }

    setCartItems(currentItems => {
      if (existingItem) {
        return currentItems.map(item =>
          item.id === productToAdd.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...currentItems, { ...productToAdd, qty: 1 }];
    });
    toast.success(`${productToAdd.name} added to cart!`);
  };

  const removeFromCart = (productIdToRemove) => {
    setCartItems(currentItems =>
      currentItems.filter(item => item.id !== productIdToRemove)
    );
  };

  const updateQuantity = (productId, newQuantity) => {
    const productInCart = cartItems.find(item => item.id === productId);

    // Check if productInCart exists and has a stock property
    if (!productInCart || typeof productInCart.stock === 'undefined') {
        toast.error("Cart item information is incomplete.");
        return;
    }


    if (newQuantity > productInCart.stock) {
      toast.error(`Only ${productInCart.stock} units are available.`);
      return;
    }

    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      setCartItems(currentItems =>
        currentItems.map(item =>
          item.id === productId ? { ...item, qty: newQuantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    // The outer div handles the min-height and flex-col layout
    <div className='min-h-screen flex flex-col font-sans'>
      <Toaster position="bottom-center" />

      {/* Only show the public Navbar if not in the admin section */}
      {!isAdminRoute &&
        <Navbar
          cartItems={cartItems}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
        />
      }

      {/* The main content area grows to fill available space */}
      {/* We remove padding and container here to allow pages to go full-bleed */}
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<Home addToCart={addToCart} />} />
          <Route path='/shop' element={<Shop addToCart={addToCart} />} />
          <Route path='/product/:id' element={<ProductDetail addToCart={addToCart} />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/certification' element={<CertificationPage />} />
          <Route path='/checkout' element={<Checkout cartItems={cartItems} clearCart={clearCart} />} />
          
          {/* ✨ 2. Updated auth routes */}
          <Route path='/signin' element={<SignIn />} />
          {/* (Removed /login, /register, /forgot-password, /reset-password) */}

          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/search' element={<SearchResults addToCart={addToCart} />} />
          <Route path='/order-confirmation' element={<OrderConfirmation />} />
          
          {/* Admin Routes */}
          {/* ✨ Restored nested admin routes and added closing tag */}
          <Route path='/admin' element={<AdminLayout />}>
            {/* This 'index' route is the default for /admin */}
            <Route index element={<AdminProducts />} />
            
            {/* These are the other child routes */}
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/edit/:id" element={<ProductForm />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="contact" element={<AdminContact />} />
            <Route path="customers" element={<AdminCustomers />} />
          </Route>
        </Routes>
      </main>

      {/* Only show the public Footer if not in the admin section */}
      {!isAdminRoute && <Footer />}
    </div>
  );
}

