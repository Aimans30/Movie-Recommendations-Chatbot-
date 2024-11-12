let lastFetchedMovies = [];
let lastFetchedGames = [];
let lastFetchedShows = [];
let moviePage = 1;
let gamePage = 1;
let showPage = 1;  // Track page for shows

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

    const showGenresData = await axios.get(
        `https://api.themoviedb.org/3/genre/tv/list?api_key=${process.env.TMDB_API_KEY}`
    );
    const showGenres = showGenresData.data.genres;

    const gameGenresData = await axios.get(
        `https://api.rawg.io/api/genres?key=${process.env.RAWG_API_KEY}`
    );
    const gameGenres = gameGenresData.data.results;

    // Check for greetings
    if (normalizedQuery.includes('hello') || normalizedQuery.includes('hi') || normalizedQuery.includes('hey')) {
        responseText = "👋 Hello! How can I assist you today with movies, shows, or games?";
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
                    const movieGenresList = movie.genre_ids.map(id => movieGenres.find(genre => genre.id === id)?.name).join(', ') || 'Not available';
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
                    const gameGenresList = game.genres.map(genre => genre.name).join(', ') || 'Not available';
                    const gamePlatformsList = game.platforms.map(platform => platform.platform.name).join(', ') || 'Not available'; // Get the platforms
                    return `🎮 ${game.name} - Rating: ${(game.rating).toFixed(2)}/5 | Genres: ${gameGenresList} | Platforms: ${gamePlatformsList}`;
                });

                responseText = `Here are the trending games:\n${gamesWithGenres.join('\n')}`;
            }
            gamePage++;
        } catch (error) {
            console.error("Error fetching games:", error.response ? error.response.data : error.message);
            responseText = 'Sorry, I could not fetch the latest games at this time. Please try again later.';
        }
    } else if (normalizedQuery.includes('shows') || normalizedQuery.includes('tv shows') || normalizedQuery.includes('web series')) {
        try {
            let genreId = null;
            // Check if the query mentions a specific genre
            for (const genre of showGenres) {
                if (normalizedQuery.includes(genre.name.toLowerCase())) {
                    genreId = genre.id;
                    break;
                }
            }

            const showUrl = genreId
                ? `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.TMDB_API_KEY}&with_genres=${genreId}&page=${showPage}`
                : `https://api.themoviedb.org/3/trending/tv/day?api_key=${process.env.TMDB_API_KEY}&page=${showPage}`;

            const showData = await axios.get(showUrl);
            const shows = showData.data.results.filter(show => !lastFetchedShows.includes(show.name));

            if (shows.length === 0) {
                responseText = 'No more new shows available. Here are the previous ones:\n' + lastFetchedShows.join('\n');
            } else {
                const showsToShow = shows.slice(0, 3);
                lastFetchedShows.push(...showsToShow.map(show => show.name));

                const showsWithGenres = showsToShow.map(show => {
                    const showGenresList = show.genre_ids.map(id => showGenres.find(genre => genre.id === id)?.name).join(', ') || 'Not available';
                    return `📺 ${show.name} - Rating: ${show.vote_average}/10 | Genres: ${showGenresList}`;
                });

                responseText = `Here are the trending shows:\n${showsWithGenres.join('\n')}`;
            }
            showPage++;
        } catch (error) {
            console.error("Error fetching shows:", error.response ? error.response.data : error.message);
            responseText = 'Sorry, I could not fetch the latest shows at this time. Please try again later.';
        }
    } else if (normalizedQuery.includes('details about show')) {
        // Extract the show name from the query (e.g., "Breaking Bad")
        const showName = normalizedQuery.replace('details about show', '').trim();
        if (showName) {
            try {
                const showDetailsUrl = `https://api.themoviedb.org/3/search/tv?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(showName)}`;
                const showDetailsData = await axios.get(showDetailsUrl);

                if (showDetailsData.data.results.length > 0) {
                    const show = showDetailsData.data.results[0]; // Assuming the first result is the correct show
                    const showDescription = show.overview || 'No description available.';
                    const showFirstAirDate = show.first_air_date || 'Air date not available.';
                    const showGenresList = (show.genre_ids && show.genre_ids.length > 0) ? show.genre_ids.map(id => showGenres.find(genre => genre.id === id)?.name).join(', ') : 'Not available';
                    const showRating = show.vote_average ? `${show.vote_average}/10` : 'Not rated';

                    // Fetch the show’s credits (cast)
                    const showCreditsUrl = `https://api.themoviedb.org/3/tv/${show.id}/credits?api_key=${process.env.TMDB_API_KEY}`;
                    const showCreditsData = await axios.get(showCreditsUrl);
                    const cast = (showCreditsData.data.cast && showCreditsData.data.cast.length > 0) ? showCreditsData.data.cast.slice(0, 3).map(actor => actor.name).join(', ') : 'Not available';

                    responseText = `Here are the details for ${show.name}:\n\nDescription: ${showDescription}\nAir Date: ${showFirstAirDate}\nGenres: ${showGenresList}\nRating: ${showRating}\nCast: ${cast}`;
                } else {
                    responseText = `Sorry, I couldn't find any details for the show "${showName}". Please check the title and try again.`;
                }
            } catch (error) {
                console.error("Error fetching show details:", error.response ? error.response.data : error.message);
                responseText = 'Sorry, I could not fetch details for the requested show at this time. Please try again later.';
            }
        } else {
            responseText = "Please provide a show name after 'details about show'. For example, 'details about show Breaking Bad'.";
        }
    } else {
        responseText = "I can help you with movies, shows, and games information! Just ask about trending movies, shows, or games.";
    }

    return responseText;
};

// Export the function
module.exports = generateResponse;
