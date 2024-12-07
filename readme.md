# Recommendo- Movie, Games, and Shows Recommendation Chatbot

Welcome to Recommendo! This chatbot is designed to provide personalized movie and game recommendations, as well as let users manage their wishlist for movies and games they want to watch or play.

## Features

### 1. **Personalized Recommendations**
   - **Movies and Games:** Get personalized recommendations based on genres you like. The bot uses data from the TMDB (The Movie Database) API and the RAWG API to suggest movies and games based on user preferences.
   - **Genre-Based Recommendations:** Users can ask for movie and game suggestions in specific genres, allowing for more tailored recommendations.
   
### 2. **Wishlist**
   - **Add to Wishlist:** Users can add movies or games to their wishlist directly through the chatbot.
   - **View Wishlist:** See a list of all the movies and games added to the wishlist.
   - **Remove from Wishlist:** Users can remove items from their wishlist anytime.


### 3. **User Authentication**
   - **Signup & Login:** Users can create an account and log in to access their personalized recommendations and wishlist.
   - **Logout:** Secure logout functionality ensures the user is properly logged out after their session ends.

### 4. **Star Rating System**
   - **Rate Responses:** Users can rate chatbot responses on a scale from 1 to 5 stars, helping the chatbot improve over time.
   - **Feedback System:** The ratings are stored in MongoDB for analysis and enhancement of chatbot responses.

### 5. **Interactive Chatbot Interface**
   - **Friendly and Cheerful Tone:** The chatbot communicates in a warm and friendly manner, with personalized responses, including using the user's name when possible.

### 6. **Responsive Design**
   - **Mobile and Desktop Friendly:** The chatbot is fully responsive, ensuring a smooth experience on both desktop and mobile devices.

## Technologies Used

- **React**: Frontend framework for building the user interface.
- **Node.js**: Backend environment to handle requests and serve API data.
- **MongoDB**: Database for storing user information, wishlist items, and user feedback.
- **Axios**: HTTP client for making requests to the APIs.
- **TMDB API**: For fetching movie recommendations and genre information.
- **RAWG API**: For fetching game recommendations and genre information.


