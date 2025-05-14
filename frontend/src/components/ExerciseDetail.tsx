import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import TimerIcon from '@mui/icons-material/Timer';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import InfoIcon from '@mui/icons-material/Info';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Button from '@mui/material/Button';

interface ExerciseData {
  timestamp: string;
  accelerometer: {
    x: number;
    y: number;
    z: number;
  };
  gyroscope: {
    x: number;
    y: number;
    z: number;
  };
}

interface ExerciseInfo {
  description: string;
  instructions: string[];
  guidelines: {
    sets: string;
    reps: string;
    rest: string;
    tips: string[];
  };
}

const exerciseInfoMap: Record<string, ExerciseInfo> = {
  bench: {
    description: "The bench press is a classic upper body exercise that targets the chest, shoulders, and triceps.",
    instructions: [
      "Lie flat on a bench with your feet on the ground.",
      "Grip the barbell slightly wider than shoulder-width.",
      "Lower the bar slowly to your chest.",
      "Press the bar back up until your arms are fully extended.",
      "Repeat for the desired number of reps."
    ],
    guidelines: {
      sets: "3-5 sets",
      reps: "5-12 reps",
      rest: "90-120 seconds between sets",
      tips: [
        "Keep your back flat on the bench.",
        "Do not bounce the bar off your chest.",
        "Use a spotter for safety.",
        "Focus on controlled movement."
      ]
    }
  },
  ohp: {
    description: "The overhead press (OHP) is a compound movement that targets the shoulders, triceps, and upper chest.",
    instructions: [
      "Stand with feet shoulder-width apart, barbell at shoulder level.",
      "Grip the bar just outside your shoulders.",
      "Press the bar overhead until your arms are fully extended.",
      "Lower the bar back to shoulder level with control.",
      "Repeat for the desired number of reps."
    ],
    guidelines: {
      sets: "3-4 sets",
      reps: "6-10 reps",
      rest: "90 seconds between sets",
      tips: [
        "Keep your core tight and glutes squeezed.",
        "Do not arch your lower back.",
        "Lock out your elbows at the top.",
        "Use a full range of motion."
      ]
    }
  },
  pushup: {
    description: "A classic bodyweight exercise that targets the chest, shoulders, and triceps while also engaging the core.",
    instructions: [
      "Start in a plank position with hands slightly wider than shoulder-width.",
      "Keep your body in a straight line from head to heels.",
      "Lower your body until your chest nearly touches the floor.",
      "Push back up to the starting position.",
      "Repeat while maintaining proper form."
    ],
    guidelines: {
      sets: "3-4 sets",
      reps: "8-20 reps or until failure",
      rest: "60-90 seconds between sets",
      tips: [
        "Keep your core tight throughout the movement.",
        "Don't let your hips sag or rise.",
        "Breathe steadily - inhale on the way down, exhale on the way up.",
        "If too difficult, start with knee push-ups.",
        "For progression, try diamond push-ups or decline push-ups."
      ]
    }
  },
  dip: {
    description: "Dips are a bodyweight exercise that primarily targets the triceps, chest, and shoulders.",
    instructions: [
      "Grasp parallel bars and lift your body.",
      "Lower yourself by bending your elbows until your upper arms are parallel to the ground.",
      "Push yourself back up to the starting position.",
      "Repeat for the desired number of reps."
    ],
    guidelines: {
      sets: "3-4 sets",
      reps: "8-15 reps",
      rest: "60-90 seconds between sets",
      tips: [
        "Keep your elbows close to your body.",
        "Lean forward slightly to target the chest more.",
        "Avoid locking out your elbows at the top.",
        "If too difficult, use assistance bands."
      ]
    }
  },
  incline_bench: {
    description: "The incline bench press targets the upper chest and shoulders.",
    instructions: [
      "Set the bench to a 30-45 degree incline.",
      "Lie back and grip the barbell slightly wider than shoulder-width.",
      "Lower the bar to your upper chest.",
      "Press the bar back up until your arms are extended.",
      "Repeat for the desired number of reps."
    ],
    guidelines: {
      sets: "3-4 sets",
      reps: "8-12 reps",
      rest: "90 seconds between sets",
      tips: [
        "Keep your feet flat on the ground.",
        "Do not let the bar drift too far forward.",
        "Control the bar on the way down.",
        "Use a spotter for safety."
      ]
    }
  },
  decline_bench: {
    description: "The decline bench press emphasizes the lower chest muscles.",
    instructions: [
      "Set the bench to a decline position.",
      "Secure your feet and lie back.",
      "Grip the barbell slightly wider than shoulder-width.",
      "Lower the bar to your lower chest.",
      "Press the bar back up until your arms are extended."
    ],
    guidelines: {
      sets: "3-4 sets",
      reps: "8-12 reps",
      rest: "90 seconds between sets",
      tips: [
        "Keep your back pressed to the bench.",
        "Lower the bar with control.",
        "Do not lock out your elbows.",
        "Use a spotter for safety."
      ]
    }
  },
  shoulder_press: {
    description: "The shoulder press targets the deltoids and triceps, building upper body strength.",
    instructions: [
      "Sit or stand with a dumbbell in each hand at shoulder height.",
      "Press the weights overhead until your arms are fully extended.",
      "Lower the weights back to shoulder height with control.",
      "Repeat for the desired number of reps."
    ],
    guidelines: {
      sets: "3-4 sets",
      reps: "8-12 reps",
      rest: "60-90 seconds between sets",
      tips: [
        "Keep your back straight and core engaged.",
        "Do not arch your lower back.",
        "Use a full range of motion.",
        "Exhale as you press up, inhale as you lower."
      ]
    }
  },
  lateral_raise: {
    description: "Lateral raises isolate the lateral deltoids, helping to build shoulder width.",
    instructions: [
      "Stand with feet shoulder-width apart, holding dumbbells at your sides.",
      "Raise the weights out to the sides until they reach shoulder height.",
      "Pause, then lower them back down with control.",
      "Repeat for the desired number of reps."
    ],
    guidelines: {
      sets: "3 sets",
      reps: "10-15 reps",
      rest: "60 seconds between sets",
      tips: [
        "Keep a slight bend in your elbows.",
        "Do not swing the weights.",
        "Use light to moderate weight for good form.",
        "Exhale as you lift, inhale as you lower."
      ]
    }
  },
  front_raise: {
    description: "Front raises isolate the anterior deltoids (front shoulder muscles).",
    instructions: [
      "Stand with feet shoulder-width apart, holding dumbbells at your sides.",
      "Raise the weights in front of you to shoulder height.",
      "Pause, then lower them back down with control.",
      "Repeat for the desired number of reps."
    ],
    guidelines: {
      sets: "3 sets",
      reps: "10-15 reps",
      rest: "60 seconds between sets",
      tips: [
        "Keep your arms straight but not locked.",
        "Do not swing the weights.",
        "Use light to moderate weight for good form.",
        "Exhale as you lift, inhale as you lower."
      ]
    }
  },
  tricep_extension: {
    description: "Tricep extensions target the triceps, the muscles on the back of your upper arm.",
    instructions: [
      "Hold a dumbbell or barbell overhead with both hands.",
      "Keep your elbows close to your head.",
      "Lower the weight behind your head by bending your elbows.",
      "Extend your arms to return to the starting position.",
      "Repeat for the desired number of reps."
    ],
    guidelines: {
      sets: "3-4 sets",
      reps: "10-15 reps",
      rest: "60 seconds between sets",
      tips: [
        "Keep your upper arms stationary.",
        "Do not flare your elbows.",
        "Use a full range of motion.",
        "Start with a light weight to master form."
      ]
    }
  },
  tricep_pushdown: {
    description: "The tricep pushdown is an isolation exercise for the triceps, usually performed on a cable machine.",
    instructions: [
      "Stand facing a cable machine with a straight bar or rope attached.",
      "Grip the bar with palms facing down.",
      "Push the bar down until your arms are fully extended.",
      "Slowly return to the starting position.",
      "Repeat for the desired number of reps."
    ],
    guidelines: {
      sets: "3-4 sets",
      reps: "10-15 reps",
      rest: "60 seconds between sets",
      tips: [
        "Keep your elbows close to your sides.",
        "Do not use your shoulders or back.",
        "Control the weight throughout the movement.",
        "Exhale as you push down, inhale as you return."
      ]
    }
  },
  pull_up: {
    description: "Pull-ups are a bodyweight exercise that targets the back, biceps, and shoulders.",
    instructions: [
      "Hang from a pull-up bar with an overhand grip.",
      "Pull your chin above the bar by squeezing your back and arms.",
      "Lower yourself with control.",
      "Repeat for the desired number of reps."
    ],
    guidelines: {
      sets: "3-4 sets",
      reps: "As many reps as possible (AMRAP)",
      rest: "90 seconds between sets",
      tips: [
        "Use full range of motion.",
        "Avoid swinging or kipping.",
        "If too hard, use resistance bands for assistance.",
        "If too easy, add weight."
      ]
    }
  },
  chin_up: {
    description: "Chin-ups are similar to pull-ups but use an underhand grip, emphasizing the biceps.",
    instructions: [
      "Hang from a bar with an underhand grip, hands shoulder-width apart.",
      "Pull your chin above the bar by squeezing your back and arms.",
      "Lower yourself with control.",
      "Repeat for the desired number of reps."
    ],
    guidelines: {
      sets: "3-4 sets",
      reps: "AMRAP",
      rest: "90 seconds between sets",
      tips: [
        "Keep your body steady.",
        "Engage your biceps and back.",
        "Use a full range of motion.",
        "If too hard, use assistance bands."
      ]
    }
  },
  Row: {
    description: "Barbell rows are a compound exercise that targets the back, biceps, and forearms.",
    instructions: [
      "Stand with feet hip-width apart, barbell in front.",
      "Bend at the hips and knees, grip the bar just outside your knees.",
      "Pull the bar towards your lower ribcage.",
      "Lower the bar with control.",
      "Repeat for the desired number of reps."
    ],
    guidelines: {
      sets: "3-4 sets",
      reps: "8-12 reps",
      rest: "90 seconds between sets",
      tips: [
        "Keep your back flat.",
        "Do not jerk the weight.",
        "Squeeze your shoulder blades at the top.",
        "Use a controlled tempo."
      ]
    }
  },
  lat_pulldown: {
    description: "Lat pulldowns target the latissimus dorsi and upper back.",
    instructions: [
      "Sit at a lat pulldown machine and grip the bar wider than shoulder-width.",
      "Pull the bar down to your upper chest.",
      "Slowly return the bar to the starting position.",
      "Repeat for the desired number of reps."
    ],
    guidelines: {
      sets: "3-4 sets",
      reps: "10-15 reps",
      rest: "60-90 seconds between sets",
      tips: [
        "Do not use momentum.",
        "Pull with your back, not your arms.",
        "Keep your chest up.",
        "Control the bar on the way up and down."
      ]
    }
  },
  face_pull: {
    description: "Face pulls strengthen the rear deltoids and upper back, improving posture and shoulder health.",
    instructions: [
      "Attach a rope to a cable machine at upper chest height.",
      "Grip the rope with both hands, palms facing in.",
      "Pull the rope towards your face, elbows high.",
      "Squeeze your shoulder blades together.",
      "Return with control and repeat."
    ],
    guidelines: {
      sets: "3 sets",
      reps: "12-20 reps",
      rest: "60 seconds between sets",
      tips: [
        "Keep elbows high.",
        "Do not use heavy weight.",
        "Focus on squeezing your upper back.",
        "Control the movement."
      ]
    }
  },
  deadlift: {
    description: "The deadlift is a compound movement that works the entire posterior chain, including the back, glutes, and hamstrings.",
    instructions: [
      "Stand with feet hip-width apart, barbell over mid-foot.",
      "Grip the bar just outside your knees.",
      "Keep your back flat and chest up.",
      "Drive through your heels to lift the bar.",
      "Lock out at the top, then lower with control."
    ],
    guidelines: {
      sets: "3-4 sets",
      reps: "5-8 reps",
      rest: "2-3 minutes between sets",
      tips: [
        "Keep the bar close to your body.",
        "Engage your core throughout.",
        "Do not round your back.",
        "Start light to master form."
      ]
    }
  },
  romanian_deadlift: {
    description: "Romanian deadlifts target the hamstrings and glutes, improving posterior chain strength.",
    instructions: [
      "Stand with feet hip-width apart, holding a barbell.",
      "Keep knees slightly bent and back flat.",
      "Hinge at the hips to lower the bar down your legs.",
      "Stop when you feel a stretch in your hamstrings.",
      "Return to standing by driving your hips forward."
    ],
    guidelines: {
      sets: "3-4 sets",
      reps: "8-12 reps",
      rest: "90 seconds between sets",
      tips: [
        "Do not round your back.",
        "Keep the bar close to your legs.",
        "Move slowly and with control.",
        "Focus on the stretch in your hamstrings."
      ]
    }
  },
  leg_press: {
    description: "The leg press is a machine-based exercise that targets the quadriceps, glutes, and hamstrings.",
    instructions: [
      "Sit in the leg press machine with feet shoulder-width apart on the platform.",
      "Lower the platform by bending your knees.",
      "Press the platform back up by extending your legs.",
      "Repeat for the desired number of reps."
    ],
    guidelines: {
      sets: "3-4 sets",
      reps: "10-15 reps",
      rest: "90 seconds between sets",
      tips: [
        "Do not lock out your knees.",
        "Keep your lower back pressed into the seat.",
        "Use a full range of motion.",
        "Control the weight."
      ]
    }
  },
  calf_raise: {
    description: "Calf raises strengthen the calf muscles and improve ankle stability.",
    instructions: [
      "Stand with the balls of your feet on a raised surface.",
      "Push through your toes to lift your heels as high as possible.",
      "Pause at the top, then lower your heels below the platform.",
      "Repeat for the desired number of reps."
    ],
    guidelines: {
      sets: "3-4 sets",
      reps: "12-20 reps",
      rest: "45-60 seconds between sets",
      tips: [
        "Pause at the top for a stronger contraction.",
        "Use a full range of motion.",
        "Do not bounce.",
        "Hold onto something for balance if needed."
      ]
    }
  },
  plank: {
    description: "An isometric core exercise that strengthens the entire body while improving posture and stability.",
    instructions: [
      "Start in a push-up position.",
      "Bend elbows and rest on forearms.",
      "Keep body in a straight line.",
      "Engage core and hold position.",
      "Maintain steady breathing."
    ],
    guidelines: {
      sets: "3-4 sets",
      reps: "Hold for 30-60 seconds",
      rest: "30-60 seconds between sets",
      tips: [
        "Don't let hips sag or rise.",
        "Keep neck neutral.",
        "Breathe steadily throughout.",
        "For progression, try side planks or plank variations.",
        "Focus on quality over duration."
      ]
    }
  },
  sit_up: {
    description: "A classic abdominal exercise that targets the rectus abdominis and hip flexors.",
    instructions: [
      "Lie on back with knees bent.",
      "Place hands behind head or crossed on chest.",
      "Engage core and lift upper body.",
      "Lower back down with control.",
      "Repeat while maintaining form."
    ],
    guidelines: {
      sets: "3 sets",
      reps: "15-20 reps or until failure",
      rest: "45-60 seconds between sets",
      tips: [
        "Don't pull on neck.",
        "Keep lower back pressed to floor.",
        "Exhale on the way up.",
        "For progression, try weighted sit-ups.",
        "Focus on controlled movement."
      ]
    }
  },
  russian_twist: {
    description: "Russian twists target the obliques and help improve rotational core strength.",
    instructions: [
      "Sit on the floor with knees bent and feet lifted.",
      "Lean back slightly and hold a weight with both hands.",
      "Twist your torso to the right, then to the left.",
      "Repeat for the desired number of reps."
    ],
    guidelines: {
      sets: "3 sets",
      reps: "20-30 twists (10-15 per side)",
      rest: "45 seconds between sets",
      tips: [
        "Keep your core engaged.",
        "Move slowly and with control.",
        "Touch the weight to the floor each side.",
        "Keep your feet off the ground for more challenge."
      ]
    }
  },
  leg_raise: {
    description: "Leg raises target the lower abdominals and hip flexors.",
    instructions: [
      "Lie flat on your back with legs extended.",
      "Place hands under your glutes for support.",
      "Lift your legs up to a 90-degree angle.",
      "Lower them back down without touching the floor.",
      "Repeat for the desired number of reps."
    ],
    guidelines: {
      sets: "3 sets",
      reps: "10-15 reps",
      rest: "45 seconds between sets",
      tips: [
        "Keep your lower back pressed to the floor.",
        "Move slowly and with control.",
        "Do not swing your legs.",
        "Exhale as you lift, inhale as you lower."
      ]
    }
  },
  burpee: {
    description: "Burpees are a full-body exercise that combines a squat, push-up, and jump for cardiovascular and muscular endurance.",
    instructions: [
      "Start standing, then squat down and place your hands on the floor.",
      "Jump your feet back into a push-up position.",
      "Perform a push-up, then jump your feet back to your hands.",
      "Explode up into a jump, reaching your arms overhead.",
      "Repeat for the desired number of reps."
    ],
    guidelines: {
      sets: "3-5 sets",
      reps: "10-20 reps",
      rest: "60-90 seconds between sets",
      tips: [
        "Move quickly but maintain good form.",
        "Land softly on your feet.",
        "Keep your core engaged.",
        "Modify by removing the push-up or jump if needed."
      ]
    }
  },
  mountain_climber: {
    description: "Mountain climbers are a dynamic full-body exercise that targets the core, shoulders, and legs.",
    instructions: [
      "Start in a push-up position.",
      "Drive one knee towards your chest, then switch legs quickly.",
      "Continue alternating legs at a fast pace.",
      "Repeat for the desired number of reps or time."
    ],
    guidelines: {
      sets: "3-4 sets",
      reps: "30-60 seconds",
      rest: "45 seconds between sets",
      tips: [
        "Keep your hips low.",
        "Move quickly but with control.",
        "Do not let your shoulders sag.",
        "Breathe steadily."
      ]
    }
  },
  jumping_jack: {
    description: "Jumping jacks are a classic full-body warm-up and conditioning exercise.",
    instructions: [
      "Stand with feet together and arms at your sides.",
      "Jump your feet out while raising your arms overhead.",
      "Jump back to the starting position.",
      "Repeat for the desired number of reps or time."
    ],
    guidelines: {
      sets: "3-4 sets",
      reps: "30-60 seconds",
      rest: "30 seconds between sets",
      tips: [
        "Land softly on your feet.",
        "Keep your arms straight.",
        "Maintain a steady pace.",
        "Use as a warm-up or cardio finisher."
      ]
    }
  },  
 
  bicycle_crunch: {
    description: "Bicycle crunches engage the entire core, especially the obliques and rectus abdominis.",
    instructions: [
      "Lie flat on your back with hands behind your head.",
      "Lift your legs off the floor and bend your knees at a 90-degree angle.",
      "Bring your right elbow to your left knee while extending the right leg.",
      "Switch sides in a pedaling motion.",
      "Continue alternating sides for the desired reps."
    ],
    guidelines: {
      sets: "3 sets",
      reps: "20-30 reps (10-15 per side)",
      rest: "45 seconds between sets",
      tips: [
        "Do not pull on your neck.",
        "Engage your core with each rep.",
        "Move with control, not speed.",
        "Keep your lower back pressed to the ground."
      ]
    }
  },
  
  hanging_knee_raise: {
    description: "Hanging knee raises target the lower abs and help improve grip strength and hip flexor activation.",
    instructions: [
      "Hang from a pull-up bar with arms fully extended.",
      "Engage your core and raise your knees toward your chest.",
      "Pause at the top, then lower your legs back down with control.",
      "Repeat for the desired number of reps."
    ],
    guidelines: {
      sets: "3 sets",
      reps: "10-15 reps",
      rest: "60 seconds between sets",
      tips: [
        "Avoid swinging or using momentum.",
        "Keep the movement controlled.",
        "Engage your core throughout.",
        "Exhale as you lift your knees."
      ]
    }
  },
  v_up: {
    description: "V-ups are a core exercise that works both upper and lower abs simultaneously.",
    instructions: [
      "Lie flat on your back with arms extended overhead and legs straight.",
      "Lift your legs and upper body at the same time to form a V shape.",
      "Reach your hands toward your toes.",
      "Lower back down with control.",
      "Repeat for the desired number of reps."
    ],
    guidelines: {
      sets: "3 sets",
      reps: "12-20 reps",
      rest: "45-60 seconds between sets",
      tips: [
        "Keep your legs and arms straight during the movement.",
        "Engage your core throughout.",
        "Avoid jerking or fast motions.",
        "Exhale during the upward movement."
      ]
    }
  },
  side_plank: {
    description: "The side plank is an isometric core exercise that targets the obliques and improves stability.",
    instructions: [
      "Lie on your side with legs stacked and forearm on the ground.",
      "Lift your hips off the ground to form a straight line from head to feet.",
      "Hold the position, engaging your core.",
      "Repeat on the other side."
    ],
    guidelines: {
      sets: "3 sets per side",
      reps: "Hold for 30-60 seconds",
      rest: "30 seconds between sides",
      tips: [
        "Keep your hips lifted and body straight.",
        "Don’t let your shoulder collapse.",
        "Breathe steadily throughout.",
        "For progression, raise the top leg or arm."
      ]
    }
  },
  toe_touch: {
    description: "Toe touches are a simple but effective ab exercise that targets the upper abdominal muscles.",
    instructions: [
      "Lie on your back with legs straight and lifted toward the ceiling.",
      "Reach your hands toward your toes while lifting your shoulder blades off the ground.",
      "Lower back down with control.",
      "Repeat for the desired number of reps."
    ],
    guidelines: {
      sets: "3 sets",
      reps: "15-25 reps",
      rest: "30-45 seconds between sets",
      tips: [
        "Focus on using your abs, not your neck.",
        "Exhale as you reach up.",
        "Keep legs as straight as possible.",
        "Move in a slow, controlled manner."
      ]
    }
  },
  flutter_kick: {
    description: "Flutter kicks strengthen the lower abs and hip flexors while improving endurance and core stability.",
    instructions: [
      "Lie on your back with legs extended and hands under your glutes.",
      "Lift both legs a few inches off the ground.",
      "Alternate kicking your legs up and down in a fluttering motion.",
      "Keep your core tight throughout the movement."
    ],
    guidelines: {
      sets: "3 sets",
      reps: "20-40 kicks (10-20 per leg)",
      rest: "30-45 seconds between sets",
      tips: [
        "Keep lower back pressed to the floor.",
        "Don't hold your breath.",
        "Keep legs straight and movements small.",
        "Avoid arching your back."
      ]
    }
  }

};

