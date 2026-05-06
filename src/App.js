import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import api from './api';
import Cart from './Cart';
import Deals from './Deals';
import Home from './Home';
import Login from './Login';
import Orders from './Orders';
import OrderSuccess from './OrderSuccess';
import Profile from './Profile';
import Products from './Products';
import './App.css';

const STORAGE_KEY = 'autogearpro_user';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem(STORAGE_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isGuest, setIsGuest] = useState(() => localStorage.getItem('autogearpro_guest') === 'true');

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      localStorage.removeItem('autogearpro_guest');
      return;
    }

    localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  useEffect(() => {
    localStorage.setItem('autogearpro_guest', String(isGuest));
  }, [isGuest]);

  useEffect(() => {
    const refreshUser = async () => {
      if (!user?.id) {
        return;
      }

      try {
        const { data } = await api.get(`/users/${user.id}`);
        setUser(data.user);
      } catch (error) {
        console.error('Failed to refresh user profile', error);
      }
    };

    refreshUser();
  }, [user?.id]);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsGuest(false);
  };

  const handleGuest = () => {
    setIsGuest(true);
    setUser(null);
  };

  const handleLogout = () => {
    setUser(null);
    setIsGuest(false);
  };

  const handleUserRefresh = (userData) => {
    setUser(userData);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home user={user} onGuest={handleGuest} onLogout={handleLogout} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} onGuest={handleGuest} />} />
        <Route
          path="/products"
          element={
            user || isGuest ? (
              <Products
                user={user}
                isGuest={isGuest}
                onLogout={handleLogout}
                onUserRefresh={handleUserRefresh}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/deals"
          element={
            <Deals
              user={user}
              isGuest={isGuest || !user}
              onLogout={handleLogout}
              onUserRefresh={handleUserRefresh}
            />
          }
        />
        <Route
          path="/cart"
          element={
            user ? (
              <Cart user={user} onLogout={handleLogout} onUserRefresh={handleUserRefresh} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/profile"
          element={
            user ? (
              <Profile user={user} onLogout={handleLogout} onUserRefresh={handleUserRefresh} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/orders"
          element={
            user ? (
              <Orders user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/order-success"
          element={user ? <OrderSuccess user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
