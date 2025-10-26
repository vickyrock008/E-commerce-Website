// src/pages/ProductDetail.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axiosConfig'; // Use the configured api instance
import Meat3D from '../components/Meat3D';
import { toast } from 'react-hot-toast';
import { ShoppingCart, CheckCircle, XCircle,Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

// Using one of the provided images
import detailBgImage from '../assets/images/beef_images/white.png';

export default function ProductDetail({ addToCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/api/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Could not load product details.");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-red-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center p-12">
        <h1 className="text-2xl font-bold text-red-600">Product Not Found</h1>
        <p className="mt-2 text-gray-600">We couldn't find the product you're looking for.</p>
      </div>
    );
  }

  const hasStock = product.stock > 0;

  return (
    <div
      className="w-full min-h-screen page-section flex items-center"
      style={{
        backgroundImage: `url(${detailBgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-black/20"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="container mx-auto max-w-6xl relative z-10"
      >
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-10 overflow-hidden">
          <div className='grid md:grid-cols-2 gap-8 md:gap-12 items-center'>
            
            {/* 3D Model Column */}
            <div className="w-full h-80 md:h-[32rem] bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl overflow-hidden shadow-inner">
              <Meat3D />
            </div>

            {/* Product Info Column */}
            <div>
              <h1 className='text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900'>{product.name}</h1>
              <p className='mt-4 text-gray-700 leading-relaxed text-lg'>{product.description}</p>
              <div className='mt-6 text-5xl font-extrabold text-red-700'>
                ₹{product.price.toFixed(2)}
              </div>

              <div className="mt-8">
                {hasStock ? (
                  <>
                    <div className="flex items-center space-x-2 mb-4">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <p className="text-lg text-green-700 font-semibold">{product.stock} units in stock</p>
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className='w-full flex items-center justify-center px-8 py-4 bg-red-600 text-white text-lg font-bold rounded-lg shadow-lg hover:bg-red-700 transition-all transform hover:scale-105'
                    >
                      <ShoppingCart className="w-6 h-6 mr-3" />
                      Add to Cart
                    </button>
                  </>
                ) : (
                  <div className="flex items-center space-x-2 p-4 rounded-lg bg-red-100 text-red-700">
                    <XCircle className="w-6 h-6" />
                    <p className="text-lg font-semibold">
                      Currently Out of Stock
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
