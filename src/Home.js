import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const CATEGORIES = [
  { icon: '🚘', name: 'Exterior',        count: '245 items' },
  { icon: '🪑', name: 'Interior',         count: '312 items' },
  { icon: '💡', name: 'Lighting',         count: '198 items' },
  { icon: '🔊', name: 'Audio & Electronics', count: '167 items' },
  { icon: '🛞', name: 'Wheels & Tyres',   count: '143 items' },
  { icon: '⚙️', name: 'Performance',      count: '221 items' },
  { icon: '🧼', name: 'Car Care',         count: '189 items' },
  { icon: '🔒', name: 'Safety & Security',count: '134 items' },
];

const FEATURED = [
  { icon: '💺', name: 'Universal Seat Covers',  cat: 'Interior',    price: '₹1,899' },
  { icon: '💡', name: 'LED Headlight Bulbs',    cat: 'Lighting',    price: '₹1,499' },
  { icon: '🔊', name: 'Bluetooth Car Speaker',  cat: 'Audio',       price: '₹1,199' },
  { icon: '🧼', name: 'Car Wax & Polish Kit',   cat: 'Car Care',    price: '₹599'  },
];

function Home({ user, onGuest, onLogout }) {
  const navigate = useNavigate();

  const goGuest = () => {
    onGuest();
    navigate('/products');
  };

  return (
    <div className="home-page">
      <Navbar user={user} onLogout={onLogout} />

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
              <button className="btn-blue" onClick={() => navigate('/login')}>
                Shop Now →
              </button>
              <button className="btn-outline-blue" onClick={goGuest}>
                Browse as Guest
              </button>
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
          <a href="/products" className="section-link">View all →</a>
        </div>
        <div className="cat-grid">
          {CATEGORIES.map(cat => (
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
          <a href="/products" className="section-link">See all →</a>
        </div>
        <div className="product-strip">
          {FEATURED.map(p => (
            <div className="prod-card" key={p.name}>
              <div className="prod-img">{p.icon}</div>
              <div className="prod-body">
                <div className="prod-name">{p.name}</div>
                <div className="prod-cat">{p.cat}</div>
                <div className="prod-footer">
                  <span className="prod-price">{p.price}</span>
                  <button
                    className="prod-add-btn"
                    onClick={() => navigate('/login')}
                    title="Add to cart"
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
            <button className="btn-deals" onClick={() => navigate('/products')}>
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

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-logo">AutoGear<span>Pro</span></div>
        <p className="footer-sub">Your one-stop shop for premium car accessories across India.</p>
        <div className="footer-links">
          <a href="/">Home</a>
          <a href="/products">Products</a>
          <a href="#deals">Deals</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
        <p className="footer-copy">© 2025 AutoGearPro. All rights reserved.</p>
      </footer>

    </div>
  );
}

export default Home;
