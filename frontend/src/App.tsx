import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import UserProfile from './components/UserProfile';
import ExerciseList from './components/ExerciseList';
import ExerciseDetail from './components/ExerciseDetail';
import Recommendations from './components/Recommendations';
import Login from './components/Login';
import Signup from './components/Signup';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Box, Button, Typography, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function Home() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Card sx={{ minWidth: 400, p: 3 }}>
        <CardContent>
          <Typography variant="h3" align="center" gutterBottom color="primary">
            Workout Recommender
          </Typography>
          <Typography variant="h6" align="center" gutterBottom>
            Your AI-powered fitness companion
          </Typography>
          <Box display="flex" flexDirection="column" gap={2} mt={4}>
            <Button component={Link} to="/login" variant="contained" color="primary" size="large">
              Login
            </Button>
            <Button component={Link} to="/signup" variant="outlined" color="primary" size="large">
              Sign Up
            </Button>
            <Button
              component={Link}
              to="/exercises"
              variant="outlined"
              color="secondary"
              size="large"
            >
              Continue as Guest
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

function AppRoutes() {
  const { token } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile" element={token ? <UserProfile /> : <Navigate to="/login" />} />
      <Route path="/exercises" element={<ExerciseList />} />
      <Route path="/exercises/:exerciseName" element={<ExerciseDetail />} />
      <Route path="/recommendations" element={<Recommendations />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
