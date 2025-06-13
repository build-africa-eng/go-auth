// src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { logout } from '../firebase/auth';
import Button from './Button';

const Sidebar = () => {
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout Error:', error.message);
    }
  };

  return (
    <div className="sidebar">
      <h3 className="text-xl font-bold mb-6 text-gray-900">Menu</h3>
      <Link
        to="/dashboard"
        className={`sidebar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
      >
        Dashboard
      </Link>
      <Link
        to="/profile"
        className={`sidebar-link ${location.pathname === '/profile' ? 'active' : ''}`}
      >
        Profile
      </Link>
      <Link
        to="/settings"
        className={`sidebar-link ${location.pathname === '/settings' ? 'active' : ''}`}
      >
        Settings
      </Link>
      <Link
        to="/analytics"
        className={`sidebar-link ${location.pathname === '/analytics' ? 'active' : ''}`}
      >
        Analytics
      </Link>
      <Button
        onClick={handleLogout}
        className="logout-button mt-4"
        ariaLabel="Log out"
      >
        Logout
      </Button>
    </div>
  );
};

export default Sidebar;