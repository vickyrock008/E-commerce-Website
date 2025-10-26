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
    stock: '0',
    category_id: ''
  });
  // ✨ 1. State for the image URL (for display) and the new file (for upload)
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const apiBaseUrl = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    api.get(`/api/categories/`)
      .then(res => setCategories(res.data))
      .catch(() => toast.error("Could not load categories."));

    if (isEditing) {
      setLoading(true);
      api.get(`/api/products/${id}`)
        .then(res => {
          const { image, ...productData } = res.data;
          setProduct(productData);
          // ✨ Set the image URL for display
          if (image) {
            setImageUrl(image);
          }
        })
        .catch(() => toast.error("Could not find product to edit."))
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  // ✨ 2. Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create a local preview URL
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // ✨ 3. Use FormData to send file and text data
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('price', parseFloat(product.price));
    formData.append('stock', parseInt(product.stock, 10));
    formData.append('description', product.description || '');
    formData.append('category_id', parseInt(product.category_id));
    
    // ✨ 4. Only append the image file if a new one was selected
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const request = isEditing
      ? api.put(`/api/products/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      : api.post(`/api/products/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

    toast.promise(request, {
      loading: isEditing ? 'Updating product...' : 'Creating product...',
      success: () => {
        navigate('/admin/products');
        return `Product ${isEditing ? 'updated' : 'created'} successfully!`;
      },
      error: (err) => {
        setLoading(false);
        return err.response?.data?.detail || `Failed to ${isEditing ? 'update' : 'create'} product.`;
      }
    });
  };

  if (loading && isEditing) return <div>Loading product data...</div>;

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
      {/* ✨ 5. Add encType to the form */}
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Name</label>
          <input type="text" name="name" value={product.name} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input type="number" name="price" value={product.price} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" required step="0.01" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
          <input type="number" name="stock" value={product.stock} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" value={product.description} onChange={handleChange} rows="4" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"></textarea>
        </div>
        
        {/* ✨ 6. New File Input Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Image</label>
          <input 
            type="file" 
            name="image" 
            onChange={handleFileChange} 
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
            accept="image/png, image/jpeg, image/jpg"
          />
          {/* Image preview */}
          {imageUrl && (
            <div className="mt-4">
              <img 
                src={imageFile ? imageUrl : `${apiBaseUrl}${imageUrl}`} 
                alt="Product Preview" 
                className="w-48 h-48 object-cover rounded-md shadow-md"
                onError={(e) => { e.target.style.display = 'none' }}
              />
            </div>
          )}
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
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
          {loading ? 'Saving...' : (isEditing ? 'Update Product' : 'Save Product')}
        </button>
      </form>
    </div>
  );
}
