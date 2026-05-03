import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Navbar({ user, isGuest, cartCount = 0, onLogout, onCartClick, searchQuery, onSearch }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const initials = user ? user.name.split(' ').map((word) => word[0]).join('').toUpperCase() : '';

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <div className="nav-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <div className="nav-logo-icon">Car</div>
          Auto<span>Gear</span>Pro
        </div>

        {pathname !== '/login' && (
          <ul className="nav-links">
            <li><a href="/" className={pathname === '/' ? 'active' : ''}>Home</a></li>
            <li><a href="/products" className={pathname === '/products' ? 'active' : ''}>Products</a></li>
            <li><a href="#deals" onClick={(e) => { if (pathname !== '/') { e.preventDefault(); window.location.href = '/#deals'; } }}>Deals</a></li>
            <li><a href="#about" onClick={(e) => { if (pathname !== '/') { e.preventDefault(); window.location.href = '/#about'; } }}>About</a></li>
          </ul>
        )}

        {pathname === '/products' && (
          <div className="nav-search">
            <span>Search</span>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery || ''}
              onChange={(event) => onSearch && onSearch(event.target.value)}
            />
          </div>
        )}

        <div className="nav-actions">
          {user ? (
            <>
              <button className="nav-cart-btn" title="Cart" onClick={onCartClick}>
                Cart
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </button>
              <div className="nav-user" onClick={onLogout} title="Click to log out">
                <div className="nav-avatar">{initials}</div>
                <span className="nav-user-name">{user.name.split(' ')[0]}</span>
              </div>
            </>
          ) : null}

          {isGuest && !user ? (
            <>
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>Guest</span>
              <button className="btn-blue" onClick={() => navigate('/login')}>
                Log In
              </button>
            </>
          ) : null}

          {!user && !isGuest ? (
            <>
              <button className="btn-ghost" onClick={() => navigate('/products')}>
                Browse as Guest
              </button>
              <button className="btn-outline-blue" onClick={() => navigate('/login')}>
                Log In
              </button>
              <button className="btn-blue" onClick={() => navigate('/login')}>
                Sign Up
              </button>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
