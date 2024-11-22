import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import Wishlist from './WishList.js';
import './Navbar.css';

const Navbar = () => {
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const handleWishlistOpen = () => {
    setIsWishlistOpen(true);
  };

  const handleWishlistClose = () => {
    setIsWishlistOpen(false);
  };

  return (
    <AppBar position="static" className="navbar">
      <Toolbar>
        <div className="navbar-title-container">
          <Typography variant="h6" className="navbar-title">
            Recommendo
          </Typography>
        </div>

        <Box>
          <Button
            variant="contained"
            className="wishlist-button"
            onClick={handleWishlistOpen}
          >
            Wishlist
          </Button>
        </Box>
      </Toolbar>

      {/* Wishlist Popup */}
      {isWishlistOpen && <Wishlist onClose={handleWishlistClose} />}
    </AppBar>
  );
};

export default Navbar;
