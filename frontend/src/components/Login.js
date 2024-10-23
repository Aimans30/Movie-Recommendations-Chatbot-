import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setLoggedIn(true);
      setUsername(localStorage.getItem('username'));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        { email, password },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const { token, username } = response.data; // Ensure username is included in the response
      localStorage.setItem('token', token);
      localStorage.setItem('username', username); // Store username in local storage

      setUsername(username);
      setLoggedIn(true);
      setMessage('You have been successfully logged in!');
      setShowSuccessModal(true);

      setShowLogin(false); // Close login modal

      setTimeout(() => {
        setShowSuccessModal(false);
        setMessage('');
      }, 2000);
    } catch (error) {
      console.error('Error during login:', error);
      setMessage('Login failed. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setLoggedIn(false);
    setUsername('');
    setShowLogoutModal(true);
  };

  const closeLogoutModal = () => {
    setShowLogoutModal(false);
  };

  return (
    <div className="login-container">
      {loggedIn ? (
        <div className="welcome-message">
          <span>Welcome, {username}!</span>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <>
          {showLogin && (
            <div className="login-popup">
              <button className="close-modal" onClick={() => setShowLogin(false)}>
                &times;
              </button>
              <h2>Login</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="submit" className="submit-button">
                  Login
                </button>
              </form>
            </div>
          )}
          {!showLogin && !loggedIn && (
            <button className="login-button" onClick={() => setShowLogin(true)}>
              Login
            </button>
          )}
        </>
      )}

      {showLogoutModal && (
        <div className="logout-popup">
          <h2>You have been successfully logged out.</h2>
          <button onClick={closeLogoutModal}>Close</button>
        </div>
      )}

      {showSuccessModal && (
        <div className="success-popup">
          <h2>{message}</h2>
        </div>
      )}
    </div>
  );
};

export default Login;
