let lastFetchedMovies = [];
let lastFetchedGames = [];
let moviePage = 1;
let gamePage = 1;

const generateResponse = async (query, axios) => {
    let responseText = '';
    const normalizedQuery = query.toLowerCase();

    // Check for greetings
    if (normalizedQuery.includes('hello') || normalizedQuery.includes('hi') || normalizedQuery.includes('hey')) {
        responseText = "👋 Hello! How can I assist you today with movies or games?";
    } else if (normalizedQuery.includes('bye') || normalizedQuery.includes('goodbye')) {
        responseText = "👋 Goodbye! Have a great day!";
    } else if (normalizedQuery.includes('movies') || normalizedQuery.includes('more movies')) {
        try {
            console.log("Fetching trending movies...");
            const movieData = await axios.get(
                `https://api.themoviedb.org/3/trending/movie/day?api_key=${process.env.TMDB_API_KEY}&page=${moviePage}`
            );

            const movies = movieData.data.results.filter(movie => !lastFetchedMovies.includes(movie.title));
            if (movies.length === 0) {
                responseText = 'No more new movies available. Here are the previous ones:\n' + lastFetchedMovies.join('\n');
            } else {
                const moviesToShow = movies.slice(0, 3);
                lastFetchedMovies.push(...moviesToShow.map(movie => movie.title));

                responseText = `Here are the trending movies:\n${moviesToShow.map(movie => `🎬 ${movie.title} - Rating: ${movie.vote_average}/10`).join('\n')}`;
            }
            moviePage++;
        } catch (error) {
            console.error("Error fetching movies:", error.response ? error.response.data : error.message);
            responseText = 'Sorry, I could not fetch the latest movies at this time. Please try again later.';
        }
    } else if (normalizedQuery.includes('games') || normalizedQuery.includes('more games')) {
        try {
            console.log("Fetching trending games...");
            const gameData = await axios.get(
                `https://api.rawg.io/api/games?key=${process.env.RAWG_API_KEY}&page=${gamePage}&page_size=3`
            );

            const games = gameData.data.results.filter(game => !lastFetchedGames.includes(game.name));
            if (games.length === 0) {
                responseText = 'No more new games available. Here are the previous ones:\n' + lastFetchedGames.join('\n');
            } else {
                const gamesToShow = games.slice(0, 3);
                lastFetchedGames.push(...gamesToShow.map(game => game.name));

                responseText = `Here are the trending games:\n${gamesToShow.map(game => `🎮 ${game.name} - Rating: ${(game.rating).toFixed(2)}/5`).join('\n')}`;
            }
            gamePage++;
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
