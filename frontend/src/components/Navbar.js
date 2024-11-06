import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
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
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
