// src/pages/Shop.jsx

import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import axios from "axios";
import { motion } from 'framer-motion';

// Using a placeholder for the shop background
import shopBgImage from '../assets/images/beef_images/img4.png';

export default function Shop({ addToCart }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(import.meta.env.VITE_API_URL + '/api/categories/')
      .then(response => {
        setCategories(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching categories:", error);
        setLoading(false);
      });
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div
      className="w-full min-h-screen page-section"
      style={{
        backgroundImage: `url(${shopBgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-black/30"></div>
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Our Products
          </h1>
          <p className="mt-4 text-xl text-gray-200 max-w-2xl mx-auto">
            Browse our selection of premium, ethically-sourced meats, sorted by category.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-10"
        >
          {loading ? (
            <div className="text-center p-12 text-xl font-semibold">Loading products...</div>
          ) : (
            <div className="space-y-12">
              {categories.map(category => (
                <motion.section variants={itemVariants} key={category.id}>
                  {/* Category Title */}
                  <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-red-600 pb-3">
                    {category.name}
                  </h2>
                  
                  {/* Product Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {category.products.map((product) => (
                      <ProductCard key={product.id} product={product} addToCart={addToCart} />
                    ))}
                  </div>
                </motion.section>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
