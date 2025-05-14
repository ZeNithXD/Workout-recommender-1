import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import OutlinedInput from '@mui/material/OutlinedInput';
import { SelectChangeEvent } from '@mui/material/Select';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { useAuth } from '../context/AuthContext';

const goals = [
  'Weight Loss',
  'Muscle Gain',
  'Endurance',
  'Flexibility',
  'General Fitness',
];

const experienceLevels = ['Beginner', 'Intermediate', 'Advanced'];

const UserProfile = () => {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    age: '',
    gender: '',
    goals: [] as string[],
    experience: '',
    medical_conditions: '',
  });
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  useEffect(() => {
    // Load existing profile data if available
    const loadProfile = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setFormData({
            ...data,
            weight: data.weight?.toString() || '',
            height: data.height?.toString() || '',
            age: data.age?.toString() || '',
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };
    if (token) loadProfile();
  }, [token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleGoalsChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setFormData((prev) => ({
      ...prev,
      goals: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.weight ||
      !formData.height ||
      !formData.age ||
      !formData.gender ||
      !formData.goals.length ||
      !formData.experience
    ) {
      setNotification({
        open: true,
        message: 'Please fill in all required fields.',
        severity: 'error'
      });
      return;
    }
    try {
      const payload = {
        ...formData,
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        age: parseInt(formData.age),
      };
      console.log('Profile payload:', payload);
      const profileResponse = await fetch('http://localhost:8000/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (!profileResponse.ok) {
        let errorMsg = 'Failed to save profile';
        try {
          const errorData = await profileResponse.json();
          errorMsg = errorData.detail || errorMsg;
        } catch {}
        setNotification({
          open: true,
          message: errorMsg,
          severity: 'error'
        });
        return;
      }

      // Then get recommendations
      const recommendationsResponse = await fetch('http://localhost:8000/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (recommendationsResponse.ok) {
        setNotification({
          open: true,
          message: 'Profile saved successfully!',
          severity: 'success'
        });
        setTimeout(() => {
          navigate('/recommendations');
        }, 2000);
      } else {
        let errorMsg = 'Failed to get recommendations';
        try {
          const errorData = await recommendationsResponse.json();
          errorMsg = errorData.detail || errorMsg;
        } catch {}
        setNotification({
          open: true,
          message: errorMsg,
          severity: 'error'
        });
      }
    } catch (error: any) {
      console.error('Error:', error);
      setNotification({
        open: true,
        message: error.message || 'Failed to save profile. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          User Profile
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Weight (kg)"
              name="weight"
              type="number"
              value={formData.weight}
              onChange={handleInputChange}
              required
              inputProps={{ min: 30, max: 300, step: 0.1 }}
            />
            <TextField
              label="Height (cm)"
              name="height"
              type="number"
              value={formData.height}
              onChange={handleInputChange}
              required
              inputProps={{ min: 100, max: 250, step: 0.1 }}
            />
            <TextField
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleInputChange}
              required
              inputProps={{ min: 16, max: 100 }}
            />
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                value={formData.gender}
                label="Gender"
                onChange={handleSelectChange}
                required
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Fitness Goals</InputLabel>
              <Select
                multiple
                value={formData.goals}
                onChange={handleGoalsChange}
                input={<OutlinedInput label="Fitness Goals" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {goals.map((goal) => (
                  <MenuItem key={goal} value={goal}>
                    {goal}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Experience Level</InputLabel>
              <Select
                name="experience"
                value={formData.experience}
                label="Experience Level"
                onChange={handleSelectChange}
                required
              >
                {experienceLevels.map((level) => (
                  <MenuItem key={level} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Medical Conditions"
              name="medical_conditions"
              multiline
              rows={4}
              value={formData.medical_conditions}
              onChange={handleInputChange}
              placeholder="Please list any medical conditions or injuries (if none, leave blank)"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 2 }}
            >
              Save Profile
            </Button>
          </Box>
        </form>
      </Paper>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UserProfile; 