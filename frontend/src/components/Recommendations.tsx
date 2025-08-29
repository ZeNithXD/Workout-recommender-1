import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
} from '@mui/material';
import { generateWeeklyPlan, exerciseLibrary } from '../data/recommendations';
import type { Exercise, Meal } from '../data/recommendations';

//Update type definitions to match actual data structure
interface ExerciseLevel {
  monday: Exercise[];
  tuesday: Exercise[];
  wednesday: Exercise[];
  thursday: Exercise[];
  friday: Exercise[];
  saturday: Exercise[];
  sunday: Exercise[];
}

interface ExerciseLibrary {
  weightLoss: {
    beginner: ExerciseLevel;
    intermediate: ExerciseLevel;
  };
  muscleGain: {
    beginner: ExerciseLevel;
    intermediate: ExerciseLevel;
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Recommendations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(location.state?.profile || null);
  const [tabValue, setTabValue] = React.useState(0);

  useEffect(() => {
    if (!profile) {
      // Try to load from localStorage
      const stored = localStorage.getItem('profile');
      if (stored) {
        setProfile(JSON.parse(stored));
      }
    }
  }, [profile]);

  if (!profile) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div style={{ textAlign: 'center', background: '#fff', padding: 32, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h2>Profile Information Required</h2>
          <p>Please complete your profile to get personalized recommendations.</p>
          <button onClick={() => navigate('/profile')} style={{ marginTop: 16, padding: '10px 24px', fontSize: 16, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Go to Profile</button>
        </div>
      </div>
    );
  }

  // Convert goal to match exerciseLibrary keys
  const getGoalKey = (goal: string): string => {
    const goalMap: { [key: string]: string } = {
      'Weight Loss': 'weightLoss',
      'Muscle Gain': 'muscleGain',
      'Endurance': 'weightLoss', // Using weightLoss exercises for endurance
      'Flexibility': 'weightLoss', // Using weightLoss exercises for flexibility
      'General Fitness': 'weightLoss' // Using weightLoss exercises for general fitness
    };
    return goalMap[goal] || 'weightLoss';
  };

  const weeklyPlan = generateWeeklyPlan(
    getGoalKey(profile.goals[0]),
    profile.experience.toLowerCase(),
    Number(profile.weight),
    Number(profile.height)
  );

  // Calculate daily calorie and macro needs
  const weight = Number(profile.weight);
  const height = Number(profile.height);
  const age = Number(profile.age);
  const gender = profile.gender;
  const goalKey = getGoalKey(profile.goals[0]);

  // BMR calculation (Mifflin-St Jeor)
  let bmr = 10 * weight + 6.25 * height - 5 * age;
  bmr += gender === 'Male' ? 5 : -161;
  const tdee = bmr * 1.55; // Moderate activity
  const calories = goalKey === 'weightLoss' ? Math.round(tdee - 500) : Math.round(tdee + 500);

  // Macros
  const proteinPerKg = goalKey === 'muscleGain' ? 2 : 1.6;
  const fatPerKg = 1;
  const protein = Math.round(weight * proteinPerKg);
  const fats = Math.round(weight * fatPerKg);
  const proteinCals = protein * 4;
  const fatCals = fats * 9;
  const carbs = Math.round((calories - proteinCals - fatCals) / 4);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Your Personalized Weekly Plan
        </Typography>
        {/* Macro Summary Card */}
        <Box sx={{ mb: 4, p: 2, borderRadius: 2, background: 'rgba(25, 118, 210, 0.07)' }}>
          <Typography variant="h6" gutterBottom>Daily Nutrition Targets</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}><strong>Calories:</strong> {calories} kcal</Grid>
            <Grid item xs={6} md={3}><strong>Protein:</strong> {protein} g</Grid>
            <Grid item xs={6} md={3}><strong>Carbs:</strong> {carbs} g</Grid>
            <Grid item xs={6} md={3}><strong>Fats:</strong> {fats} g</Grid>
          </Grid>
        </Box>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Exercise Plan" />
            <Tab label="Nutrition Plan" />
            <Tab label="Exercise Library" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {days.map((day) => (
              <Grid item xs={12} md={6} key={day}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </Typography>
                    <List>
                      {weeklyPlan[day as keyof typeof weeklyPlan].exercises.map((exercise: Exercise, index: number) => (
                        <React.Fragment key={index}>
                          <ListItem>
                            <ListItemText
                              primary={exercise.name}
                              secondary={
                                <>
                                  <Typography component="span" variant="body2">
                                    Sets: {exercise.sets} | Reps: {exercise.reps}
                                  </Typography>
                                  <br />
                                  <Typography component="span" variant="body2">
                                    Rest: {exercise.rest}
                                  </Typography>
                                  <br />
                                  <Typography component="span" variant="body2">
                                    {exercise.description}
                                  </Typography>
                                </>
                              }
                            />
                          </ListItem>
                          {index < weeklyPlan[day as keyof typeof weeklyPlan].exercises.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            {days.map((day) => (
              <Grid item xs={12} md={6} key={day}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </Typography>
                    <List>
                      {Object.entries(weeklyPlan[day as keyof typeof weeklyPlan].meals).map(([mealType, meal]) => {
                        const mealData = meal as Meal;
                        return (
                          <React.Fragment key={mealType}>
                            <ListItem>
                              <ListItemText
                                primary={`${mealType.charAt(0).toUpperCase() + mealType.slice(1)}: ${mealData.name}`}
                                secondary={
                                  <>
                                    <Typography component="span" variant="body2">
                                      Calories: {mealData.calories} | Protein: {mealData.protein}g | Carbs: {mealData.carbs}g | Fats: {mealData.fats}g
                                    </Typography>
                                    <br />
                                    <Typography component="span" variant="body2">
                                      Ingredients: {mealData.ingredients.join(', ')}
                                    </Typography>
                                    <br />
                                    <Typography component="span" variant="body2">
                                      Instructions: {mealData.instructions}
                                    </Typography>
                                  </>
                                }
                              />
                            </ListItem>
                            <Divider />
                          </React.Fragment>
                        );
                      })}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
              Exercise Library
            </Typography>
            <Grid container spacing={3}>
              {Object.entries(exerciseLibrary as unknown as ExerciseLibrary).map(([goal, levels]) => (
                <Grid item xs={12} key={goal}>
                  <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ 
                      textTransform: 'capitalize',
                      color: 'primary.main',
                      borderBottom: '2px solid',
                      borderColor: 'primary.light',
                      pb: 1,
                      mb: 2
                    }}>
                      {goal.replace(/([A-Z])/g, ' $1').trim()}
                    </Typography>
                    {Object.entries(levels).map(([level, days]) => (
                      <Box key={level} sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" sx={{ 
                          fontWeight: 'bold',
                          color: 'text.secondary',
                          mb: 2,
                          pl: 1
                        }}>
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </Typography>
                        <Grid container spacing={2}>
                          {Object.entries(days as ExerciseLevel).map(([day, exercises]) => (
                            <Grid item xs={12} md={6} lg={4} key={day}>
                              <Paper 
                                elevation={1} 
                                sx={{ 
                                  p: 2,
                                  height: '100%',
                                  backgroundColor: 'background.default',
                                  '&:hover': {
                                    backgroundColor: 'action.hover',
                                    transition: 'background-color 0.2s'
                                  }
                                }}
                              >
                                <Typography 
                                  variant="subtitle2" 
                                  sx={{ 
                                    fontWeight: 'bold',
                                    color: 'primary.main',
                                    mb: 1,
                                    textTransform: 'capitalize'
                                  }}
                                >
                                  {day}
                                </Typography>
                                <List dense>
                                  {exercises.map((exercise: Exercise, index: number) => (
                                    <ListItem 
                                      key={index}
                                      sx={{
                                        py: 1,
                                        borderBottom: index < exercises.length - 1 ? '1px solid' : 'none',
                                        borderColor: 'divider'
                                      }}
                                    >
                                      <ListItemText
                                        primary={
                                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                            {exercise.name}
                                          </Typography>
                                        }
                                        secondary={
                                          <Box sx={{ mt: 0.5 }}>
                                            <Typography variant="caption" color="text.secondary" display="block">
                                              Sets: {exercise.sets} | Reps: {exercise.reps}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" display="block">
                                              Rest: {exercise.rest}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                                              {exercise.description}
                                            </Typography>
                                          </Box>
                                        }
                                      />
                                    </ListItem>
                                  ))}
                                </List>
                              </Paper>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    ))}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default Recommendations; 
