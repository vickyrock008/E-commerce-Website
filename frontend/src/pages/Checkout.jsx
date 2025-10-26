// src/pages/Home.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
// Removed imports for ProductCard and Meat3D as they are now defined in this file.
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Truck, ShieldCheck, Leaf, Star, ShoppingCart } from 'lucide-react';

// --- Asset Fix ---
// Replaced local import with a URL from Unsplash for the hero background
const heroBgImage = 'https://images.unsplash.com/photo-1551028150-60f9f6e62f19?q=80&w=1935&auto=format&fit=crop';

// --- MOCK Meat3D Component ---
// This is a placeholder as the original 3D model component ('../components/Meat3D')
// could not be loaded in this environment.
const Meat3D = () => (
  <div className="w-full h-full flex items-center justify-center bg-red-900/30 rounded-lg backdrop-blur-sm">
    <div className="text-center text-white p-4">
      <motion.div
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Leaf className="w-24 h-24 text-white/50" />
      </motion.div>
      <p className="mt-4 font-semibold text-lg">Premium Quality</p>
      <p className="text-sm text-white/80">(3D Model Placeholder)</p>
    </div>
  </div>
);

// --- MOCK ProductCard Component ---
// This is a placeholder as the original component ('../components/ProductCard')
// could not be loaded in this environment.
const ProductCard = ({ product, addToCart }) => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full transition-all duration-300">
    <div className="w-full h-48 bg-gray-200 overflow-hidden">
      <img
        src={product.imageUrl || 'https://placehold.co/400x300/e2e8f0/94a3b8?text=Meat'}
        alt={product.name || 'Product Image'}
        className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
        onError={(e) => { e.target.src = 'https://placehold.co/400x300/e2e8f0/94a3b8?text=Image+Not+Found'; }}
      />
    </div>
    <div className="p-5 flex flex-col flex-grow">
      <h3 className="text-xl font-bold text-neutral-900 mb-2 truncate">{product.name || 'Product Name'}</h3>
      <p className="text-neutral-600 mb-4 flex-grow text-sm">{product.description || 'Premium product description goes here.'}</p>
      <div className="flex justify-between items-center mt-auto">
        <span className="text-2xl font-extrabold text-red-700">${(product.price || 0).toFixed(2)}</span>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => addToCart(product)}
          className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-md transition-all duration-300"
          aria-label={`Add ${product.name || 'product'} to cart`}
        >
          <ShoppingCart className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  </div>
);


// --- Animation Variants ---

// Parent container to stagger children
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

// Fade in from bottom
const fadeInUp = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

// Fade in from top
const fadeInDown = {
  hidden: { y: -30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
      duration: 0.5,
    },
  },
};

// Zoom in effect
const zoomIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 10,
      duration: 0.7,
    },
  },
};

// Pulse animation for buttons
const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    ease: 'easeInOut',
    repeat: Infinity,
  },
};

