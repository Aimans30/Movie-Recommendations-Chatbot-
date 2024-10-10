const express = require('express');
const axios = require('axios');
const router = express.Router();
const dotenv = require('dotenv');
const generateResponse = require('../responses'); // Import the response function

// Load environment variables from .env file
dotenv.config();

// Define the POST route for the chatbot
router.post('/query', async (req, res) => {
    const userQuery = req.body.query; // Assume the query comes in the body
    const responseText = await generateResponse(userQuery, axios); // Pass axios to the function
    res.json({ response: responseText }); // Send back the response
});

// Export the router
module.exports = router;
