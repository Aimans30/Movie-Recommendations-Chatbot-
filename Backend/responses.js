const generateResponse = async (query, axios) => {
    let responseText = '';
    const normalizedQuery = query.toLowerCase();

    // Check for greetings
    if (normalizedQuery.includes('hello') || normalizedQuery.includes('hi') || normalizedQuery.includes('hey')) {
        responseText = "👋 Hello! How can I assist you today with movies or games?";
    } else if (normalizedQuery.includes('bye') || normalizedQuery.includes('goodbye')) {
        responseText = "👋 Goodbye! Have a great day!";
    } else if (normalizedQuery.includes('movies')) {
        try {
            console.log("Fetching trending movies...");
            const movieData = await axios.get(
                `https://api.themoviedb.org/3/trending/movie/day?api_key=${process.env.TMDB_API_KEY}`
            );

            const movies = movieData.data.results.slice(0, 3).map(movie => {
                return `🎬 ${movie.title} - Rating: ${movie.vote_average}/10`;
            });

            responseText = `Here are the trending movies:\n${movies.join('\n')}`;
        } catch (error) {
            console.error("Error fetching movies:", error.response ? error.response.data : error.message);
            responseText = 'Sorry, I could not fetch the latest movies at this time. Please try again later.';
        }
    } else if (normalizedQuery.includes('games')) {
        try {
            console.log("Fetching trending games...");
            const gameData = await axios.get(
                `https://api.rawg.io/api/games?key=${process.env.RAWG_API_KEY}&page_size=3`
            );
            console.log("Game data fetched successfully:", gameData.data);

            const games = gameData.data.results.map(game => (
                `🎮 ${game.name} - Rating: ${(game.rating).toFixed(2)}/5`
            )).join('\n');

            responseText = `Here are the trending games:\n${games}`;
        } catch (error) {
            console.error("Error fetching games:", error.response ? error.response.data : error.message);
            responseText = 'Sorry, I could not fetch the latest games at this time. Please try again later.';
        }
    } else if (normalizedQuery.includes('recommend')) {
        responseText = "What type of game do you want a recommendation for? Please specify the genre.";
    } else {
        responseText = "I can help you with movies and games information! Just ask about trending movies or games.";
    }

    return responseText;
};

// Export the function
module.exports = generateResponse;
