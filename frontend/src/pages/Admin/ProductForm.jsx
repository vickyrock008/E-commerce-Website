// src/pages/Admin/ProductForm.jsx

import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function ProductForm() {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    stock: '0', // ✨ Add stock to the initial state
    category_id: ''
  });
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  useEffect(() => {
    api.get(`/api/categories/`)
      .then(res => setCategories(res.data))
      .catch(() => toast.error("Could not load categories."));

    if (isEditing) {
      api.get(`/api/products/${id}`)
        .then(res => setProduct(res.data))
        .catch(() => toast.error("Could not find product to edit."));
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // ✨ Make sure to parse the stock value as an integer
    const productData = {
        ...product,
        price: parseFloat(product.price),
        stock: parseInt(product.stock, 10),
        category_id: parseInt(product.category_id)
    };

    const request = isEditing
      ? api.put(`/api/products/${id}`, productData)
      // ✨ When creating, send the stock data now
      : api.post(`/api/products/`, productData);

    toast.promise(request, {
      loading: isEditing ? 'Updating product...' : 'Creating product...',
      success: () => {
        navigate('/admin/products');
        return `Product ${isEditing ? 'updated' : 'created'} successfully!`;
      },
      error: `Failed to ${isEditing ? 'update' : 'create'} product.`
    });
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Name</label>
          <input type="text" name="name" value={product.name} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input type="number" name="price" value={product.price} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" required />
        </div>
        {/* ✨ Add the new Stock input field to the form */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
          <input type="number" name="stock" value={product.stock} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" value={product.description} onChange={handleChange} rows="4" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Image URL</label>
          <input type="text" name="image" value={product.image} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select name="category_id" value={product.category_id} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" required>
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
          {isEditing ? 'Update Product' : 'Save Product'}
        </button>
      </form>
    </div>
  );
}