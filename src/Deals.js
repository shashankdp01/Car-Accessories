import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import api from './api';

function Deals({ user, isGuest, onLogout, onUserRefresh }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('discount');
  const [message, setMessage] = useState('');
  const [savingProductId, setSavingProductId] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data.products);
      } catch (err) {
        console.error('Failed to fetch deals', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const dealProducts = useMemo(() => {
    const deals = products.filter((product) => product.badge === 'Sale' || product.badge === 'Hot');

    let list = [...deals];

    if (search.trim()) {
      const query = search.toLowerCase();
      list = list.filter(
        (product) =>
          product.name.toLowerCase().includes(query) || product.cat.toLowerCase().includes(query)
      );
    }

    if (sortBy === 'price-asc') list.sort((left, right) => left.price - right.price);
    if (sortBy === 'price-desc') list.sort((left, right) => right.price - left.price);
    if (sortBy === 'rating') list.sort((left, right) => right.rating - left.rating);
    if (sortBy === 'discount') {
      list.sort((left, right) => {
        if (left.badge === right.badge) return right.rating - left.rating;
        return left.badge === 'Sale' ? -1 : 1;
      });
    }

    return list;
  }, [search, sortBy, products]);

  const cart = user?.cart || [];
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const addToCart = async (product) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setSavingProductId(product.id);
    setMessage('');

    try {
      const { data } = await api.post(`/users/${user.id}/cart`, { product });
      onUserRefresh(data.user);
      setMessage(`${product.name} added to cart.`);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to add the item to cart.');
    } finally {
      setSavingProductId(null);
    }
  };

  return (
    <div className="products-page">
      <Navbar
        user={user}
        isGuest={isGuest}
        cartCount={cartCount}
        onCartClick={() => navigate('/cart')}
        onLogout={() => {
          onLogout();
          navigate('/');
        }}
        onProfileClick={() => navigate('/profile')}
        searchQuery={search}
        onSearch={setSearch}
      />

      <div className="cart-page">
        <div className="deals-banner" style={{ marginBottom: 20 }}>
          <div>
            <div className="deals-tag">Limited Time Deals</div>
            <h2 className="deals-title">Best Prices on Top Accessories</h2>
            <p className="deals-sub">Showing products currently tagged with Sale and Hot offers.</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div className="deals-num">40%</div>
            <div className="deals-off">OFF</div>
          </div>
        </div>

        {isGuest ? (
          <div className="guest-notice" style={{ marginBottom: 16 }}>
            You are browsing as a guest. <a href="/login">Log in</a> to add items to cart and checkout.
          </div>
        ) : null}

        {message ? <div className="form-success">{message}</div> : null}

        <div className="sort-bar" style={{ marginBottom: 16 }}>
          <span className="sort-label">Sort by:</span>
          <select className="sort-select" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="discount">Best Deals</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
          <span className="results-count">
            {dealProducts.length} deal{dealProducts.length !== 1 ? 's' : ''} found
          </span>
        </div>

        {dealProducts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-title">No deals found</div>
            <div className="empty-state-copy">Try another search query or check back soon for fresh offers.</div>
          </div>
        ) : (
          <div className="prod-grid">
            {dealProducts.map((product) => {
              const cartItem = cart.find((item) => item.productId === product.id);

              return (
                <div className="prod-grid-card" key={product.id}>
                  <div className="prod-grid-img">
                    <span className={`prod-badge ${product.badge === 'Sale' ? 'badge-sale' : 'badge-hot'}`}>
                      {product.badge}
                    </span>
                    {product.image ? (
                      <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '10px' }} />
                    ) : (
                      product.icon
                    )}
                  </div>
                  <div className="prod-grid-body">
                    <div className="prod-grid-cat">{product.cat} {product.brand ? `• ${product.brand}` : ''}</div>
                    <div className="prod-grid-name">{product.name}</div>
                    <div className="prod-grid-rating">{product.rating} / 5</div>
                    <div className="prod-grid-footer">
                      <div className="prod-grid-price">
                        Rs. {product.price.toLocaleString('en-IN')}
                        <small> incl. GST</small>
                      </div>
                      {user ? (
                        <button
                          className="btn-add-cart"
                          onClick={() => addToCart(product)}
                          disabled={savingProductId === product.id}
                        >
                          {savingProductId === product.id
                            ? 'Adding...'
                            : cartItem
                              ? `In Cart (${cartItem.qty})`
                              : '+ Add'}
                        </button>
                      ) : (
                        <button className="btn-locked" title="Login to add to cart" onClick={() => navigate('/login')}>
                          Login
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Deals;
