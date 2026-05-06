import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import api from './api';
import './Admin.css';

function Admin({ user, onLogout }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="admin-page">
        <Navbar
          user={user}
          onLogout={() => {
            onLogout();
            navigate('/');
          }}
        />
        <div className="admin-container">
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h1 style={{ color: '#dc3545', marginBottom: '10px' }}>Access Denied</h1>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              You do not have permission to access the admin panel. Only shop administrators can access this page.
            </p>
            <button
              className="btn-blue"
              onClick={() => navigate('/products')}
              style={{ marginRight: '10px' }}
            >
              Go to Products
            </button>
            <button className="btn-outline-blue" onClick={() => navigate('/')}>
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    cat: '',
    price: '',
    icon: '',
    rating: '',
    badge: '',
  });

  const CATEGORIES = [
    'Exterior',
    'Interior',
    'Lighting',
    'Audio & Electronics',
    'Wheels & Tyres',
    'Performance',
    'Car Care',
    'Safety & Security',
  ];

  // Fetch all products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/products');
      setProducts(data.products);
    } catch (err) {
      setError('Failed to load products.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!formData.id || !formData.name || !formData.cat || !formData.price) {
      setError('ID, name, category, and price are required.');
      return;
    }

    try {
      const payload = {
        id: Number(formData.id),
        name: formData.name.trim(),
        cat: formData.cat,
        price: Number(formData.price),
        icon: formData.icon.trim(),
        rating: formData.rating ? Number(formData.rating) : 0,
        badge: formData.badge.trim() || null,
      };

      if (editingId) {
        await api.patch(`/products/${editingId}`, payload);
        setMessage('Product updated successfully.');
      } else {
        await api.post('/products', payload);
        setMessage('Product added successfully.');
      }

      fetchProducts();
      setFormData({ id: '', name: '', cat: '', price: '', icon: '', rating: '', badge: '' });
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product.');
    }
  };

  const handleEditProduct = (product) => {
    setFormData({
      id: String(product.id),
      name: product.name,
      cat: product.cat,
      price: String(product.price),
      icon: product.icon,
      rating: String(product.rating),
      badge: product.badge || '',
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        setMessage('Product deleted successfully.');
        fetchProducts();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete product.');
      }
    }
  };

  const handleCancelEdit = () => {
    setFormData({ id: '', name: '', cat: '', price: '', icon: '', rating: '', badge: '' });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="admin-page">
      <Navbar
        user={user}
        onLogout={() => {
          onLogout();
          navigate('/');
        }}
      />

      <div className="admin-container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <button
            className="btn-primary"
            onClick={() => {
              setShowForm(!showForm);
              handleCancelEdit();
            }}
          >
            {showForm ? 'Cancel' : 'Add New Product'}
          </button>
        </div>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        {showForm && (
          <div className="product-form">
            <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleAddProduct}>
              <div className="form-group">
                <label>Product ID</label>
                <input
                  type="number"
                  name="id"
                  value={formData.id}
                  onChange={handleInputChange}
                  disabled={editingId}
                  required
                />
              </div>

              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select name="cat" value={formData.cat} onChange={handleInputChange} required>
                  <option value="">Select Category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Price (Rs.)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Icon/Code</label>
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  placeholder="e.g., Car, Guard, Wheel"
                />
              </div>

              <div className="form-group">
                <label>Rating</label>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  min="0"
                  max="5"
                  step="0.1"
                />
              </div>

              <div className="form-group">
                <label>Badge</label>
                <input
                  type="text"
                  name="badge"
                  value={formData.badge}
                  onChange={handleInputChange}
                  placeholder="e.g., New, Hot, Sale"
                />
              </div>

              <button type="submit" className="btn-submit">
                {editingId ? 'Update Product' : 'Add Product'}
              </button>
            </form>
          </div>
        )}

        <div className="products-table-container">
          <h2>All Products ({products.length})</h2>
          {loading ? (
            <p>Loading products...</p>
          ) : products.length === 0 ? (
            <p>No products found. Add a new product to get started.</p>
          ) : (
            <table className="products-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price (Rs.)</th>
                  <th>Rating</th>
                  <th>Badge</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.cat}</td>
                    <td>{product.price.toLocaleString('en-IN')}</td>
                    <td>{product.rating}</td>
                    <td>{product.badge || '-'}</td>
                    <td>
                      <button
                        className="btn-edit"
                        onClick={() => handleEditProduct(product)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;
