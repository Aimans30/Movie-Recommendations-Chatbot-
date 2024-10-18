import React from 'react';
import ChatInterface from './components/ChatInterface';
import SignUp from './components/Signup';
import Login from './components/Login';

const App = () => {
  return (
    <div className="App">
      <ChatInterface />
      <SignUp />
      <Login />
    </div>
  );
};

export default App;
