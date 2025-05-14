import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import UserProfile from './components/UserProfile';
import ExerciseList from './components/ExerciseList';
import ExerciseDetail from './components/ExerciseDetail';
import Recommendations from './components/Recommendations';

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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<UserProfile />} />
            <Route path="/exercises" element={<ExerciseList />} />
            <Route path="/exercises/:exerciseName" element={<ExerciseDetail />} />
            <Route path="/recommendations" element={<Recommendations />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
