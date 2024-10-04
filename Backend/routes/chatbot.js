const express = require('express');
const axios = require('axios');
const router = express.Router();
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Define the POST route for the chatbot
router.post('/query', async (req, res) => {
  const userQuery = req.body.query; // Assume the query comes in the body
  const responseText = await generateResponse(userQuery); // Call your function
  res.json({ response: responseText }); // Send back the response
});

// Generate response based on user query
const generateResponse = async (query) => {
  let responseText = '';

  if (query.toLowerCase().includes('movies')) {
    // Call the TMDb API to get trending movies
    try {
      const movieData = await axios.get(
        `https://api.themoviedb.org/3/trending/movie/day?api_key=${process.env.TMDB_API_KEY}`
      );
      const movies = movieData.data.results.slice(0, 3).map(movie => movie.title).join(', ');
      responseText = `Trending movies are: ${movies}`;
    } catch (error) {
      console.error(error);
      responseText = 'Sorry, I could not fetch the latest movies at this time.';
    }
  } else if (query.toLowerCase().includes('games')) {
    // Call the RAWG API to get trending games
    try {
      const gameData = await axios.get(
        `https://api.rawg.io/api/games?key=${process.env.RAWG_API_KEY}&page_size=3`
      );
      const games = gameData.data.results.map(game => game.name).join(', ');
      responseText = `Trending games are: ${games}`;
    } catch (error) {
      console.error(error);
      responseText = 'Sorry, I could not fetch the latest games at this time.';
    }
  } else {
    responseText = "I can help you with movies and games information!";
  }

  return responseText;
};

// Export the router
module.exports = router;
