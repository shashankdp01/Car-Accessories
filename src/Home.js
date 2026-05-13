import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import api from './api';

const CATEGORY_ICONS = {
  Exterior: '🚘',
  Interior: '🪑',
  Lighting: '💡',
  'Audio & Electronics': '🔊',
  'Wheels & Tyres': '🛞',
  Performance: '⚙️',
  'Car Care': '🧼',
  'Safety & Security': '🔒',
};

function Home({ user, onGuest, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const goGuest = () => {
    onGuest();
    navigate('/products');
  };

  const handleShopNow = () => {
    if (user) {
      navigate('/products');
      return;
    }

    navigate('/login');
  };

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data.products);
      } catch (err) {
        console.error('Failed to load products in Home', err);
      }
    };
    fetchProducts();
  }, []);

  const categories = Object.entries(
    products.reduce((acc, product) => {
      acc[product.cat] = (acc[product.cat] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, count]) => ({
    name,
    icon: CATEGORY_ICONS[name] || '🛠️',
    count: `${count} items`,
  }));

  const featured = [...products]
    .sort((left, right) => right.rating - left.rating || left.price - right.price)
    .slice(0, 4);

  useEffect(() => {
    if (!location.hash) return;

    const sectionId = location.hash.replace('#', '');
    setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  }, [location.hash]);

  return (
    <div className="home-page">
      <Navbar user={user} onLogout={onLogout} onBrowseAsGuest={goGuest} />

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-inner">

          <div className="hero-content">
            <div className="hero-tag">🚗 India's Favourite Car Accessories Store</div>

            <h1 className="hero-title">
              Everything Your<br />
              <span>Car Needs,</span><br />
              In One Place.
            </h1>

            <p className="hero-sub">
              Shop premium car accessories — from seat covers and LED lights to
              alloy wheels and performance parts. Fast delivery across India.
            </p>

            <div className="hero-btns">
              <button className="btn-blue" onClick={handleShopNow}>
                Shop Now →
              </button>
              {!user ? (
                <button className="btn-outline-blue" onClick={goGuest}>
                  Browse as Guest
                </button>
              ) : null}
            </div>

            <div className="hero-stats">
              <div className="stat-box">
                <span className="stat-num">10,000+</span>
                <span className="stat-lbl">Products</span>
              </div>
              <div className="stat-box">
                <span className="stat-num">50,000+</span>
                <span className="stat-lbl">Customers</span>
              </div>
              <div className="stat-box">
                <span className="stat-num">4.8 ★</span>
                <span className="stat-lbl">Avg Rating</span>
              </div>
              <div className="stat-box">
                <span className="stat-num">Free</span>
                <span className="stat-lbl">Delivery ₹499+</span>
              </div>
            </div>
          </div>

          {/* Right visual card */}
          <div className="hero-image">
            <div className="hero-image-top">🚗</div>
            <div className="hero-image-list">
              {[
                { icon: '💡', name: 'LED Headlights',  price: '₹1,499' },
                { icon: '🛞', name: 'Alloy Wheel Set', price: '₹8,999' },
                { icon: '🪑', name: 'Seat Covers',     price: '₹1,899' },
                { icon: '📸', name: 'Dash Camera',     price: '₹2,999' },
              ].map(item => (
                <div className="hero-item" key={item.name}>
                  <span className="hero-item-icon">{item.icon}</span>
                  <span className="hero-item-name">{item.name}</span>
                  <span className="hero-item-price">{item.price}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── Shop by Category ── */}
      <section className="section">
        <div className="section-head">
          <h2 className="section-title">Shop by Category</h2>
          <button className="section-link" onClick={() => navigate('/products')}>View all →</button>
        </div>
        <div className="cat-grid">
          {categories.map(cat => (
            <div
              className="cat-card"
              key={cat.name}
              onClick={() => navigate('/products')}
            >
              <div className="cat-icon">{cat.icon}</div>
              <div className="cat-name">{cat.name}</div>
              <div className="cat-count">{cat.count}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-head">
          <h2 className="section-title">Top Picks This Week</h2>
          <button className="section-link" onClick={() => navigate('/products')}>See all →</button>
        </div>
        <div className="product-strip">
          {featured.map(p => (
            <div className="prod-card" key={p.id || p.name}>
              <div className="prod-img">
                {p.image ? (
                  <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '10px' }} />
                ) : (
                  p.icon || '🛠️'
                )}
              </div>
              <div className="prod-body">
                <div className="prod-name">{p.name}</div>
                <div className="prod-cat">{p.cat} {p.brand ? `• ${p.brand}` : ''}</div>
                <div className="prod-footer">
                  <span className="prod-price">₹{p.price.toLocaleString('en-IN')}</span>
                  <button
                    className="prod-add-btn"
                    onClick={() => navigate('/products')}
                    title="View product"
                  >＋</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Deals Banner ── */}
      <div id="deals" className="deals-wrap">
        <div className="deals-banner">
          <div>
            <div className="deals-tag">🔥 Limited Time Offer</div>
            <h2 className="deals-title">Up to <span>40% Off</span><br />on Top Brands</h2>
            <p className="deals-sub">New deals every week. Don't miss out!</p>
            <button className="btn-deals" onClick={() => navigate('/deals')}>
              Explore Deals →
            </button>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div className="deals-num">40%</div>
            <div className="deals-off">OFF</div>
          </div>
        </div>
      </div>

      {/* ── About Us ── */}
      <section id="about" className="about-section">
        <div className="about-inner">
          <h2>About AutoGearPro</h2>
          <p>
            AutoGearPro is India's leading online destination for premium car accessories.
            We offer a wide range of high-quality products from trusted brands, ensuring
            your vehicle gets the best care and customization it deserves.
          </p>
          <p>
            With fast delivery across India and exceptional customer service, we're here
            to make car ownership more enjoyable and convenient.
          </p>
        </div>
      </section>

      <section id="contact" className="about-section" style={{ paddingTop: 0 }}>
        <div className="about-inner">
          <h2>Contact Support</h2>
          <p>Need help with an order, delivery, or product fitment? Our team is ready to assist you.</p>
          <p>Email: support@autogearpro.in | Phone: +91 1800-123-4567 | Mon-Sat, 9:00 AM - 8:00 PM</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-logo">AutoGear<span>Pro</span></div>
        <p className="footer-sub">Your one-stop shop for premium car accessories across India.</p>
        <div className="footer-links">
          <button onClick={() => navigate('/')}>Home</button>
          <button onClick={() => navigate('/products')}>Products</button>
          <button onClick={() => navigate('/deals')}>Deals</button>
          <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>About</button>
          <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>Contact</button>
        </div>
        <p className="footer-copy">© 2025 AutoGearPro. All rights reserved.</p>
      </footer>

    </div>
  );
}

export default Home;
