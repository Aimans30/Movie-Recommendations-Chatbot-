import React, { useState } from 'react';
import { Button, TextField, Container, Typography } from '@mui/material';
import axios from 'axios';

const ChatInterface = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]); // Array to store messages

  const handleSendMessage = async () => {
    // Add user query to the messages array
    const newMessages = [...messages, { sender: 'User', text: query }];
    
    try {
      // Send query to the backend and get the bot's response
      const res = await axios.post('http://localhost:5000/api/chatbot/query', { query });
      const botResponse = res.data.response;

      // Add bot's response to the messages array
      setMessages([...newMessages, { sender: 'Bot', text: botResponse }]);
    } catch (error) {
      setMessages([...newMessages, { sender: 'Bot', text: 'Sorry, something went wrong.' }]);
    }

    setQuery(''); // Clear the input field after sending
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Chatbot
      </Typography>

      <div style={{ minHeight: '200px', border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
        {messages.map((message, index) => (
          <Typography key={index} style={{ textAlign: message.sender === 'User' ? 'right' : 'left' }}>
            <strong>{message.sender}:</strong> {message.text}
          </Typography>
        ))}
      </div>

      <TextField
        fullWidth
        label="Type your message"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        variant="outlined"
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleSendMessage}>
        Send
      </Button>
    </Container>
  );
};

export default ChatInterface;
