import React from 'react';
import ChatInterface from './components/ChatInterface';
import SignUp from './components/Signup';
import Login from './components/Login';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <div className="App">
      <Navbar />
      <ChatInterface />
      <SignUp />
      <Login />
    </div>
  );
};

export default App;
