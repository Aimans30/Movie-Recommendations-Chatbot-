import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Paper, Box, IconButton } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import axios from 'axios'; // Imported axios
import './ChatInterface.css';

const ChatInterface = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedbackIndex, setFeedbackIndex] = useState(null); // Track feedback for which message
  const [rating, setRating] = useState(null); // Track the rating value
  const [feedbackText, setFeedbackText] = useState(''); // Track feedback text
  const [thankYouMessage, setThankYouMessage] = useState(''); // Track the thank you message

  const handleSendMessage = async () => {
    if (!query.trim()) return;

    const newMessages = [...messages, { sender: 'User', text: query }];
    setMessages(newMessages);
    setQuery('');
    setLoading(true);

    try {
      const res = await new Promise((resolve) =>
        setTimeout(async () => {
          const apiRes = await axios.post('http://localhost:5000/api/chatbot/query', { query }); // API call
          resolve(apiRes);
        }, 2000) // Simulate delay for loading animation
      );

      const botResponse = res.data.response;
      setMessages([...newMessages, { sender: 'Bot', text: botResponse }]);
    } catch (error) {
      setMessages([...newMessages, { sender: 'Bot', text: 'Sorry, something went wrong.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = (messageIndex) => {
    setFeedbackIndex(messageIndex); // Open the feedback section for this specific message
  };

  const handleRatingClick = (value) => {
    setRating(value); // Set the rating when clicked
  };

  const handleSubmitFeedback = () => {
    console.log({ rating, feedbackText }); // Handle submission here
    setThankYouMessage('Thank you for your feedback!'); // Show thank you message

    // Reset feedback state
    setFeedbackIndex(null);
    setRating(null);
    setFeedbackText('');

    // Hide thank you message after 5 seconds
    setTimeout(() => {
      setThankYouMessage('');
    }, 5000);
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '20px', height: '80vh', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" gutterBottom align="center">
        Chatbot
      </Typography>

      <Paper elevation={3} style={{ flex: 1, padding: '15px', marginBottom: '20px', overflowY: 'auto' }}>
        <div className="scrollable-messages">
          {messages.map((message, index) => (
            <Box key={index} className={`message-container ${message.sender === 'User' ? 'message-user' : 'message-bot'}`}>
              <Typography className="message-sender">
                {message.sender === 'User' ? 'You' : 'Bot'}
              </Typography>
              <Typography className="message-title">
                {message.text}
              </Typography>

              {/* Feedback section only for Bot messages */}
              {message.sender === 'Bot' && (
                <>
                  <div className="feedback-container">
                    <IconButton onClick={() => handleFeedback(index)} aria-label="thumbs up">
                      <ThumbUpIcon />
                    </IconButton>
                    <IconButton onClick={() => handleFeedback(index)} aria-label="thumbs down">
                      <ThumbDownIcon />
                    </IconButton>
                  </div>

                  {/* Show feedback box with rating and text input if feedback for this message is requested */}
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
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        style={{ marginTop: '10px' }}
                        onClick={handleSubmitFeedback} // Call the submit feedback function
                      >
                        Submit Feedback
                      </Button>
                    </div>
                  )}
                </>
              )}
            </Box>
          ))}

          {loading && (
            <Box className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </Box>
          )}
        </div>

        {/* Display thank you message */}
        {thankYouMessage && (
          <Typography variant="body1" align="center" style={{ marginTop: '20px', color: 'green' }}>
            {thankYouMessage}
          </Typography>
        )}
      </Paper>

      <TextField
        fullWidth
        label="Type your message"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        variant="outlined"
        margin="normal"
        onKeyPress={(e) => {
          if (e.key === 'Enter') handleSendMessage();
        }}
      />
      <Button variant="contained" color="primary" fullWidth onClick={handleSendMessage}>
        Send
      </Button>
    </Container>
  );
};

export default ChatInterface;
