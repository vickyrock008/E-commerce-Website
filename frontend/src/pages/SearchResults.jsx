// src/pages/SearchResults.jsx

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { toast } from 'react-hot-toast';

export default function SearchResults({ addToCart }) {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      setLoading(true);
      axios.get(`${import.meta.env.VITE_API_URL}/api/products/search?query=${query}`)
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

  if (loading) {
    return <div className="text-center p-12">Searching for products...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Search Results for: <span className="text-red-600">"{query}"</span>
      </h1>
      {results.length > 0 ? (
        <div className="grid md:grid-cols-4 gap-6">
          {results.map(product => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No products found matching your search.</p>
      )}
    </div>
  );
}