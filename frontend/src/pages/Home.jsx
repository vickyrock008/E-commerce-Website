// src/pages/Home.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
// --- Restored original component imports ---
import ProductCard from '../components/ProductCard.jsx';
import Meat3D from '../components/Meat3D.jsx';
// ---
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Truck, ShieldCheck, Leaf, Star, ShoppingCart } from 'lucide-react';

// --- Asset Fix ---
// Original import path
import heroBgImage from '../assets/images/bg_img/bg2.png';

// --- MOCK Meat3D Component (REMOVED) ---
// --- MOCK ProductCard Component (REMOVED) ---


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

// --- NEW: Delayed variant for the button ---
const fadeInUpDelayed = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
      delay: 2.0 // Start after the subtitle animation
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
      duration: 2,
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
      duration: 2,
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

// --- NEW Text Animation Variants ---
const sentenceVariant = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delay: 1,
      staggerChildren: 1, // Time between each word animating in
    },
  },
};

// --- NEW: Delayed variant for the subtitle animation ---
const sentenceVariantDelayed = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delay: 1, // Start after h1 finishes
      staggerChildren: 1, // Animate words faster
    },
  },
};

const wordVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12,
    },
  },
};
// --- End of NEW Variants ---


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

  // --- NEW: Title for animation ---
  const titleWords = "Classic Meat & Products".split(" ");
  // --- NEW: Subtitle for animation ---
  const subtitleWords = "Exceptional quality meat, responsibly sourced for your table.".split(" ");

  return (
    <div className="w-full overflow-x-hidden">
      {/* --- Hero Section --- */}
      <div
        className="relative w-full min-h-[85vh] md:min-h-screen flex items-center justify-center text-black text-center py-20 px-4"
        style={{
          backgroundImage: `url(${heroBgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* --- CHANGE: Lighter Gradient Overlay --- */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10"></div>
        
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative z-20 grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto"
        >
          {/* Hero Text Content */}
          <div className="text-center md:text-left">
            {/* --- CHANGE: New Staggered Word Animation --- */}
            <motion.h1
              variants={sentenceVariant} // Use new sentence variant
              initial="hidden"
              animate="visible"
              className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight"
              style={{ textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
            >
              {titleWords.map((word, index) => (
                <motion.span
                  key={word + '-' + index}
                  variants={wordVariant} // Use new word variant
                  className="inline-block mr-4" // Add spacing
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>
            {/* --- End of Change --- */}

            {/* --- CHANGE: New Staggered Word Animation for Subtitle --- */}
            <motion.p
              variants={sentenceVariantDelayed}
              initial="hidden"
              animate="visible"
              className="mt-6 text-xl md:text-2xl font-light text-black"
            >
              {subtitleWords.map((word, index) => (
                <motion.span
                  key={word + '-' + index}
                  variants={wordVariant} // Use new word variant
                  className="inline-block mr-1.5" // Smaller margin for subtitle
                >
                  {word}
                </motion.span>
              ))}
            </motion.p>
            {/* --- End of Change --- */}

            {/* --- CHANGE: Added delayed variant and animation controls --- */}
            <motion.div
              variants={fadeInUpDelayed}
              initial="hidden"
              animate="visible"
            >
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
                - Vignesh.
              </motion.h4>
            </motion.div>
        </div>
      </div>
    </div>
  );
}