// --- Re-styled FeatureCard Component ---
const FeatureCard = ({ icon, title, children }) => (
  <motion.div
    variants={fadeInUp}
    whileHover={{ y: -8, scale: 1.03, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
    className="bg-white p-8 rounded-2xl shadow-lg text-center cursor-pointer transition-shadow duration-300"
  >
    <div className="flex justify-center mb-5">
      <div className="p-4 bg-red-700 rounded-full text-white shadow-lg">
        {icon}
      </div>
    </div>
    <h3 className="text-2xl font-bold text-neutral-900 mb-3">{title}</h3>
    <p className="text-neutral-600 leading-relaxed">{children}</p>
  </motion.div>
);

export default function Home({ addToCart }) {
  const [products, setProducts] = useState([]);

  // --- Logic Fix ---
  useEffect(() => {
    // FIX for 'import.meta.env': Replaced with a relative path.
    // Assumes the API server is on the same origin.
    const VITE_API_URL = ''; 
    
    axios
      .get(VITE_API_URL + '/api/products/')
      .then((r) => {
        if (Array.isArray(r.data)) {
          // Add mock image URLs if not present in API data
          const productsWithImages = r.data.map((p, index) => ({
            ...p,
            imageUrl: p.imageUrl || `https://placehold.co/400x300/f87171/ffffff?text=Premium+Cut+${index + 1}`
          }));
          setProducts(productsWithImages);
        } else {
          setProducts([]);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch products:', err);
        // Set mock products on failure for UI demo
        setProducts([
          { id: 1, name: 'Ribeye Steak', description: 'Premium cut, well-marbled.', price: 29.99, imageUrl: 'https://placehold.co/400x300/f87171/ffffff?text=Ribeye' },
          { id: 2, name: 'Ground Beef', description: '80/20 lean ground beef.', price: 8.99, imageUrl: 'https://placehold.co/400x300/f87171/ffffff?text=Ground+Beef' },
          { id: 3, name: 'Pork Chops', description: 'Thick-cut bone-in chops.', price: 12.99, imageUrl: 'https://placehold.co/400x300/f87171/ffffff?text=Pork+Chops' },
          { id: 4, name: 'Whole Chicken', description: 'Free-range organic chicken.', price: 15.99, imageUrl: 'https://placehold.co/400x300/f87171/ffffff?text=Chicken' },
        ]);
      });
  }, []); // Empty dependency array, fetch only on mount

  return (
    <div className="w-full overflow-x-hidden">
      {/* --- Hero Section --- */}
      <div
        className="relative w-full min-h-[85vh] md:min-h-screen flex items-center justify-center text-white text-center py-20 px-4"
        style={{
          backgroundImage: `url(${heroBgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* New Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10"></div>
        
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative z-20 grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto"
        >
          {/* Hero Text Content */}
          <div className="text-center md:text-left">
            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight"
              style={{ textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
            >
              Classic Meat & Products
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="mt-6 text-xl md:text-2xl font-light text-gray-200"
            >
              Exceptional quality meat, responsibly sourced for your table.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <motion.div
                animate={pulseAnimation} // Add pulsing animation
                whileHover={{ scale: 1.1, transition: { duration: 0.2 }, animation: 'none' }} // Stop pulse, grow
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                <Link
                  to="/shop"
                  className="inline-block mt-10 px-10 py-4 bg-red-600 text-white text-lg font-semibold rounded-full shadow-2xl hover:bg-red-700 transition-all duration-300 transform"
                >
                  Shop Our Premium Selection
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* 3D Model Card */}
          <motion.div variants={zoomIn} className="w-full max-w-lg mx-auto">
            <div className="relative p-4 rounded-3xl bg-black/20 backdrop-blur-xl shadow-2xl border-2 border-white/20">
              <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-red-800/30 to-red-600/10">
                <div className="absolute inset-0">
                  <Meat3D />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* --- Features Section --- */}
      <div className="page-section bg-gradient-to-b from-gray-50 via-white to-gray-50 py-24">
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            variants={fadeInDown}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-4xl md:text-5xl font-bold text-center text-neutral-900 mb-16"
          >
            Why Choose Us?
          </motion.h2>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <FeatureCard
              icon={<Leaf className="w-10 h-10" />}
              title="Farm Fresh Quality"
            >
              We source directly from local farms committed to ethical and
              sustainable practices.
            </FeatureCard>
            <FeatureCard
              icon={<ShieldCheck className="w-10 h-10" />}
              title="Certified & Hygienic"
            >
              Fully certified with FSSAI & GST. We maintain the highest
              standards of cleanliness.
            </FeatureCard>
            <FeatureCard
              icon={<Truck className="w-10 h-10" />}
              title="Fast, Reliable Delivery"
            >
              Get your premium cuts delivered fresh to your doorstep. (Cash on
              Delivery available).
            </FeatureCard>
          </motion.div>
        </div>
      </div>

      {/* --- Featured Products Section (Dark Theme) --- */}
      <div className="page-section bg-neutral-900 py-24">
        <div className="container mx-auto max-w-7xl">
          <motion.h2
            variants={fadeInDown}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-4xl md:text-5xl font-bold text-white tracking-tight text-center mb-16"
          >
            Our Featured Products
          </motion.h2>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {Array.isArray(products) &&
              products.slice(0, 4).map((product) => (
                <motion.div
                  variants={fadeInUp}
                  key={product.id || product._id}
                  whileHover={{ y: -10, scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="group" // Added for hover effect on image
                >
                  <ProductCard product={product} addToCart={addToCart} />
                </motion.div>
              ))}
          </motion.div>
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mt-20"
          >
            <motion.div
              animate={pulseAnimation}
              whileHover={{ scale: 1.1, transition: { duration: 0.2 }, animation: 'none' }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link
                to="/shop"
                className="inline-block px-12 py-4 bg-red-600 text-white text-lg font-semibold rounded-full shadow-2xl hover:bg-red-700 transition-all duration-300"
              >
                View All Products
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* --- New Testimonial Section --- */}
      <div className="page-section bg-red-700 text-white py-24">
        <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.div variants={fadeInUp} className="flex justify-center mb-6">
                <Star className="w-10 h-10" fill="white" />
                <Star className="w-10 h-10 mx-2" fill="white" />
                <Star className="w-10 h-10" fill="white" />
              </motion.div>
              <motion.p 
                variants={fadeInUp}
                className="text-2xl md:text-4xl font-light italic leading-snug"
              >
                "The quality is unmatched. I've never had fresher, more flavorful
                meat delivered to my door. This is a game-changer!"
              </motion.p>
              <motion.h4 
                variants={fadeInUp}
                className="text-xl font-bold uppercase tracking-wider mt-8"
              >
                - Alex M.
              </motion.h4>
            </motion.div>
        </div>
      </div>
    </div>
  );
}

