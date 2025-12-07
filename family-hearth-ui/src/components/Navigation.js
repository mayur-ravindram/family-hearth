import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

function Navigation() {
  const navigate = useNavigate();
  // State to track login status
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('jwt'));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('family');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/');
  };

  // Effect to listen for storage changes (e.g., login/logout from another tab)
  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem('user');
      setIsLoggedIn(!!localStorage.getItem('jwt'));
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    window.addEventListener('storage', handleStorageChange);

    // Also, custom event for when login happens in the same tab
    const handleLogin = () => {
      const storedUser = localStorage.getItem('user');
      setIsLoggedIn(true);
      setUser(storedUser ? JSON.parse(storedUser) : null);
    }
    window.addEventListener('login', handleLogin);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('login', handleLogin);
    };
  }, []);

  return (
    <nav className="navigation">
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        {isLoggedIn ? (
          <>
            <li>
              <NavLink to="/dashboard">Dashboard</NavLink>
            </li>
            <li>
              <NavLink to="/create-post">Create Post</NavLink>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to="/create-family">Create Family</NavLink>
            </li>
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
          </>
        )}
      </ul>
      {isLoggedIn && (
        <div className="user-actions">
          {user && (
            <div className="avatar">
              {user.firstName.charAt(0)}
              {user.lastName.charAt(0)}
            </div>
          )}
          <button onClick={handleLogout} className="btn-logout-nav">Logout</button>
        </div>
      )}
    </nav>
  );
}

export default Navigation;