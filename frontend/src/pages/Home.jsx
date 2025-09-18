import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Meat3D from '../components/Meat3D';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Home({ addToCart }) {
  const [products, setProducts] = useState([]);

  // We have removed the isLoading state from here.
  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URL + '/api/products/')
      .then((r) => {
        if (Array.isArray(r.data)) {
          setProducts(r.data);
        } else {
          setProducts([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setProducts([]);
      });
  }, []);
  
  // We have removed the `if (isLoading)` check from here.
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
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-gray-900 py-20 md:py-32 overflow-hidden rounded-2xl">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-white text-center md:text-left"
            >
              <motion.h1 
                variants={itemVariants} 
                className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight"
              >
                Classic Meat & Products
              </motion.h1>
              <motion.p 
                variants={itemVariants} 
                className="mt-4 text-xl md:text-2xl font-light"
              >
                Exceptional quality meat, responsibly sourced.
              </motion.p>
              <motion.div variants={itemVariants}>
                <Link
                  to="/shop"
                  className="inline-block mt-8 px-8 py-3 bg-red-600 text-white font-semibold rounded-full shadow-lg hover:bg-red-700 transition-colors duration-300 transform hover:scale-105"
                >
                  Shop Our Premium Selection
                </Link>
              </motion.div>
            </motion.div>
            <div className="flex justify-center md:justify-end">
              <div className="w-full md:w-3/4 p-4 rounded-[2rem] bg-gradient-to-br from-gray-700 to-gray-800 shadow-2xl transition-transform duration-500 ease-out hover:scale-[1.03]">
                <div className="relative w-full aspect-square overflow-hidden rounded-[1.7rem] bg-gradient-to-br from-red-700 to-red-600 border border-gray-600 shadow-inner">
                  <div className="absolute inset-0">
                    <Meat3D />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="container mx-auto px-6">
        <h2 className="mt-12 text-3xl font-bold text-gray-800 tracking-tight">Featured Products</h2>
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {Array.isArray(products) && products.slice(0, 4).map((product) => (
            <ProductCard key={product.id || product._id} product={product} addToCart={addToCart} />
          ))}
        </div>
      </div>
    </div>
  );
}