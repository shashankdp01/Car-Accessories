import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import api from './api';
import './Admin.css';

function Admin({ user, onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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
              You do not have permission to access the admin panel.
            </p>
            <button className="btn-blue" onClick={() => navigate('/products')}>
              Go to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'products':
        return <ProductsManager setMessage={setMessage} setError={setError} />;
      case 'orders':
        return <OrdersManager setMessage={setMessage} setError={setError} />;
      case 'users':
        return <UsersManager setMessage={setMessage} setError={setError} />;
      default:
        return null;
    }
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
        <div className="admin-header" style={{ display: 'block', textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ marginBottom: '20px' }}>Admin Dashboard</h1>
          <div className="admin-tabs" style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <button 
              className={activeTab === 'products' ? 'btn-blue' : 'btn-outline-blue'} 
              onClick={() => { setActiveTab('products'); setMessage(''); setError(''); }}
            >
              Products
            </button>
            <button 
              className={activeTab === 'orders' ? 'btn-blue' : 'btn-outline-blue'} 
              onClick={() => { setActiveTab('orders'); setMessage(''); setError(''); }}
            >
              Orders
            </button>
            <button 
              className={activeTab === 'users' ? 'btn-blue' : 'btn-outline-blue'} 
              onClick={() => { setActiveTab('users'); setMessage(''); setError(''); }}
            >
              Users
            </button>
          </div>
        </div>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        {renderTabContent()}
      </div>
    </div>
  );
}

function ProductsManager({ setMessage, setError }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    id: '', name: '', cat: '', price: '', icon: '', image: '', brand: '', rating: '', badge: ''
  });

  const CATEGORIES = [
    'Exterior', 'Interior', 'Lighting', 'Audio & Electronics', 'Wheels & Tyres', 'Performance', 'Car Care', 'Safety & Security'
  ];

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
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setMessage(''); setError('');

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
        image: formData.image.trim(),
        brand: formData.brand.trim(),
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
      handleCancelEdit();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product.');
    }
  };

  const handleEditProduct = (product) => {
    setFormData({
      id: String(product.id), name: product.name, cat: product.cat, price: String(product.price),
      icon: product.icon || '', image: product.image || '', brand: product.brand || '',
      rating: String(product.rating), badge: product.badge || '',
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
    setFormData({ id: '', name: '', cat: '', price: '', icon: '', image: '', brand: '', rating: '', badge: '' });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>All Products ({products.length})</h2>
        <button className="btn-primary" onClick={() => { setShowForm(!showForm); if(showForm) handleCancelEdit(); }}>
          {showForm ? 'Cancel' : 'Add New Product'}
        </button>
      </div>

      {showForm && (
        <div className="product-form">
          <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleAddProduct}>
            <div className="form-group">
              <label>Product ID</label>
              <input type="number" name="id" value={formData.id} onChange={handleInputChange} disabled={editingId} required />
            </div>
            <div className="form-group">
              <label>Product Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Brand</label>
              <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} placeholder="e.g., AutoGear" />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select name="cat" value={formData.cat} onChange={handleInputChange} required>
                <option value="">Select Category</option>
                {CATEGORIES.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
              </select>
            </div>
            <div className="form-group">
              <label>Price (Rs.)</label>
              <input type="number" name="price" value={formData.price} onChange={handleInputChange} min="0" required />
            </div>
            <div className="form-group">
              <label>Image URL</label>
              <input type="text" name="image" value={formData.image} onChange={handleInputChange} placeholder="https://..." />
            </div>
            <div className="form-group">
              <label>Icon/Code (Fallback)</label>
              <input type="text" name="icon" value={formData.icon} onChange={handleInputChange} placeholder="e.g., Car, Guard" />
            </div>
            <div className="form-group">
              <label>Rating</label>
              <input type="number" name="rating" value={formData.rating} onChange={handleInputChange} min="0" max="5" step="0.1" />
            </div>
            <div className="form-group">
              <label>Badge</label>
              <input type="text" name="badge" value={formData.badge} onChange={handleInputChange} placeholder="e.g., New, Hot, Sale" />
            </div>
            <button type="submit" className="btn-submit">{editingId ? 'Update Product' : 'Add Product'}</button>
          </form>
        </div>
      )}

      <div className="products-table-container">
        {loading ? <p>Loading products...</p> : (
          <table className="products-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Image/Icon</th>
                <th>Brand</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>
                    {product.image ? (
                      <img src={product.image} alt={product.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                    ) : (
                      <span>{product.icon}</span>
                    )}
                  </td>
                  <td>{product.brand || '-'}</td>
                  <td>{product.name}</td>
                  <td>{product.cat}</td>
                  <td>Rs. {product.price.toLocaleString('en-IN')}</td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEditProduct(product)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function OrdersManager({ setMessage, setError }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/orders');
      setOrders(data.orders);
    } catch (err) {
      setError('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, orderId, newStatus) => {
    try {
      await api.patch(`/admin/orders/${userId}/${encodeURIComponent(orderId)}`, { status: newStatus });
      setMessage('Order status updated.');
      fetchOrders();
    } catch (err) {
      setError('Failed to update order status.');
    }
  };

  return (
    <div>
      <h2>All Orders ({orders.length})</h2>
      <div className="products-table-container">
        {loading ? <p>Loading orders...</p> : (
          <table className="products-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={`${order.userId}-${order.id}`}>
                  <td>{order.id}</td>
                  <td>{order.userName} <br/><small>{order.userEmail}</small></td>
                  <td>{new Date(order.placedAt).toLocaleString('en-IN')}</td>
                  <td>{order.total}</td>
                  <td>
                    <select 
                      value={order.status} 
                      onChange={(e) => handleStatusChange(order.userId, order.id, e.target.value)}
                      style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                      <option value="Processing">Processing</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function UsersManager({ setMessage, setError }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/users');
      setUsers(data.users);
    } catch (err) {
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/admin/users/${id}`);
        setMessage('User deleted successfully.');
        fetchUsers();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete user.');
      }
    }
  };

  return (
    <div>
      <h2>All Users ({users.length})</h2>
      <div className="products-table-container">
        {loading ? <p>Loading users...</p> : (
          <table className="products-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u._id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role || 'user'}</td>
                  <td>
                    {u.role !== 'admin' && (
                      <button className="btn-delete" onClick={() => handleDeleteUser(u._id)}>Delete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Admin;
