import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import api from './api';

const CATEGORIES = [
  { icon: 'All', name: 'All Products' },
  { icon: 'Ext', name: 'Exterior' },
  { icon: 'Int', name: 'Interior' },
  { icon: 'LED', name: 'Lighting' },
  { icon: 'AV', name: 'Audio & Electronics' },
  { icon: 'Tyre', name: 'Wheels & Tyres' },
  { icon: 'Perf', name: 'Performance' },
  { icon: 'Care', name: 'Car Care' },
  { icon: 'Safe', name: 'Safety & Security' },
];

function Products({ user, isGuest, onLogout, onUserRefresh }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCat] = useState('All Products');
  const [sortBy, setSortBy] = useState('default');
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
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    let list = [...products];

    if (activeCategory !== 'All Products') {
      list = list.filter((product) => product.cat === activeCategory);
    }

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

    return list;
  }, [search, activeCategory, sortBy, products]);

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

      <div className="products-layout">
        <aside className="sidebar">
          <div className="sidebar-card">
            <div className="sidebar-card-head">Categories</div>
            <div className="cat-filter-list">
              {CATEGORIES.map((category) => (
                <button
                  key={category.name}
                  className={`cat-filter-btn ${activeCategory === category.name ? 'active' : ''}`}
                  onClick={() => setActiveCat(category.name)}
                >
                  <span className="cat-filter-icon">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="main-content">
          {isGuest ? (
            <div className="guest-notice">
              You are browsing as a guest. <a href="/login">Log in</a> to add items to cart and checkout.
            </div>
          ) : null}

          {message ? <div className="form-success">{message}</div> : null}

          <div className="search-row" style={{ display: 'flex' }}>
            <div className="search-box" style={{ flex: 1 }}>
              <span className="search-icon">Search</span>
              <input
                type="text"
                placeholder="Search car accessories..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              {search ? (
                <button
                  style={{
                    fontSize: 14,
                    color: 'var(--muted)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSearch('')}
                >
                  Clear
                </button>
              ) : null}
            </div>
          </div>

          <div className="sort-bar">
            <span className="sort-label">Sort by:</span>
            <select className="sort-select" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="default">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <span className="results-count">
              {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
            </span>
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--primary)' }}>No products found</div>
              <div style={{ fontSize: 14, marginTop: 4 }}>Try a different search or category.</div>
            </div>
          ) : (
            <div className="prod-grid">
              {filtered.map((product) => {
                const cartItem = cart.find((item) => item.productId === product.id);

                return (
                  <div className="prod-grid-card" key={product.id}>
                    <div className="prod-grid-img">
                      {product.badge ? (
                        <span
                          className={`prod-badge ${
                            product.badge === 'New' ? 'badge-new' : product.badge === 'Hot' ? 'badge-hot' : 'badge-sale'
                          }`}
                        >
                          {product.badge}
                        </span>
                      ) : null}
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
        </main>
      </div>
    </div>
  );
}

export default Products;
