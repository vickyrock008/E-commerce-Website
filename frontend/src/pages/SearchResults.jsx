// src/pages/SearchResults.jsx

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axiosConfig'; // Use the configured api instance
import ProductCard from '../components/ProductCard';
import { toast } from 'react-hot-toast';
import { Loader2, SearchX } from 'lucide-react';
import { motion } from 'framer-motion';

import searchBgImage from '../assets/images/bg_img/cert.png';
export default function SearchResults({ addToCart }) {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      setLoading(true);
      api.get(`/api/products/search?query=${query}`)
        .then(response => {
          setResults(response.data);
        })
        .catch(error => {
          console.error("Error fetching search results:", error);
          toast.error("Could not perform search.");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
      setResults([]);
    }
  }, [query]);

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
        backgroundImage: `url(${searchBgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800">
          Search Results for: <span className="text-red-600">"{query}"</span>
        </h1>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-10 min-h-[40vh]">
          {loading ? (
            <div className="flex justify-center items-center h-full p-12">
              <Loader2 className="w-12 h-12 animate-spin text-red-600" />
            </div>
          ) : results.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {results.map(product => (
                <motion.div variants={itemVariants} key={product.id}>
                  <ProductCard product={product} addToCart={addToCart} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center p-12 flex flex-col items-center">
              <SearchX className="w-20 h-20 text-gray-400 mb-6" />
              <h2 className="text-2xl font-semibold text-gray-700">No Products Found</h2>
              <p className="text-gray-500 mt-2">We couldn't find any products matching your search for "{query}".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
