// src/components/ProductCard.jsx

import React from "react";
import placeholderImage from '../assets/images/beef_images/img1.jpg';
import { ShoppingCart } from 'lucide-react';

export default function ProductCard({ product, addToCart }) {
  if (!product) return null;

  const hasStock = product.stock > 0;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:shadow-2xl">
      <div>
        <div className="relative overflow-hidden h-56">
          <img
            src={product.image || placeholderImage}
            alt={product.name || "Product image"}
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
            onError={(e) => { e.target.src = placeholderImage }}
          />
          {!hasStock && (
            <div className="absolute top-3 right-3 bg-red-700 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
              Out of Stock
            </div>
          )}
        </div>

        <div className="p-5">
          <h2 className="text-xl font-bold text-gray-800 truncate" title={product.name}>
            {product.name || "Unnamed Product"}
          </h2>
          <p className="text-2xl font-extrabold text-red-600 mt-2">
            {product.price ? `₹${product.price.toFixed(2)}` : "Price not available"}
          </p>
          {hasStock && (
            <p className="text-sm text-green-700 font-medium mt-1">
              {product.stock} units in stock
            </p>
          )}
        </div>
      </div>

      <div className="p-5 pt-0">
        <button
          onClick={() => addToCart(product)}
          disabled={!hasStock}
          className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-semibold text-white transition-colors duration-300
            ${hasStock
              ? 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50'
              : 'bg-gray-400 cursor-not-allowed'
            }
          `}
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          {hasStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
}
