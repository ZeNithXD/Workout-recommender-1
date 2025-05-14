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
import Alert from '@mui/material/Alert';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';

interface ExerciseCategory {
  [key: string]: string[];
}

const ExerciseList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<ExerciseCategory>({});
  const [availableExercises, setAvailableExercises] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get category from URL or default to first category
  const categoryNames = Object.keys(categories);
  const categoryParam = searchParams.get('category');
  const initialCategoryIndex = categoryParam 
    ? categoryNames.indexOf(categoryParam)
    : 0;
  const [selectedCategory, setSelectedCategory] = useState(initialCategoryIndex);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [categoriesResponse, exercisesResponse] = await Promise.all([
          fetch('http://localhost:8000/api/exercises/categories'),
          fetch('http://localhost:8000/api/exercises/available'),
        ]);

        if (!categoriesResponse.ok || !exercisesResponse.ok) {
          throw new Error('Failed to fetch exercise data');
        }

        const categoriesData = await categoriesResponse.json();
        const exercisesData = await exercisesResponse.json();
        setCategories(categoriesData);
        setAvailableExercises(exercisesData);
        
        // Update selected category based on URL after categories are loaded
        const categoryNames = Object.keys(categoriesData);
        const categoryParam = searchParams.get('category');
        const categoryIndex = categoryParam 
          ? categoryNames.indexOf(categoryParam)
          : 0;
        setSelectedCategory(categoryIndex >= 0 ? categoryIndex : 0);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load exercises. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  const handleCategoryChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedCategory(newValue);
    const categoryNames = Object.keys(categories);
    setSearchParams({ category: categoryNames[newValue] });
  };

  const currentCategory = categoryNames[selectedCategory];
  const exercises = categories[currentCategory] || [];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!categories || Object.keys(categories).length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="info">
          No exercise categories available.
        </Alert>
      </Container>
    );
  }

  if (exercises.length === 0) {
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
        <Alert severity="info">
          No exercises found in this category.
        </Alert>
      </Container>
    );
  }

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
                    {exercise.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {currentCategory}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => navigate(`/exercises/${exercise}?category=${currentCategory}`)}
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