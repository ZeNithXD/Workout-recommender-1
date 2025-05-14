import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';

interface ExerciseCategory {
  [key: string]: string[];
}

const ExerciseList = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ExerciseCategory>({});
  const [availableExercises, setAvailableExercises] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, exercisesResponse] = await Promise.all([
          fetch('http://localhost:8000/api/exercises/categories'),
          fetch('http://localhost:8000/api/exercises/available'),
        ]);

        if (categoriesResponse.ok && exercisesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          const exercisesData = await exercisesResponse.json();
          setCategories(categoriesData);
          setAvailableExercises(exercisesData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleCategoryChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedCategory(newValue);
  };

  const categoryNames = Object.keys(categories);
  const currentCategory = categoryNames[selectedCategory];
  const exercises = categories[currentCategory] || [];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Exercise Library
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={selectedCategory}
          onChange={handleCategoryChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {categoryNames.map((category, index) => (
            <Tab key={category} label={category} />
          ))}
        </Tabs>
      </Box>

      <Grid container spacing={3}>
        {exercises.map((exercise) => {
          const isAvailable = availableExercises.includes(exercise);
          return (
            <Grid item xs={12} sm={6} md={4} key={exercise}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="h2">
                    {exercise.charAt(0).toUpperCase() + exercise.slice(1).replace('_', ' ')}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {currentCategory}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => navigate(`/exercises/${exercise}`)}
                  >
                    VIEW DETAILS
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default ExerciseList; 