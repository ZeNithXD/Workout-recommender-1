import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Typography, Container, Stack, Paper, Fade } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PersonIcon from '@mui/icons-material/Person';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';

const Home = () => (
  <Box
    sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 8,
    }}
  >
    <Fade in timeout={1200}>
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            p: { xs: 3, sm: 6 },
            borderRadius: 6,
            textAlign: 'center',
            background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
          }}
        >
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
            <FitnessCenterIcon
              color="primary"
              sx={{ fontSize: 70, animation: 'bounce 1.5s infinite alternate' }}
            />
          </Box>
          <Typography variant="h2" fontWeight={800} color="primary" gutterBottom sx={{ letterSpacing: 1 }}>
            Welcome to Fitness App
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 4, fontWeight: 500 }}>
            Your personal assistant for workouts, nutrition, and more.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center" sx={{ mb: 4 }}>
            <Button
              component={Link}
              to="/exercises"
              size="large"
              variant="contained"
              color="primary"
              startIcon={<TipsAndUpdatesIcon sx={{ fontSize: 28, animation: 'spin 2s linear infinite' }} />}
              sx={{
                fontWeight: 600,
                px: 4,
                py: 1.5,
                fontSize: 16,
                minWidth: 180,
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                lineHeight: 1.2,
              }}
            >
              EXPLORE<br />EXERCISES
            </Button>
            <Button
              component={Link}
              to="/profile"
              size="large"
              variant="outlined"
              color="primary"
              startIcon={<PersonIcon sx={{ fontSize: 28 }} />}
              sx={{
                fontWeight: 600,
                px: 4,
                py: 1.5,
                fontSize: 16,
                minWidth: 180,
                background: 'rgba(255,255,255,0.5)',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                lineHeight: 1.2,
              }}
            >
              YOUR<br />PROFILE
            </Button>
            <Button
              component={Link}
              to="/recommendations"
              size="large"
              variant="contained"
              color="secondary"
              startIcon={<FitnessCenterIcon sx={{ fontSize: 28, animation: 'pulse 1.5s infinite alternate' }} />}
              sx={{
                fontWeight: 600,
                px: 4,
                py: 1.5,
                fontSize: 16,
                minWidth: 180,
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                lineHeight: 1.2,
              }}
            >
              GET<br />RECOMMENDATIONS
            </Button>
          </Stack>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
            Start your fitness journey today with personalized plans, expert tips, and real-time motivation!
          </Typography>
        </Paper>
      </Container>
    </Fade>
    <style>{`
      @keyframes bounce {
        0% { transform: translateY(0); }
        100% { transform: translateY(-12px); }
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes pulse {
        0% { transform: scale(1); }
        100% { transform: scale(1.15); }
      }
    `}</style>
  </Box>
);

export default Home; 