import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; 

const Login = ({ loggedIn, setLoggedIn, onLogout }) => { // Accept loggedIn as prop
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showLogin, setShowLogin] = useState(false);
    const [username, setUsername] = useState(''); // State to store username

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password,
            });

            const { username } = response.data; // Extract username
            setUsername(username);
            setLoggedIn(true); // Set loggedIn to true
            setMessage('You have been successfully logged in!');

            setTimeout(() => {
                setShowLogin(false); // Close modal
                setEmail(''); // Clear email field
                setPassword(''); // Clear password field
            }, 2000);
        } catch (error) {
            console.error("Error during login:", error.response ? error.response.data : error.message);
            setMessage('Login failed. Please try again.');
        }
    };

    const handleLogout = () => {
        setLoggedIn(false);
        onLogout(); // Call onLogout prop to handle logout
        setUsername(''); // Clear username
    };

    return (
        <div className="login-container">
            {loggedIn ? (
                <div className="welcome-message">
                    <span>Welcome, {username}!</span>
                    <button className="logout-button" onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <button className="login-button" onClick={() => setShowLogin(true)}>Login</button>
            )}
            {showLogin && (
                <div className="login-popup">
                    <button className="close-modal" onClick={() => setShowLogin(false)}>&times;</button>
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
                        <button type="submit" className="submit-button">Login</button>
                    </form>
                    {message && <p>{message}</p>}
                </div>
            )}
        </div>
    );
};

export default Login;
