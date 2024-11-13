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
    } else if (normalizedQuery.includes('details about movie')) {
        const movieName = normalizedQuery.replace('details about movie', '').trim();
        if (movieName) {
            try {
                const movieDetailsUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(movieName)}`;
                const movieDetailsData = await axios.get(movieDetailsUrl);

                if (movieDetailsData.data.results.length > 0) {
                    const movie = movieDetailsData.data.results[0];
                    const movieDescription = movie.overview || 'No description available.';
                    const movieReleaseDate = movie.release_date || 'Release date not available.';
                    const movieGenresList = (movie.genre_ids && movie.genre_ids.length > 0) 
                        ? movie.genre_ids.map(id => movieGenres.find(genre => genre.id === id)?.name).join(', ') 
                        : 'Not available';
                    const movieRating = movie.vote_average ? `${movie.vote_average}/10` : 'Not rated';

                    const movieCreditsUrl = `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${process.env.TMDB_API_KEY}`;
                    const movieCreditsData = await axios.get(movieCreditsUrl);
                    const castList = movieCreditsData.data.cast.slice(0, 5).map(cast => cast.name).join(', ') || 'Not available';

                    responseText = `🎬 Movie: ${movie.title}
⭐ Rating: ${movieRating}
🗓️ Release Date: ${movieReleaseDate}
🎬 Cast: ${castList}
🎥 Genres: ${movieGenresList}
📜 Description: ${movieDescription}
                    `;
                } else {
                    responseText = `Sorry, I couldn't find any details about "${movieName}". Please try again.`;
                }
            } catch (error) {
                console.error("Error fetching movie details:", error.response ? error.response.data : error.message);
                responseText = 'Sorry, I could not fetch movie details at this time. Please try again later.';
            }
        } else {
            responseText = 'Please provide the name of the movie you want details about.';
        }
    } else if (normalizedQuery.includes('games') || normalizedQuery.includes('more games')) {
        try {
            let genreId = null;
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
                    const gameGenresList = game.genres && game.genres.length > 0
                        ? game.genres.map(genre => genre.name).join(', ') 
                        : 'Not available'; 
                    const gamePlatformsList = game.platforms && game.platforms.length > 0
                        ? game.platforms.map(platform => platform.platform.name).join(', ') 
                        : 'Not available'; 

                    return `🎮 ${game.name} - Rating: ${(game.rating).toFixed(2)}/5 | Genres: ${gameGenresList} | Platforms: ${gamePlatformsList}`;
                });

                responseText = `Here are the trending games:\n${gamesWithGenres.join('\n')}`;
            }
            gamePage++;
        } catch (error) {
            console.error("Error fetching games:", error.response ? error.response.data : error.message);
            responseText = 'Sorry, I could not fetch the latest games at this time. Please try again later.';
        }
    } else if (normalizedQuery.includes('details about game')) {
        const gameName = normalizedQuery.replace('details about game', '').trim();
        if (gameName) {
            try {
                const gameSearchUrl = `https://api.rawg.io/api/games?key=${process.env.RAWG_API_KEY}&search=${encodeURIComponent(gameName)}`;
                const gameSearchData = await axios.get(gameSearchUrl);

                if (gameSearchData.data.results.length > 0) {
                    const game = gameSearchData.data.results[0];
                    const gameDetailsUrl = `https://api.rawg.io/api/games/${game.id}?key=${process.env.RAWG_API_KEY}`;
                    const gameDetailsData = await axios.get(gameDetailsUrl);

                    const gameDescription = gameDetailsData.data.description_raw || 'No description available.';
                    const gameReleaseDate = gameDetailsData.data.released || 'Release date not available.';
                    const gameGenresList = gameDetailsData.data.genres.map(genre => genre.name).join(', ') || 'Not available';
                    const gamePlatformsList = gameDetailsData.data.platforms.map(platform => platform.platform.name).join(', ') || 'Not available';
                    const gameRating = gameDetailsData.data.rating ? `${gameDetailsData.data.rating}/5` : 'Not rated';

                    responseText = `🎮 Game: ${game.name}
⭐ Rating: ${gameRating}
🗓️ Release Date: ${gameReleaseDate}
🎮 Platforms: ${gamePlatformsList}
🕹️ Genres: ${gameGenresList}
📜 Description: ${gameDescription}
                    `;
                } else {
                    responseText = `Sorry, I couldn't find any details about "${gameName}". Please try again.`;
                }
            } catch (error) {
                console.error("Error fetching game details:", error.response ? error.response.data : error.message);
                responseText = 'Sorry, I could not fetch game details at this time. Please try again later.';
            }
        } else {
            responseText = 'Please provide the name of the game you want details about.';
        }
    } else if (normalizedQuery.includes('shows') || normalizedQuery.includes('more shows')) {
        try {
            let genreId = null;
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
    }

    return responseText;
};

module.exports = { generateResponse };
