import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import api from './api';

function Cart({ user, onLogout, onUserRefresh }) {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [loadingItemId, setLoadingItemId] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const cartItems = user?.cart ?? [];
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  const updateQuantity = async (productId, quantity) => {
    setLoadingItemId(productId);
    setMessage('');

    try {
      const { data } = await api.patch(`/users/${user.id}/cart/${productId}`, { quantity });
      onUserRefresh(data.user);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to update cart item.');
    } finally {
      setLoadingItemId(null);
    }
  };

  const removeItem = async (productId) => {
    setLoadingItemId(productId);
    setMessage('');

    try {
      const { data } = await api.delete(`/users/${user.id}/cart/${productId}`);
      onUserRefresh(data.user);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to remove cart item.');
    } finally {
      setLoadingItemId(null);
    }
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    setMessage('');

    try {
      const { data } = await api.post(`/users/${user.id}/checkout`);
      onUserRefresh(data.user);
      navigate('/order-success', { state: { order: data.order } });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to place the order.');
    } finally {
      setCheckoutLoading(false);
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

      <div className="cart-page">
        <div className="cart-header">
          <div>
            <h1 className="section-title">Your Cart</h1>
            <p className="cart-subtitle">Review your selected accessories before placing the order.</p>
          </div>
          <button className="btn-outline-blue" onClick={() => navigate('/products')}>
            Continue Shopping
          </button>
        </div>

        {message ? <div className="form-error">{message}</div> : null}

        {cartItems.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-title">Your cart is empty</div>
            <p className="empty-state-copy">Add a few products and they will appear here for this account only.</p>
            <button className="btn-blue" onClick={() => navigate('/products')}>
              Browse Products
            </button>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {cartItems.map((item) => (
                <div className="cart-item-card" key={item.productId}>
                  <div className="cart-item-icon">{item.icon}</div>
                  <div className="cart-item-main">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-meta">{item.cat}</div>
                    <div className="cart-item-meta">Rs. {item.price.toLocaleString('en-IN')} each</div>
                  </div>
                  <div className="cart-item-actions">
                    <div className="qty-control">
                      <button
                        onClick={() => updateQuantity(item.productId, item.qty - 1)}
                        disabled={item.qty === 1 || loadingItemId === item.productId}
                      >
                        -
                      </button>
                      <span>{item.qty}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.qty + 1)}
                        disabled={loadingItemId === item.productId}
                      >
                        +
                      </button>
                    </div>
                    <div className="cart-item-price">Rs. {(item.price * item.qty).toLocaleString('en-IN')}</div>
                    <button
                      className="cart-remove-btn"
                      onClick={() => removeItem(item.productId)}
                      disabled={loadingItemId === item.productId}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="cart-summary-card">
                <div className="cart-summary-row">
                  <span>Items</span>
                  <span>{cartCount}</span>
                </div>
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
                <button className="btn-login" onClick={handleCheckout} disabled={checkoutLoading}>
                  {checkoutLoading ? 'Placing Order...' : 'Proceed to Buy'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
