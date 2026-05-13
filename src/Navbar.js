import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Navbar({
  user,
  isGuest,
  cartCount = 0,
  onLogout,
  onCartClick,
  searchQuery,
  onSearch,
  onProfileClick,
  onBrowseAsGuest,
}) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const initials = user ? user.name.split(' ').map((word) => word[0]).join('').toUpperCase() : '';

  const navigateToSection = (sectionId) => {
    if (pathname === '/') {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }

    navigate(`/#${sectionId}`);
  };

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <div className="nav-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <div className="nav-logo-icon">AG</div>
          Auto<span>Gear</span>Pro
        </div>

        {pathname !== '/login' && (
          <ul className="nav-links">
            <li><button className={`nav-link-btn ${pathname === '/' ? 'active' : ''}`} onClick={() => navigate('/')}>Home</button></li>
            <li><button className={`nav-link-btn ${pathname === '/products' ? 'active' : ''}`} onClick={() => navigate('/products')}>Products</button></li>
            <li><button className={`nav-link-btn ${pathname === '/deals' ? 'active' : ''}`} onClick={() => navigate('/deals')}>Deals</button></li>
            {user ? <li><button className={`nav-link-btn ${pathname === '/orders' ? 'active' : ''}`} onClick={() => navigate('/orders')}>Orders</button></li> : null}
            {user && user.role === 'admin' ? <li><button className={`nav-link-btn ${pathname === '/admin' ? 'active' : ''}`} onClick={() => navigate('/admin')} style={{ color: '#dc3545', fontWeight: 'bold' }}>Admin Dashboard</button></li> : null}
            <li><button className="nav-link-btn" onClick={() => navigateToSection('about')}>About</button></li>
          </ul>
        )}

        {(pathname === '/products' || pathname === '/deals') && (
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
              <div
                className="nav-user"
                onClick={onProfileClick || (() => navigate('/profile'))}
                title="Open profile"
              >
                <div className="nav-avatar">{initials}</div>
                <span className="nav-user-name">{user.name.split(' ')[0]}</span>
              </div>
              <button className="btn-ghost" onClick={onLogout}>
                Log Out
              </button>
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
              <button className="btn-ghost" onClick={onBrowseAsGuest || (() => navigate('/login'))}>
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
