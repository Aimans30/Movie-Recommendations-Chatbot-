import React, { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import SignUp from './components/Signup';
import Login from './components/Login';

const App = () => {
    const [loggedIn, setLoggedIn] = useState(false); // Track login status

    const handleLogout = () => {
        setLoggedIn(false); // Set loggedIn to false when logging out
    };

    return (
        <div className="App">
            <ChatInterface />
            {!loggedIn && <SignUp />} {/* Show SignUp button only when logged out */}
            <Login loggedIn={loggedIn} setLoggedIn={setLoggedIn} onLogout={handleLogout} /> {/* Pass loggedIn to Login */}
        </div>
    );
};

export default App;
