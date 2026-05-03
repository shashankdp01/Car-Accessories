import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function OrderSuccess({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order || user?.orders?.[0] || null;
  const cartCount = user?.cart?.reduce((sum, item) => sum + item.qty, 0) || 0;

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
      />

      <div className="order-success-page">
        <div className="order-success-card">
          <div className="order-success-tag">Order placed</div>
          <h1 className="section-title">Thanks for your purchase</h1>
          <p className="cart-subtitle">
            Your order has been saved to this account and now appears in your order history.
          </p>

          {order ? (
            <div className="order-success-details">
              <div className="cart-summary-row">
                <span>Order ID</span>
                <span>{order.id}</span>
              </div>
              <div className="cart-summary-row">
                <span>Status</span>
                <span>{order.status}</span>
              </div>
              <div className="cart-summary-row">
                <span>Total</span>
                <span>{order.total}</span>
              </div>
              <div className="cart-summary-row">
                <span>Items</span>
                <span>{order.items?.length || 0}</span>
              </div>
            </div>
          ) : (
            <div className="empty-state-copy">We could not find the latest order details.</div>
          )}

          <div className="order-success-actions">
            <button className="btn-blue" onClick={() => navigate('/products')}>
              Back to Products
            </button>
            <button className="btn-outline-blue" onClick={() => navigate('/cart')}>
              View Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