function getExerciseInfo(exerciseName: string): ExerciseInfo {
  return (
    exerciseInfoMap[exerciseName] ||
    {
      description: "This is a great exercise for building strength and fitness.",
      instructions: [
        "Start in the recommended position for this exercise.",
        "Perform the movement with good form and control.",
        "Repeat for the desired number of repetitions.",
        "Focus on breathing and proper technique."
      ],
      guidelines: {
        sets: "3-4 sets",
        reps: "10-15 reps",
        rest: "60-90 seconds between sets",
        tips: [
          "Maintain good posture throughout.",
          "Use a full range of motion.",
          "Start with a light weight or easier variation if needed.",
          "Progress gradually as you get stronger."
        ]
      }
    }
  );
}

const ExerciseDetail = () => {
  const { exerciseName } = useParams<{ exerciseName: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [exerciseData, setExerciseData] = useState<ExerciseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExerciseData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/exercises/${exerciseName}`
        );
        if (response.ok) {
          const data = await response.json();
          setExerciseData(data);
        } else {
          setError('Failed to load exercise data');
        }
      } catch (error) {
        setError('Error loading exercise data');
      } finally {
        setLoading(false);
      }
    };

    fetchExerciseData();
  }, [exerciseName]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  const exerciseInfo = getExerciseInfo(exerciseName || '');

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          onClick={() => {
            const category = searchParams.get('category');
            navigate(category ? `/?category=${category}` : '/');
          }}
        >
          Back to Exercise List
        </Button>
      </Box>
      
      <Typography variant="h4" component="h1" gutterBottom>
        {exerciseName?.split('_').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')}
      </Typography>

      {/* Exercise Information Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Exercise Information
        </Typography>
        <Typography paragraph>
          {exerciseInfo.description}
        </Typography>
        
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
          Instructions:
        </Typography>
        <List>
          {exerciseInfo.instructions.map((instruction, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <DirectionsRunIcon />
              </ListItemIcon>
              <ListItemText primary={instruction} />
            </ListItem>
          ))}
        </List>

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
          Guidelines:
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <FitnessCenterIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Sets & Reps" 
              secondary={`${exerciseInfo.guidelines.sets}, ${exerciseInfo.guidelines.reps}`} 
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <TimerIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Rest Period" 
              secondary={exerciseInfo.guidelines.rest} 
            />
          </ListItem>
        </List>

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
          Tips:
        </Typography>
        <List>
          {exerciseInfo.guidelines.tips.map((tip, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <InfoIcon />
              </ListItemIcon>
              <ListItemText primary={tip} />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Sensor Data Section */}
      {error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : exerciseData.length > 0 ? (
        <>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Accelerometer Data
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart
                    data={exerciseData.map(data => ({
                      ...data.accelerometer,
                      elapsed: data.timestamp
                    }))}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="elapsed" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="x"
                      stroke="#8884d8"
                      name="X Axis"
                    />
                    <Line
                      type="monotone"
                      dataKey="y"
                      stroke="#82ca9d"
                      name="Y Axis"
                    />
                    <Line
                      type="monotone"
                      dataKey="z"
                      stroke="#ffc658"
                      name="Z Axis"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Gyroscope Data
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart
                    data={exerciseData.map(data => ({
                      ...data.gyroscope,
                      elapsed: data.timestamp
                    }))}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="elapsed" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="x"
                      stroke="#8884d8"
                      name="X Axis"
                    />
                    <Line
                      type="monotone"
                      dataKey="y"
                      stroke="#82ca9d"
                      name="Y Axis"
                    />
                    <Line
                      type="monotone"
                      dataKey="z"
                      stroke="#ffc658"
                      name="Z Axis"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </>
      ) : (
        <Alert severity="info" sx={{ mb: 3 }}>
          No sensor data available for this exercise. Focus on following the instructions and guidelines above.
        </Alert>
      )}
    </Container>
  );
};

export default ExerciseDetail; 