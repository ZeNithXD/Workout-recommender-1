import React, { useState } from 'react';
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

  const handleSubmit = (e: React.FormEvent) => {
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

    //Convert form data to numbers where needed
    const profileData = {
      ...formData,
      weight: Number(formData.weight),
      height: Number(formData.height),
      age: Number(formData.age)
    };

    // Save to localStorage
    localStorage.setItem('profile', JSON.stringify(profileData));

    // Navigate to recommendations with the profile data
    navigate('/recommendations', { 
      state: { profile: profileData },
      replace: true // This replaces the current history entry
    });
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
            />
            <TextField
              label="Height (cm)"
              name="height"
              type="number"
              value={formData.height}
              onChange={handleInputChange}
              required
            />
            <TextField
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleInputChange}
              required
            />
            <FormControl required>
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleSelectChange}
                input={<OutlinedInput label="Gender" />}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            <FormControl required>
              <InputLabel>Goals</InputLabel>
              <Select
                multiple
                name="goals"
                value={formData.goals}
                onChange={handleGoalsChange}
                input={<OutlinedInput label="Goals" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected as string[]).map((value) => (
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
            <FormControl required>
              <InputLabel>Experience Level</InputLabel>
              <Select
                name="experience"
                value={formData.experience}
                onChange={handleSelectChange}
                input={<OutlinedInput label="Experience Level" />}
              >
                {experienceLevels.map((level) => (
                  <MenuItem key={level} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Medical Conditions (optional)"
              name="medical_conditions"
              value={formData.medical_conditions}
              onChange={handleInputChange}
            />
            <Button type="submit" variant="contained" color="primary" size="large">
              Get Recommendations
            </Button>
          </Box>
        </form>
        <Snackbar
          open={notification.open}
          autoHideDuration={3000}
          onClose={handleCloseNotification}
        >
          <Alert severity={notification.severity} onClose={handleCloseNotification}>
            {notification.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default UserProfile; 
