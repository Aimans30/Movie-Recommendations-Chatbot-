import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import WishList from './WishList'; // Import the wishlist button
import './Navbar.css';

const Navbar = () => {
  return (
    <AppBar position="static" className="navbar">
      <Toolbar>
        <div className="navbar-title-container">
          <Typography variant="h6" className="navbar-title">
            Recommendo
          </Typography>
        </div>
        {/* Render the Wishlist button */}
        <WishList />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
