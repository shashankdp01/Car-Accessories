import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import api from './api';

function Profile({ user, onLogout, onUserRefresh }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', email: user?.email || '' });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const cartCount = user?.cart?.reduce((sum, item) => sum + item.qty, 0) || 0;
  const ordersCount = user?.orders?.length || 0;
  const lastOrderStatus = user?.orders?.[0]?.status || 'No orders yet';
  const initials = (user?.name || 'U')
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  const onChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const resetForm = () => {
    setForm({ name: user?.name || '', phone: user?.phone || '', email: user?.email || '' });
    setError('');
    setSuccess('');
    setIsEditing(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name.trim()) {
      setError('Name is required.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.patch(`/users/${user.id}`, {
        name: form.name.trim(),
        phone: form.phone.trim(),
      });
      onUserRefresh(data.user);
      setForm((prev) => ({ ...prev, name: data.user.name, phone: data.user.phone || '' }));
      setSuccess(data.message || 'Profile updated successfully.');
      setIsEditing(false);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to update your profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="products-page">
      <Navbar
        user={user}
        cartCount={cartCount}
        onCartClick={() => navigate('/cart')}
        onLogout={() => {
          onLogout();
          navigate('/');
        }}
        onProfileClick={() => navigate('/profile')}
      />

      <div className="order-success-page">
        <div className="profile-page-grid">
          <div className="profile-panel profile-header-card">
            <div className="profile-header-main">
              <div className="profile-avatar-lg">{initials}</div>
              <div>
                <h1 className="section-title">My Profile</h1>
                <p className="cart-subtitle">Manage your account details, contact info, and shopping activity.</p>
              </div>
            </div>
            <button
              type="button"
              className="btn-outline-blue profile-edit-btn"
              onClick={() => setIsEditing(true)}
              disabled={isEditing}
              title="Edit profile details"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M4 20h4l10-10-4-4L4 16v4zM14 6l4 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Edit Profile
            </button>
          </div>

          <div className="profile-panel profile-stats-card">
            <div className="profile-stat">
              <span className="profile-stat-label">Orders</span>
              <span className="profile-stat-value">{ordersCount}</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat-label">Cart Items</span>
              <span className="profile-stat-value">{cartCount}</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat-label">Latest Order</span>
              <span className="profile-stat-value profile-stat-status">{lastOrderStatus}</span>
            </div>
          </div>

          <div className="profile-panel profile-form-card">
            <div className="profile-section-head">
              <h2>Personal Information</h2>
              <p>Keep your contact details updated for smoother order and delivery experience.</p>
            </div>

            {error ? <div className="form-error">{error}</div> : null}
            {success ? <div className="form-success">{success}</div> : null}

            <form onSubmit={handleSubmit} style={{ marginTop: 18 }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" value={form.name} onChange={onChange('name')} disabled={!isEditing} />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" value={form.email} disabled />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  className="form-input"
                  value={form.phone}
                  onChange={onChange('phone')}
                  placeholder="+91 98765 43210"
                  disabled={!isEditing}
                />
              </div>

              {isEditing ? (
                <div className="profile-actions-row">
                  <button type="button" className="btn-ghost" onClick={resetForm} disabled={loading}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-login" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              ) : (
                <div className="profile-actions-row">
                  <button type="button" className="btn-outline-blue" onClick={() => navigate('/orders')}>
                    Track Orders
                  </button>
                  <button type="button" className="btn-blue" onClick={() => navigate('/cart')}>
                    Go to Cart
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
