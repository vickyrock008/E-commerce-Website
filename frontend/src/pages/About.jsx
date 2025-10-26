// src/pages/About.jsx

import React from 'react';
// Assuming '@/' is an alias for 'src/'
import meatImage from '@/assets/images/beef_images/logo.png'; // Corrected path
import { motion } from 'framer-motion';
import { Award, Heart, Users } from 'lucide-react'; // Ensured Heart is imported

// Import the background image similar to Contact.jsx
import aboutBgImage from '@/assets/images/bg_img/about.png'; // Corrected path

export default function About() {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    },
  };

  return (
    <div
      className="w-full min-h-screen page-section" // Added page-section for consistent padding
      style={{
        backgroundImage: `url(${aboutBgImage})`, // Corrected: Use the imported variable
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Page Header */}
      <div className="relative z-10 pt-24 pb-16 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-extrabold text-white tracking-tight"
        >
          Our Story, Our Craft, Our Commitment
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 text-xl text-gray-200 max-w-2xl mx-auto"
        >
          Classic Meat & Products is more than just a shop; it's a legacy of quality, passion, and trust.
        </motion.p>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 pb-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col md:flex-row items-center gap-8 md:gap-12 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 md:p-12 mb-12"
          >
            <motion.div variants={itemVariants} className="md:w-1/2">
              <h2 className="text-3xl font-bold text-red-700">A Tradition of Excellence</h2>
              <p className="mt-4 text-gray-700 leading-relaxed text-lg">
                Founded on the simple principle that good food starts with good meat, we have dedicated ourselves to sourcing the finest, responsibly raised products. Our journey began with a small local farm and has grown into a commitment to bringing exceptional quality to your table. We believe in transparency and the time-honored traditions of butchery.
              </p>
            </motion.div>
            <motion.div variants={itemVariants} className="md:w-1/2">
              <img
                src={meatImage}
                alt="Classic Meat & Products Logo"
                className="rounded-lg w-full h-auto"
                // Add error handling for the image
                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x400/cccccc/ffffff?text=Image+Not+Found"; }}
              />
            </motion.div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid md:grid-cols-3 gap-8 text-center"
          >
            <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-md p-8 rounded-xl shadow-xl transform transition duration-300 hover:shadow-2xl hover:-translate-y-2">
              <Award className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-800">Quality You Can Taste</h3>
              <p className="mt-2 text-gray-600">
                From our farms to your fork, every cut is inspected to meet our strict standards for flavor, tenderness, and freshness.
              </p>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-md p-8 rounded-xl shadow-xl transform transition duration-300 hover:shadow-2xl hover:-translate-y-2">
              {/* Corrected: Use Heart icon since Leaf wasn't imported */}
              <Heart className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-800">Sustainably Sourced</h3>
              <p className="mt-2 text-gray-600">
                We partner with local farmers who share our commitment to ethical and sustainable farming practices.
              </p>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-md p-8 rounded-xl shadow-xl transform transition duration-300 hover:shadow-2xl hover:-translate-y-2">
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-800">Expertise & Passion</h3>
              <p className="mt-2 text-gray-600">
                Our team of expert butchers is passionate about their craft, providing personalized service and advice.
              </p>
            </motion.div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className="text-center mt-16 bg-gradient-to-r from-red-700 to-red-600 text-white py-12 px-6 rounded-2xl shadow-2xl"
          >
            <h2 className="text-3xl font-bold">Ready to Experience the Difference?</h2>
            <p className="mt-2 text-lg text-gray-100">
              Explore our selection of premium cuts and products.
            </p>
            <a href="/shop" className="mt-6 inline-block bg-white text-red-700 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
              Shop Now
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}



