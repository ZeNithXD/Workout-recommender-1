import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="logo"
          sx={{ mr: 2 }}
          onClick={() => navigate('/')}
        >
          <FitnessCenterIcon />
        </IconButton>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          AI Workout Recommender
        </Typography>
        <Box>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
          >
            Profile
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/exercises"
          >
            Exercises
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/recommendations"
          >
            Recommendations
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 