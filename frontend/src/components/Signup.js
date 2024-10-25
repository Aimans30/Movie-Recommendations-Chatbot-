import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        username,
        email,
        password,
      });

      if (response.status === 201) {
        setMessage('You have been registered successfully!');
        setShowSuccess(true);
        setUsername('');
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      console.error("Error during sign up:", error.response ? error.response.data : error.message);
      if (error.response && error.response.status === 400) {
        // Provide a more specific error message based on response data
        const errorMessage = error.response.data.message || 'Invalid input or email already registered.';
        setMessage(errorMessage);
      } else {
        setMessage('Sign up failed. Server error, please try again later.');
      }
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setMessage('');
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setMessage('');
  };

  return (
    <div className="signup-container">
      <button className="signup-button" onClick={() => setShowPopup(true)}>Sign Up</button>
      {showPopup && (
        <div className="signup-popup">
          <button className="close-modal" onClick={handleClosePopup}>&times;</button>
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
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
            <button type="submit" className="submit-button">Submit</button>
          </form>
          {message && <p className="error-message">{message}</p>}
        </div>
      )}
      {showSuccess && (
        <div className="success-popup">
          <h2>{message}</h2>
          <button onClick={handleCloseSuccess}>Close</button>
        </div>
      )}
    </div>
  );
};

export default SignUp;
