import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function statusClass(status) {
  if (status === 'Delivered') return 'order-status status-delivered';
  if (status === 'In Transit') return 'order-status status-transit';
  return 'order-status status-processing';
}

function Orders({ user, onLogout }) {
  const navigate = useNavigate();
  const orders = user?.orders || [];
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
        onProfileClick={() => navigate('/profile')}
      />

      <div className="order-success-page">
        <div className="cart-header">
          <div>
            <h1 className="section-title">My Orders</h1>
            <p className="cart-subtitle">Review your past orders and track their current status.</p>
          </div>
          <button className="btn-outline-blue" onClick={() => navigate('/products')}>
            Continue Shopping
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-title">No orders yet</div>
            <p className="empty-state-copy">Place your first order to see tracking details here.</p>
            <button className="btn-blue" onClick={() => navigate('/products')}>
              Shop Now
            </button>
          </div>
        ) : (
          <div className="cart-items">
            {orders.map((order) => (
              <div className="cart-item-card" key={order.id} style={{ gridTemplateColumns: '1fr' }}>
                <div className="cart-summary-row">
                  <span className="order-id">{order.id}</span>
                  <span className={statusClass(order.status)}>{order.status}</span>
                </div>
                <div className="cart-summary-row">
                  <span className="cart-item-meta">Placed on</span>
                  <span className="cart-item-meta">
                    {order.placedAt ? new Date(order.placedAt).toLocaleString('en-IN') : 'N/A'}
                  </span>
                </div>
                <div className="cart-summary-row">
                  <span className="cart-item-meta">Total</span>
                  <span className="cart-item-price">{order.total}</span>
                </div>
                {order.address && (
                  <div className="cart-summary-row" style={{ alignItems: 'flex-start', marginTop: '4px' }}>
                    <span className="cart-item-meta">Shipping To</span>
                    <span className="cart-item-meta" style={{ textAlign: 'right', maxWidth: '60%' }}>{order.address}</span>
                  </div>
                )}
                {order.paymentMethod && (
                  <div className="cart-summary-row" style={{ marginTop: '4px' }}>
                    <span className="cart-item-meta">Payment Method</span>
                    <span className="cart-item-meta">{order.paymentMethod}</span>
                  </div>
                )}
                <div className="order-success-details" style={{ margin: '8px 0 0' }}>
                  {(order.items || []).map((item) => (
                    <div key={`${order.id}-${item.productId}`} className="cart-summary-row">
                      <span>
                        {item.name} x {item.qty}
                      </span>
                      <span>Rs. {(item.price * item.qty).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
