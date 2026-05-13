import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import api from './api';

function Checkout({ user, onLogout, onUserRefresh }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
  });
  const [paymentMethod, setPaymentMethod] = useState('Credit/Debit Card');

  const cartItems = user?.cart ?? [];
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  // If cart is empty, redirect back to cart
  if (cartCount === 0) {
    navigate('/cart');
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Combine address
    const fullAddress = `${formData.firstName} ${formData.lastName}, ${formData.address1}, ${
      formData.address2 ? formData.address2 + ', ' : ''
    }${formData.city}, ${formData.state} - ${formData.zip}, ${formData.country}`;

    try {
      const { data } = await api.post(`/users/${user.id}/checkout`, {
        address: fullAddress,
        paymentMethod,
      });
      onUserRefresh(data.user);
      navigate('/order-success', { state: { order: data.order } });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to place the order.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    boxSizing: 'border-box',
    marginBottom: '15px',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '6px',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
    marginBottom: '5px'
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

      <div className="cart-page">
        <div className="cart-header">
          <div>
            <h1 className="section-title">Checkout</h1>
            <p className="cart-subtitle">Complete your order by providing delivery details.</p>
          </div>
        </div>

        {message && <div className="form-error" style={{ marginBottom: '20px' }}>{message}</div>}

        <div className="cart-layout" style={{ alignItems: 'flex-start' }}>
          <div className="cart-items" style={{ padding: '30px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <form id="checkout-form" onSubmit={handlePlaceOrder}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', color: '#111827' }}>1. Delivery Address</h2>
              
              <div style={gridStyle}>
                <div>
                  <label style={labelStyle}>First Name</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required style={inputStyle} placeholder="John" />
                </div>
                <div>
                  <label style={labelStyle}>Last Name</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required style={inputStyle} placeholder="Doe" />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} placeholder="john@example.com" />
              </div>

              <div>
                <label style={labelStyle}>Street Address</label>
                <input type="text" name="address1" value={formData.address1} onChange={handleChange} required style={inputStyle} placeholder="123 Main St" />
              </div>

              <div>
                <label style={labelStyle}>Apartment, suite, etc. (optional)</label>
                <input type="text" name="address2" value={formData.address2} onChange={handleChange} style={inputStyle} placeholder="Apt 4B" />
              </div>

              <div style={{ ...gridStyle, gridTemplateColumns: '1fr 1fr 1fr' }}>
                <div>
                  <label style={labelStyle}>City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} required style={inputStyle} placeholder="Mumbai" />
                </div>
                <div>
                  <label style={labelStyle}>State / Province</label>
                  <input type="text" name="state" value={formData.state} onChange={handleChange} required style={inputStyle} placeholder="Maharashtra" />
                </div>
                <div>
                  <label style={labelStyle}>ZIP / Postal Code</label>
                  <input type="text" name="zip" value={formData.zip} onChange={handleChange} required style={inputStyle} placeholder="400001" />
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '30px 0' }} />

              <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', color: '#111827' }}>2. Payment Method</h2>
              
              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {['Credit/Debit Card', 'UPI', 'Cash on Delivery'].map((method) => (
                  <label 
                    key={method} 
                    style={{ 
                      flex: '1',
                      minWidth: '150px',
                      display: 'flex', 
                      alignItems: 'center', 
                      padding: '15px', 
                      border: paymentMethod === method ? '2px solid #6366f1' : '1px solid #d1d5db',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: paymentMethod === method ? '#eef2ff' : '#fff',
                      transition: 'all 0.2s'
                    }}
                  >
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value={method} 
                      checked={paymentMethod === method}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      style={{ marginRight: '10px' }}
                    />
                    <span style={{ fontWeight: paymentMethod === method ? '600' : '500', color: '#374151' }}>{method}</span>
                  </label>
                ))}
              </div>

              {paymentMethod === 'Credit/Debit Card' && (
                <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #e5e7eb' }}>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={labelStyle}>Card Number</label>
                    <input type="text" placeholder="0000 0000 0000 0000" style={inputStyle} maxLength="19" />
                  </div>
                  <div style={gridStyle}>
                    <div>
                      <label style={labelStyle}>Expiration Date</label>
                      <input type="text" placeholder="MM/YY" style={inputStyle} maxLength="5" />
                    </div>
                    <div>
                      <label style={labelStyle}>CVC</label>
                      <input type="password" placeholder="123" style={inputStyle} maxLength="4" />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'UPI' && (
                <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #e5e7eb' }}>
                  <label style={labelStyle}>UPI ID</label>
                  <input type="text" placeholder="username@upi" style={{...inputStyle, marginBottom: 0}} />
                </div>
              )}

            </form>
          </div>

          <div className="cart-summary">
            <div className="cart-summary-card" style={{ position: 'sticky', top: '100px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '15px', color: '#111827' }}>Order Summary</h3>
              
              <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '15px', paddingRight: '5px' }}>
                {cartItems.map(item => (
                  <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
                    <div style={{ color: '#4b5563', flex: 1 }}>
                      <span style={{ fontWeight: '500' }}>{item.qty}x</span> {item.name}
                    </div>
                    <div style={{ fontWeight: '500', color: '#111827', marginLeft: '10px' }}>
                      Rs. {(item.price * item.qty).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>

              <hr style={{ border: 'none', borderTop: '1px dashed #d1d5db', margin: '15px 0' }} />

              <div className="cart-summary-row">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="cart-summary-row">
                <span>Delivery</span>
                <span>Free</span>
              </div>
              <div className="cart-summary-total">
                <span>Total</span>
                <span>Rs. {subtotal.toLocaleString('en-IN')}</span>
              </div>
              <button 
                type="submit" 
                form="checkout-form" 
                className="btn-login" 
                disabled={loading}
                style={{ height: '50px', fontSize: '16px', fontWeight: '600' }}
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
