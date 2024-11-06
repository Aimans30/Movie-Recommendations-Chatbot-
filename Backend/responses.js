let lastFetchedMovies = [];
let lastFetchedGames = [];
let moviePage = 1;
let gamePage = 1;

const generateResponse = async (query, axios) => {
    let responseText = '';
    const normalizedQuery = query.toLowerCase();
    
    // Helper function to find a genre ID by name
    const findGenreId = (name, genreList) => {
        const genre = genreList.find(g => g.name.toLowerCase() === name.toLowerCase());
        return genre ? genre.id : null;
    };

    // Fetch genre lists
    const movieGenresData = await axios.get(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.TMDB_API_KEY}`
    );
    const movieGenres = movieGenresData.data.genres;

    const gameGenresData = await axios.get(
        `https://api.rawg.io/api/genres?key=${process.env.RAWG_API_KEY}`
    );
    const gameGenres = gameGenresData.data.results;

    // Check for greetings
    if (normalizedQuery.includes('hello') || normalizedQuery.includes('hi') || normalizedQuery.includes('hey')) {
        responseText = "👋 Hello! How can I assist you today with movies or games?";
    } else if (normalizedQuery.includes('bye') || normalizedQuery.includes('goodbye')) {
        responseText = "👋 Goodbye! Have a great day!";
    } else if (normalizedQuery.includes('movies') || normalizedQuery.includes('more movies')) {
        try {
            let genreId = null;
            // Check if the query mentions a specific genre
            for (const genre of movieGenres) {
                if (normalizedQuery.includes(genre.name.toLowerCase())) {
                    genreId = genre.id;
                    break;
                }
            }

            const movieUrl = genreId
                ? `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&with_genres=${genreId}&page=${moviePage}`
                : `https://api.themoviedb.org/3/trending/movie/day?api_key=${process.env.TMDB_API_KEY}&page=${moviePage}`;

            const movieData = await axios.get(movieUrl);
            const movies = movieData.data.results.filter(movie => !lastFetchedMovies.includes(movie.title));

            if (movies.length === 0) {
                responseText = 'No more new movies available. Here are the previous ones:\n' + lastFetchedMovies.join('\n');
            } else {
                const moviesToShow = movies.slice(0, 3);
                lastFetchedMovies.push(...moviesToShow.map(movie => movie.title));

                const moviesWithGenres = moviesToShow.map(movie => {
                    const movieGenresList = movie.genre_ids.map(id => movieGenres.find(genre => genre.id === id)?.name).join(', ');
                    return `🎬 ${movie.title} - Rating: ${movie.vote_average}/10 | Genres: ${movieGenresList}`;
                });

                responseText = `Here are the trending movies:\n${moviesWithGenres.join('\n')}`;
            }
            moviePage++;
        } catch (error) {
            console.error("Error fetching movies:", error.response ? error.response.data : error.message);
            responseText = 'Sorry, I could not fetch the latest movies at this time. Please try again later.';
        }
    } else if (normalizedQuery.includes('games') || normalizedQuery.includes('more games')) {
        try {
            let genreId = null;
            // Check if the query mentions a specific genre
            for (const genre of gameGenres) {
                if (normalizedQuery.includes(genre.name.toLowerCase())) {
                    genreId = genre.id;
                    break;
                }
            }

            const gameUrl = genreId
                ? `https://api.rawg.io/api/games?key=${process.env.RAWG_API_KEY}&genres=${genreId}&page=${gamePage}&page_size=3`
                : `https://api.rawg.io/api/games?key=${process.env.RAWG_API_KEY}&page=${gamePage}&page_size=3`;

            const gameData = await axios.get(gameUrl);
            const games = gameData.data.results.filter(game => !lastFetchedGames.includes(game.name));

            if (games.length === 0) {
                responseText = 'No more new games available. Here are the previous ones:\n' + lastFetchedGames.join('\n');
            } else {
                const gamesToShow = games.slice(0, 3);
                lastFetchedGames.push(...gamesToShow.map(game => game.name));

                const gamesWithGenres = gamesToShow.map(game => {
                    const gameGenresList = game.genres.map(genre => genre.name).join(', ');
                    return `🎮 ${game.name} - Rating: ${(game.rating).toFixed(2)}/5 | Genres: ${gameGenresList}`;
                });

                responseText = `Here are the trending games:\n${gamesWithGenres.join('\n')}`;
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
