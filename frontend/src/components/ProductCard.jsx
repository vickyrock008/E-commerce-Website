import React from "react"
import placeholderImage from '../assets/images/beef_images/img1.jpg';

export default function ProductCard({ product, addToCart }) {
  if (!product) return null

  return (
    <div className="border rounded-lg shadow p-4 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300">
      <div>
        <img
          src={product.image || placeholderImage}
          alt={product.name || "No name"}
          className="w-full h-48 object-cover mb-4 rounded-md"
        />
        <h2 className="text-lg font-bold">{product.name || "Unnamed Product"}</h2>
        <p className="text-gray-600 text-xl font-semibold">{product.price ? `₹${product.price}` : "Price not available"}</p>
      </div>
      <div className="mt-4">
        {product.stock > 0 ? (
          <>
            <p className="text-sm text-green-600 font-medium mb-2">{product.stock} units in stock</p>
            <button
              onClick={() => addToCart(product)}
              className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Add to Cart
            </button>
          </>
        ) : (
          <p className="text-center font-bold text-red-600 bg-red-100 py-2 rounded">
            Out of Stock
          </p>
        )}
      </div>
    </div>
  )
}