import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import axios from "axios";

export default function Shop({ addToCart }) {
  // 1. We'll store a list of categories now, not just products.
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // 2. We change the "phone number" to call the categories API endpoint.
    // This gives us the nicely grouped data.
    axios.get(import.meta.env.VITE_API_URL + '/api/categories/')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-8 text-center">Our Products</h2>
      
      {/* 3. We create a loop for the categories. */}
      {categories.map(category => (
        // We use a React Fragment (<>) because we need a key for the loop.
        <React.Fragment key={category.id}>
          {/* First, we display the category name as a big title. */}
          <h3 className="text-2xl font-bold text-gray-800 mb-4 mt-8 border-b-2 border-red-600 pb-2">
            {category.name}
          </h3>
          
          {/* 4. Then, we create a grid for the products INSIDE this category. */}
          <div className="grid md:grid-cols-3 gap-6">
            {category.products.map((product) => (
              <ProductCard key={product.id} product={product} addToCart={addToCart} />
            ))}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}