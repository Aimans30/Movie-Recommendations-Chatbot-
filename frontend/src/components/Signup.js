import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css';

const SignUp = ({ onSignUp }) => { // Accept onSignUp as a prop
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
            setMessage(response.data.message);
            setShowSuccess(true);
            setUsername('');
            setEmail('');
            setPassword('');
            onSignUp(); // Call the onSignUp prop to notify the parent of success
        } catch (error) {
            console.error("Error during sign up:", error.response ? error.response.data : error.message);
            setMessage('Sign up failed. Please try again.');
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
                    {message && <p>{message}</p>}
                </div>
            )}
            {showSuccess && (
                <div className="success-popup">
                    <h2>You have been registered successfully!</h2>
                    <button onClick={handleCloseSuccess}>Close</button>
                </div>
            )}
        </div>
    );
};

export default SignUp;
