import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import ExerciseLibrary from './components/ExerciseLibrary';
import Recommendations from './components/Recommendations';
import ChatBot from './components/ChatBot';
import Weather from './components/Weather';
import ExerciseDetail from './components/ExerciseDetail';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/exercises" element={<ExerciseLibrary />} />
          <Route path="/exercises/:exerciseName" element={<ExerciseDetail />} />
          <Route path="/recommendations" element={<Recommendations />} />
        </Routes>
        <ChatBot />
        <Weather />
      </Router>
    </AuthProvider>
  );
}

export default App; 