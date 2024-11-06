import React, { useState, useEffect, useRef } from 'react';
import { Button, TextField, Typography, IconButton } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import axios from 'axios';
import './ChatInterface.css';

const ChatInterface = () => {
  const [username, setUsername] = useState('');
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedbackIndex, setFeedbackIndex] = useState(null);
  const [rating, setRating] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [thankYouMessage, setThankYouMessage] = useState('');
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      setUsername('You');
    }
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!query.trim()) return;

    const newMessages = [...messages, { sender: 'User', text: query }];
    setMessages(newMessages);
    setQuery('');
    setLoading(true);

    try {
      const res = await new Promise((resolve) =>
        setTimeout(async () => {
          const apiRes = await axios.post('http://localhost:5000/api/chatbot/query', { query });
          resolve(apiRes);
        }, 2000)
      );

      const botResponse = res.data.response;
      setMessages([...newMessages, { sender: 'Recommendo', text: botResponse }]);
    } catch (error) {
      setMessages([...newMessages, { sender: 'Recommendo', text: 'Sorry, something went wrong.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = (messageIndex) => {
    setFeedbackIndex(messageIndex);
  };

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleSubmitFeedback = () => {
    console.log({ rating, feedbackText });
    setThankYouMessage('Thank you for your feedback!');

    setFeedbackIndex(null);
    setRating(null);
    setFeedbackText('');

    setTimeout(() => {
      setThankYouMessage('');
    }, 5000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '80vh', padding: '0 10px' }}>
      <div
        ref={chatContainerRef}
        style={{ flex: 1, padding: '10px', overflowY: 'auto', borderRadius: '8px' }}
      >
        {messages.map((message, index) => (
          <div key={index} className={`message-container ${message.sender === 'User' ? 'message-user' : 'message-bot'}`}>
            <Typography className="message-sender">
              {message.sender === 'User' ? username : 'Recommendo'}
            </Typography>
            <Typography className="message-title">{message.text}</Typography>

            {message.sender === 'Recommendo' && (
              <>
                <div className="feedback-container">
                  <IconButton onClick={() => handleFeedback(index)} aria-label="thumbs up">
                    <ThumbUpIcon />
                  </IconButton>
                  <IconButton onClick={() => handleFeedback(index)} aria-label="thumbs down">
                    <ThumbDownIcon />
                  </IconButton>
                </div>

                {feedbackIndex === index && (
                  <div className="rating-container">
                    <div className="rating-bubbles">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <div
                          key={num}
                          className={`rating-bubble ${rating === num ? 'selected' : ''}`}
                          onClick={() => handleRatingClick(num)}
                        >
                          {num}
                        </div>
                      ))}
                    </div>
                    <TextField
                      fullWidth
                      label="Additional Feedback"
                      variant="outlined"
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      multiline
                      rows={2}
                      InputProps={{
                        style: {
                          borderRadius: '20px',
                        },
                      }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ marginTop: '10px' }}
                      onClick={handleSubmitFeedback}
                    >
                      Submit Feedback
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}

        {loading && (
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
      </div>

      {thankYouMessage && (
        <Typography variant="body1" align="center" style={{ marginTop: '20px', color: 'green' }}>
          {thankYouMessage}
        </Typography>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '5px' }}>
        <TextField
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          variant="outlined"
          margin="normal"
          InputProps={{
            style: {
              borderRadius: '20px',
              height: '40px',
              width: '400px',
              padding: '0 10px',
              boxSizing: 'border-box',
            },
          }}
          placeholder="Type your message here..."
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendMessage}
          className="send-button"
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatInterface;
