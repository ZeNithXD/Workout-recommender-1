export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  description: string;
  type: 'bodyweight' | 'gym' | 'boxing';
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  ingredients: string[];
  instructions: string;
  veg: boolean;
}

interface DailyMeals {
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
}

interface DailyPlan {
  exercises: Exercise[];
  meals: DailyMeals;
}

interface WeeklyPlan {
  monday: DailyPlan;
  tuesday: DailyPlan;
  wednesday: DailyPlan;
  thursday: DailyPlan;
  friday: DailyPlan;
  saturday: DailyPlan;
  sunday: DailyPlan;
}

export const exerciseLibrary = {
  weightLoss: {
    beginner: {
      monday: [
        {
          name: "Brisk Walking",
          sets: 1,
          reps: "30 minutes",
          rest: "None",
          description: "Walk at a pace where you can talk but not sing"
        },
        {
          name: "Bodyweight Squats",
          sets: 3,
          reps: "12-15",
          rest: "60 seconds",
          description: "Basic squat with proper form"
        },
        {
          name: "Push-ups (Modified)",
          sets: 3,
          reps: "8-10",
          rest: "60 seconds",
          description: "Knee push-ups or wall push-ups"
        }
      ],
      tuesday: [
        {
          name: "Jumping Jacks",
          sets: 3,
          reps: "30 seconds",
          rest: "30 seconds",
          description: "Full body cardio exercise"
        },
        {
          name: "Lunges",
          sets: 3,
          reps: "10 each leg",
          rest: "60 seconds",
          description: "Alternating forward lunges"
        },
        {
          name: "Plank",
          sets: 3,
          reps: "20 seconds",
          rest: "60 seconds",
          description: "Core strengthening exercise"
        }
      ],
      wednesday: [
        {
          name: "Stair Climbing",
          sets: 1,
          reps: "20 minutes",
          rest: "None",
          description: "Climb stairs at a moderate pace"
        },
        {
          name: "Glute Bridges",
          sets: 3,
          reps: "12-15",
          rest: "60 seconds",
          description: "Lie on back, lift hips"
        },
        {
          name: "Mountain Climbers",
          sets: 3,
          reps: "30 seconds",
          rest: "30 seconds",
          description: "High-intensity cardio exercise"
        }
      ],
      thursday: [
        {
          name: "Cycling",
          sets: 1,
          reps: "25 minutes",
          rest: "None",
          description: "Moderate pace cycling"
        },
        {
          name: "Wall Push-ups",
          sets: 3,
          reps: "12-15",
          rest: "60 seconds",
          description: "Push-ups against a wall"
        },
        {
          name: "Bird Dogs",
          sets: 3,
          reps: "10 each side",
          rest: "60 seconds",
          description: "Core and balance exercise"
        }
      ],
      friday: [
        {
          name: "Swimming",
          sets: 1,
          reps: "20 minutes",
          rest: "None",
          description: "Freestyle or breaststroke"
        },
        {
          name: "Step-ups",
          sets: 3,
          reps: "12 each leg",
          rest: "60 seconds",
          description: "Step up and down on a platform"
        },
        {
          name: "Superman",
          sets: 3,
          reps: "10",
          rest: "60 seconds",
          description: "Back strengthening exercise"
        }
      ],
      saturday: [
        {
          name: "Dancing",
          sets: 1,
          reps: "30 minutes",
          rest: "None",
          description: "Follow a dance workout video"
        },
        {
          name: "Squat Jumps",
          sets: 3,
          reps: "10",
          rest: "60 seconds",
          description: "Explosive squat with jump"
        },
        {
          name: "Russian Twists",
          sets: 3,
          reps: "20",
          rest: "60 seconds",
          description: "Seated core rotation"
        }
      ],
      sunday: [
        {
          name: "Yoga",
          sets: 1,
          reps: "30 minutes",
          rest: "None",
          description: "Gentle yoga flow"
        },
        {
          name: "Stretching",
          sets: 1,
          reps: "15 minutes",
          rest: "None",
          description: "Full body stretching"
        }
      ]
    },
    intermediate: {
      monday: [
        {
          name: "Running",
          sets: 1,
          reps: "30 minutes",
          rest: "None",
          description: "Jogging with intervals"
        },
        {
          name: "Push-ups",
          sets: 4,
          reps: "12-15",
          rest: "60 seconds",
          description: "Standard push-ups"
        },
        {
          name: "Pull-ups",
          sets: 3,
          reps: "8-10",
          rest: "90 seconds",
          description: "Full range of motion"
        }
      ],
      tuesday: [
        {
          name: "HIIT Circuit",
          sets: 4,
          reps: "30 seconds each",
          rest: "30 seconds",
          description: "Burpees, Mountain Climbers, Jump Squats"
        },
        {
          name: "Dips",
          sets: 3,
          reps: "12-15",
          rest: "90 seconds",
          description: "Triceps and chest focus"
        },
        {
          name: "Plank Variations",
          sets: 3,
          reps: "45 seconds each",
          rest: "60 seconds",
          description: "Side plank, forearm plank, high plank"
        }
      ],
      wednesday: [
        {
          name: "Cycling",
          sets: 1,
          reps: "45 minutes",
          rest: "None",
          description: "High-intensity intervals"
        },
        {
          name: "Lunges",
          sets: 4,
          reps: "12 each leg",
          rest: "60 seconds",
          description: "Walking lunges with weights"
        },
        {
          name: "Russian Twists",
          sets: 3,
          reps: "20 each side",
          rest: "60 seconds",
          description: "With weight"
        }
      ],
      thursday: [
        {
          name: "Swimming",
          sets: 1,
          reps: "40 minutes",
          rest: "None",
          description: "Mixed strokes"
        },
        {
          name: "Squats",
          sets: 4,
          reps: "15-20",
          rest: "90 seconds",
          description: "With weights"
        },
        {
          name: "Deadlifts",
          sets: 3,
          reps: "12",
          rest: "90 seconds",
          description: "Romanian deadlifts"
        }
      ],
      friday: [
        {
          name: "Boxing",
          sets: 1,
          reps: "30 minutes",
          rest: "None",
          description: "Shadow boxing and bag work"
        },
        {
          name: "Pull-ups",
          sets: 4,
          reps: "8-12",
          rest: "90 seconds",
          description: "Wide grip"
        },
        {
          name: "Dips",
          sets: 3,
          reps: "12-15",
          rest: "90 seconds",
          description: "Weighted dips"
        }
      ],
      saturday: [
        {
          name: "HIIT",
          sets: 5,
          reps: "45 seconds each",
          rest: "15 seconds",
          description: "Burpees, Jump Squats, Mountain Climbers"
        },
        {
          name: "Core Circuit",
          sets: 3,
          reps: "30 seconds each",
          rest: "30 seconds",
          description: "Plank, Side Plank, Russian Twists"
        }
      ],
      sunday: [
        {
          name: "Yoga",
          sets: 1,
          reps: "45 minutes",
          rest: "None",
          description: "Power yoga flow"
        },
        {
          name: "Mobility Work",
          sets: 1,
          reps: "20 minutes",
          rest: "None",
          description: "Dynamic stretching"
        }
      ]
    }
  },
  muscleGain: {
    beginner: {
      monday: [
        {
          name: "Push-ups",
          sets: 3,
          reps: "8-12",
          rest: "90 seconds",
          description: "Standard push-ups"
        },
        {
          name: "Bodyweight Squats",
          sets: 3,
          reps: "12-15",
          rest: "90 seconds",
          description: "Focus on form"
        },
        {
          name: "Plank",
          sets: 3,
          reps: "30 seconds",
          rest: "60 seconds",
          description: "Core strengthening"
        }
      ],
      tuesday: [
        {
          name: "Assisted Pull-ups",
          sets: 3,
          reps: "8-10",
          rest: "90 seconds",
          description: "Using resistance bands"
        },
        {
          name: "Lunges",
          sets: 3,
          reps: "10 each leg",
          rest: "60 seconds",
          description: "Bodyweight lunges"
        },
        {
          name: "Superman",
          sets: 3,
          reps: "12",
          rest: "60 seconds",
          description: "Back strengthening"
        }
      ],
      wednesday: [
        {
          name: "Dips",
          sets: 3,
          reps: "8-10",
          rest: "90 seconds",
          description: "Bench or chair dips"
        },
        {
          name: "Glute Bridges",
          sets: 3,
          reps: "12-15",
          rest: "60 seconds",
          description: "Single leg variations"
        },
        {
          name: "Bird Dogs",
          sets: 3,
          reps: "10 each side",
          rest: "60 seconds",
          description: "Core and balance"
        }
      ],
      thursday: [
        {
          name: "Wall Push-ups",
          sets: 3,
          reps: "12-15",
          rest: "60 seconds",
          description: "Progress to incline push-ups"
        },
        {
          name: "Step-ups",
          sets: 3,
          reps: "10 each leg",
          rest: "60 seconds",
          description: "Bodyweight step-ups"
        },
        {
          name: "Russian Twists",
          sets: 3,
          reps: "20",
          rest: "60 seconds",
          description: "Seated core rotation"
        }
      ],
      friday: [
        {
          name: "Inverted Rows",
          sets: 3,
          reps: "10-12",
          rest: "90 seconds",
          description: "Using a table or low bar"
        },
        {
          name: "Squat Jumps",
          sets: 3,
          reps: "10",
          rest: "60 seconds",
          description: "Explosive movement"
        },
        {
          name: "Plank Variations",
          sets: 3,
          reps: "30 seconds each",
          rest: "60 seconds",
          description: "Side plank, forearm plank"
        }
      ],
      saturday: [
        {
          name: "Yoga",
          sets: 1,
          reps: "30 minutes",
          rest: "None",
          description: "Strength-focused yoga"
        },
        {
          name: "Stretching",
          sets: 1,
          reps: "15 minutes",
          rest: "None",
          description: "Full body stretching"
        }
      ],
      sunday: [
        {
          name: "Active Recovery",
          sets: 1,
          reps: "30 minutes",
          rest: "None",
          description: "Light walking and stretching"
        }
      ]
    },
    intermediate: {
      monday: [
        {
          name: "Pull-ups",
          sets: 4,
          reps: "8-12",
          rest: "90 seconds",
          description: "Wide grip"
        },
        {
          name: "Dips",
          sets: 4,
          reps: "10-12",
          rest: "90 seconds",
          description: "Weighted dips"
        },
        {
          name: "Push-ups",
          sets: 3,
          reps: "15-20",
          rest: "60 seconds",
          description: "Diamond push-ups"
        }
      ],
      tuesday: [
        {
          name: "Squats",
          sets: 4,
          reps: "8-12",
          rest: "90 seconds",
          description: "With weights"
        },
        {
          name: "Lunges",
          sets: 3,
          reps: "12 each leg",
          rest: "60 seconds",
          description: "Walking lunges with weights"
        },
        {
          name: "Deadlifts",
          sets: 3,
          reps: "10",
          rest: "90 seconds",
          description: "Romanian deadlifts"
        }
      ],
      wednesday: [
        {
          name: "Bench Press",
          sets: 4,
          reps: "8-12",
          rest: "90 seconds",
          description: "Barbell or dumbbell"
        },
        {
          name: "Rows",
          sets: 3,
          reps: "10-12",
          rest: "90 seconds",
          description: "Bent over rows"
        },
        {
          name: "Shoulder Press",
          sets: 3,
          reps: "10-12",
          rest: "90 seconds",
          description: "Standing or seated"
        }
      ],
      thursday: [
        {
          name: "Pull-ups",
          sets: 4,
          reps: "8-12",
          rest: "90 seconds",
          description: "Close grip"
        },
        {
          name: "Dips",
          sets: 4,
          reps: "10-12",
          rest: "90 seconds",
          description: "Weighted dips"
        },
        {
          name: "Push-ups",
          sets: 3,
          reps: "15-20",
          rest: "60 seconds",
          description: "Wide grip"
        }
      ],
      friday: [
        {
          name: "Squats",
          sets: 4,
          reps: "8-12",
          rest: "90 seconds",
          description: "Front squats"
        },
        {
          name: "Lunges",
          sets: 3,
          reps: "12 each leg",
          rest: "60 seconds",
          description: "Reverse lunges with weights"
        },
        {
          name: "Deadlifts",
          sets: 3,
          reps: "10",
          rest: "90 seconds",
          description: "Sumo deadlifts"
        }
      ],
      saturday: [
        {
          name: "HIIT",
          sets: 4,
          reps: "30 seconds each",
          rest: "30 seconds",
          description: "Burpees, Mountain Climbers, Jump Squats"
        },
        {
          name: "Core Circuit",
          sets: 3,
          reps: "30 seconds each",
          rest: "30 seconds",
          description: "Plank, Side Plank, Russian Twists"
        }
      ],
      sunday: [
        {
          name: "Active Recovery",
          sets: 1,
          reps: "45 minutes",
          rest: "None",
          description: "Light cardio and stretching"
        }
      ]
    }
  }
};

export const indianMealPlans = {
  weightLoss: {
    monday: {
      breakfast: {
        name: "Oats Idli with Sambar",
        calories: 250,
        protein: 8,
        carbs: 45,
        fats: 3,
        ingredients: ["Oats", "Urad dal", "Idli batter", "Sambar", "Coconut chutney"],
        instructions: "Steam oats idli and serve with sambar and chutney"
      },
      lunch: {
        name: "Brown Rice with Dal and Vegetables",
        calories: 350,
        protein: 15,
        carbs: 60,
        fats: 5,
        ingredients: ["Brown rice", "Toor dal", "Mixed vegetables", "Spices"],
        instructions: "Cook brown rice and dal separately, serve with vegetables"
      },
      dinner: {
        name: "Grilled Fish with Roti",
        calories: 300,
        protein: 25,
        carbs: 30,
        fats: 8,
        ingredients: ["Fish fillet", "Whole wheat roti", "Spices", "Lemon"],
        instructions: "Grill fish with spices and serve with roti"
      }
    },
    tuesday: {
      breakfast: {
        name: "Moong Dal Chilla",
        calories: 200,
        protein: 12,
        carbs: 30,
        fats: 4,
        ingredients: ["Moong dal", "Onions", "Green chilies", "Spices"],
        instructions: "Make thin pancakes with moong dal batter"
      },
      lunch: {
        name: "Quinoa Pulao with Vegetables",
        calories: 320,
        protein: 12,
        carbs: 55,
        fats: 6,
        ingredients: ["Quinoa", "Mixed vegetables", "Spices", "Ghee"],
        instructions: "Cook quinoa with vegetables and spices"
      },
      dinner: {
        name: "Chicken Curry with Brown Rice",
        calories: 380,
        protein: 28,
        carbs: 45,
        fats: 10,
        ingredients: ["Chicken", "Brown rice", "Spices", "Yogurt"],
        instructions: "Prepare chicken curry and serve with brown rice"
      }
    },
    wednesday: {
      breakfast: {
        name: "Besan Chilla with Mint Chutney",
        calories: 220,
        protein: 10,
        carbs: 35,
        fats: 5,
        ingredients: ["Besan", "Onions", "Spices", "Mint chutney"],
        instructions: "Make thin pancakes with besan batter"
      },
      lunch: {
        name: "Millet Khichdi",
        calories: 340,
        protein: 14,
        carbs: 58,
        fats: 7,
        ingredients: ["Millet", "Moong dal", "Vegetables", "Spices"],
        instructions: "Cook millet and dal with vegetables"
      },
      dinner: {
        name: "Tofu Bhurji with Roti",
        calories: 290,
        protein: 18,
        carbs: 35,
        fats: 9,
        ingredients: ["Tofu", "Whole wheat roti", "Spices", "Vegetables"],
        instructions: "Scramble tofu with spices and serve with roti"
      }
    },
    thursday: {
      breakfast: {
        name: "Ragi Dosa with Sambar",
        calories: 230,
        protein: 9,
        carbs: 42,
        fats: 4,
        ingredients: ["Ragi flour", "Urad dal", "Sambar", "Coconut chutney"],
        instructions: "Make dosa with ragi batter and serve with sambar"
      },
      lunch: {
        name: "Vegetable Biryani with Raita",
        calories: 360,
        protein: 12,
        carbs: 62,
        fats: 8,
        ingredients: ["Brown rice", "Mixed vegetables", "Spices", "Raita"],
        instructions: "Prepare vegetable biryani and serve with raita"
      },
      dinner: {
        name: "Grilled Chicken with Quinoa",
        calories: 350,
        protein: 30,
        carbs: 35,
        fats: 12,
        ingredients: ["Chicken breast", "Quinoa", "Spices", "Lemon"],
        instructions: "Grill chicken and serve with quinoa"
      }
    },
    friday: {
      breakfast: {
        name: "Sprouts Chaat",
        calories: 210,
        protein: 11,
        carbs: 38,
        fats: 4,
        ingredients: ["Mixed sprouts", "Onions", "Tomatoes", "Spices"],
        instructions: "Mix sprouts with vegetables and spices"
      },
      lunch: {
        name: "Dal Makhani with Roti",
        calories: 330,
        protein: 16,
        carbs: 48,
        fats: 9,
        ingredients: ["Black dal", "Whole wheat roti", "Spices", "Butter"],
        instructions: "Cook dal with spices and serve with roti"
      },
      dinner: {
        name: "Fish Curry with Brown Rice",
        calories: 340,
        protein: 26,
        carbs: 42,
        fats: 10,
        ingredients: ["Fish", "Brown rice", "Spices", "Coconut milk"],
        instructions: "Prepare fish curry and serve with brown rice"
      }
    },
    saturday: {
      breakfast: {
        name: "Poha with Vegetables",
        calories: 240,
        protein: 8,
        carbs: 45,
        fats: 5,
        ingredients: ["Poha", "Vegetables", "Peanuts", "Spices"],
        instructions: "Cook poha with vegetables and spices"
      },
      lunch: {
        name: "Chana Masala with Roti",
        calories: 350,
        protein: 14,
        carbs: 52,
        fats: 8,
        ingredients: ["Chickpeas", "Whole wheat roti", "Spices", "Onions"],
        instructions: "Prepare chana masala and serve with roti"
      },
      dinner: {
        name: "Grilled Tofu with Vegetables",
        calories: 280,
        protein: 20,
        carbs: 30,
        fats: 12,
        ingredients: ["Tofu", "Mixed vegetables", "Spices", "Olive oil"],
        instructions: "Grill tofu and vegetables with spices"
      }
    },
    sunday: {
      breakfast: {
        name: "Upma with Vegetables",
        calories: 220,
        protein: 7,
        carbs: 40,
        fats: 5,
        ingredients: ["Semolina", "Vegetables", "Spices", "Nuts"],
        instructions: "Cook upma with vegetables and spices"
      },
      lunch: {
        name: "Rajma Chawal",
        calories: 360,
        protein: 16,
        carbs: 58,
        fats: 8,
        ingredients: ["Kidney beans", "Brown rice", "Spices", "Onions"],
        instructions: "Prepare rajma and serve with brown rice"
      },
      dinner: {
        name: "Chicken Tikka with Salad",
        calories: 320,
        protein: 28,
        carbs: 25,
        fats: 14,
        ingredients: ["Chicken", "Mixed salad", "Spices", "Yogurt"],
        instructions: "Grill chicken tikka and serve with salad"
      }
    }
  },
  muscleGain: {
    monday: {
      breakfast: {
        name: "Poha with Peanuts",
        calories: 400,
        protein: 15,
        carbs: 65,
        fats: 12,
        ingredients: ["Poha", "Peanuts", "Vegetables", "Spices"],
        instructions: "Cook poha with vegetables and peanuts"
      },
      lunch: {
        name: "Chicken Biryani",
        calories: 600,
        protein: 35,
        carbs: 80,
        fats: 15,
        ingredients: ["Basmati rice", "Chicken", "Spices", "Yogurt"],
        instructions: "Prepare biryani with chicken and spices"
      },
      dinner: {
        name: "Paneer Butter Masala with Roti",
        calories: 500,
        protein: 20,
        carbs: 45,
        fats: 25,
        ingredients: ["Paneer", "Tomato gravy", "Butter", "Roti"],
        instructions: "Prepare paneer in rich tomato gravy"
      }
    },
    tuesday: {
      breakfast: {
        name: "Masala Oats with Nuts",
        calories: 450,
        protein: 18,
        carbs: 60,
        fats: 15,
        ingredients: ["Oats", "Mixed nuts", "Spices", "Ghee"],
        instructions: "Cook oats with spices and top with nuts"
      },
      lunch: {
        name: "Mutton Curry with Rice",
        calories: 650,
        protein: 40,
        carbs: 70,
        fats: 20,
        ingredients: ["Mutton", "Rice", "Spices", "Ghee"],
        instructions: "Prepare mutton curry and serve with rice"
      },
      dinner: {
        name: "Chicken Tikka with Naan",
        calories: 550,
        protein: 35,
        carbs: 50,
        fats: 25,
        ingredients: ["Chicken", "Naan", "Spices", "Butter"],
        instructions: "Grill chicken tikka and serve with naan"
      }
    },
    wednesday: {
      breakfast: {
        name: "Besan Chilla with Paneer",
        calories: 420,
        protein: 22,
        carbs: 45,
        fats: 18,
        ingredients: ["Besan", "Paneer", "Spices", "Ghee"],
        instructions: "Make thick pancakes with besan and paneer"
      },
      lunch: {
        name: "Fish Curry with Rice",
        calories: 580,
        protein: 38,
        carbs: 65,
        fats: 22,
        ingredients: ["Fish", "Rice", "Spices", "Coconut milk"],
        instructions: "Prepare fish curry and serve with rice"
      },
      dinner: {
        name: "Butter Chicken with Naan",
        calories: 620,
        protein: 32,
        carbs: 55,
        fats: 30,
        ingredients: ["Chicken", "Naan", "Butter", "Spices"],
        instructions: "Prepare butter chicken and serve with naan"
      }
    },
    thursday: {
      breakfast: {
        name: "Egg Bhurji with Roti",
        calories: 480,
        protein: 25,
        carbs: 40,
        fats: 25,
        ingredients: ["Eggs", "Roti", "Spices", "Butter"],
        instructions: "Scramble eggs with spices and serve with roti"
      },
      lunch: {
        name: "Chicken Biryani",
        calories: 650,
        protein: 38,
        carbs: 75,
        fats: 22,
        ingredients: ["Chicken", "Rice", "Spices", "Ghee"],
        instructions: "Prepare chicken biryani with spices"
      },
      dinner: {
        name: "Paneer Tikka with Naan",
        calories: 520,
        protein: 28,
        carbs: 45,
        fats: 28,
        ingredients: ["Paneer", "Naan", "Spices", "Butter"],
        instructions: "Grill paneer tikka and serve with naan"
      }
    },
    friday: {
      breakfast: {
        name: "Masala Dosa with Sambar",
        calories: 450,
        protein: 15,
        carbs: 70,
        fats: 15,
        ingredients: ["Dosa batter", "Sambar", "Spices", "Ghee"],
        instructions: "Make masala dosa and serve with sambar"
      },
      lunch: {
        name: "Mutton Biryani",
        calories: 680,
        protein: 42,
        carbs: 75,
        fats: 25,
        ingredients: ["Mutton", "Rice", "Spices", "Ghee"],
        instructions: "Prepare mutton biryani with spices"
      },
      dinner: {
        name: "Chicken Curry with Roti",
        calories: 580,
        protein: 35,
        carbs: 50,
        fats: 28,
        ingredients: ["Chicken", "Roti", "Spices", "Butter"],
        instructions: "Prepare chicken curry and serve with roti"
      }
    },
    saturday: {
      breakfast: {
        name: "Poha with Eggs",
        calories: 500,
        protein: 25,
        carbs: 60,
        fats: 20,
        ingredients: ["Poha", "Eggs", "Vegetables", "Spices"],
        instructions: "Cook poha with eggs and vegetables"
      },
      lunch: {
        name: "Fish Biryani",
        calories: 620,
        protein: 40,
        carbs: 70,
        fats: 22,
        ingredients: ["Fish", "Rice", "Spices", "Ghee"],
        instructions: "Prepare fish biryani with spices"
      },
      dinner: {
        name: "Paneer Butter Masala with Naan",
        calories: 580,
        protein: 25,
        carbs: 50,
        fats: 32,
        ingredients: ["Paneer", "Naan", "Butter", "Spices"],
        instructions: "Prepare paneer in rich gravy and serve with naan"
      }
    },
    sunday: {
      breakfast: {
        name: "Masala Oats with Eggs",
        calories: 480,
        protein: 28,
        carbs: 55,
        fats: 22,
        ingredients: ["Oats", "Eggs", "Spices", "Ghee"],
        instructions: "Cook oats with eggs and spices"
      },
      lunch: {
        name: "Chicken Biryani",
        calories: 650,
        protein: 38,
        carbs: 75,
        fats: 22,
        ingredients: ["Chicken", "Rice", "Spices", "Ghee"],
        instructions: "Prepare chicken biryani with spices"
      },
      dinner: {
        name: "Butter Chicken with Naan",
        calories: 620,
        protein: 32,
        carbs: 55,
        fats: 30,
        ingredients: ["Chicken", "Naan", "Butter", "Spices"],
        instructions: "Prepare butter chicken and serve with naan"
      }
    }
  }
};

// Large pool of exercises (add more as needed)
export const exercisePool: Exercise[] = [
  // Bodyweight
  { name: 'Push-ups', sets: 3, reps: '12-15', rest: '60s', description: 'Standard push-ups', type: 'bodyweight', level: 'beginner' },
  { name: 'Squats', sets: 3, reps: '15-20', rest: '60s', description: 'Bodyweight squats', type: 'bodyweight', level: 'beginner' },
  { name: 'Lunges', sets: 3, reps: '12 each leg', rest: '60s', description: 'Alternating lunges', type: 'bodyweight', level: 'beginner' },
  { name: 'Plank', sets: 3, reps: '30s', rest: '60s', description: 'Core strengthening', type: 'bodyweight', level: 'beginner' },
  { name: 'Burpees', sets: 3, reps: '10-12', rest: '60s', description: 'Full body movement', type: 'bodyweight', level: 'intermediate' },
  { name: 'Mountain Climbers', sets: 3, reps: '30s', rest: '30s', description: 'Core and cardio', type: 'bodyweight', level: 'intermediate' },
  { name: 'Triceps Dips', sets: 3, reps: '12-15', rest: '60s', description: 'Chair dips', type: 'bodyweight', level: 'beginner' },
  { name: 'Glute Bridges', sets: 3, reps: '15', rest: '60s', description: 'Hip bridges', type: 'bodyweight', level: 'beginner' },
  { name: 'Superman', sets: 3, reps: '12', rest: '60s', description: 'Back strengthening', type: 'bodyweight', level: 'beginner' },
  { name: 'Russian Twists', sets: 3, reps: '20', rest: '60s', description: 'Core rotation', type: 'bodyweight', level: 'intermediate' },
  { name: 'Jumping Jacks', sets: 3, reps: '30s', rest: '30s', description: 'Cardio warmup', type: 'bodyweight', level: 'beginner' },
  { name: 'Wall Sit', sets: 3, reps: '45s', rest: '60s', description: 'Isometric leg hold', type: 'bodyweight', level: 'beginner' },
  { name: 'High Knees', sets: 3, reps: '30s', rest: '30s', description: 'Cardio', type: 'bodyweight', level: 'intermediate' },
  { name: 'Side Plank', sets: 3, reps: '30s each side', rest: '60s', description: 'Oblique/core', type: 'bodyweight', level: 'intermediate' },
  { name: 'Bicycle Crunches', sets: 3, reps: '20', rest: '60s', description: 'Core', type: 'bodyweight', level: 'intermediate' },
  { name: 'Step-ups', sets: 3, reps: '12 each leg', rest: '60s', description: 'Step on platform', type: 'bodyweight', level: 'beginner' },
  { name: 'Bear Crawl', sets: 3, reps: '30s', rest: '60s', description: 'Full body', type: 'bodyweight', level: 'intermediate' },
  { name: 'Reverse Crunch', sets: 3, reps: '15', rest: '60s', description: 'Lower abs', type: 'bodyweight', level: 'beginner' },
  { name: 'Standing Calf Raise', sets: 3, reps: '20', rest: '60s', description: 'Calves', type: 'bodyweight', level: 'beginner' },
  // Gym
  { name: 'Bench Press', sets: 4, reps: '8-12', rest: '90s', description: 'Barbell bench press', type: 'gym', level: 'intermediate' },
  { name: 'Incline Dumbbell Press', sets: 4, reps: '8-12', rest: '90s', description: 'Chest', type: 'gym', level: 'intermediate' },
  { name: 'Deadlift', sets: 4, reps: '6-10', rest: '120s', description: 'Barbell deadlift', type: 'gym', level: 'advanced' },
  { name: 'Lat Pulldown', sets: 3, reps: '10-12', rest: '60s', description: 'Back exercise', type: 'gym', level: 'beginner' },
  { name: 'Seated Row', sets: 3, reps: '10-12', rest: '60s', description: 'Back', type: 'gym', level: 'intermediate' },
  { name: 'Barbell Curl', sets: 3, reps: '10-12', rest: '60s', description: 'Biceps', type: 'gym', level: 'beginner' },
  { name: 'Triceps Pushdown', sets: 3, reps: '10-12', rest: '60s', description: 'Triceps', type: 'gym', level: 'beginner' },
  { name: 'Leg Press', sets: 4, reps: '10-15', rest: '90s', description: 'Legs', type: 'gym', level: 'intermediate' },
  { name: 'Leg Extension', sets: 3, reps: '12-15', rest: '60s', description: 'Quads', type: 'gym', level: 'beginner' },
  { name: 'Leg Curl', sets: 3, reps: '12-15', rest: '60s', description: 'Hamstrings', type: 'gym', level: 'beginner' },
  { name: 'Shoulder Press', sets: 3, reps: '10-12', rest: '60s', description: 'Shoulders', type: 'gym', level: 'intermediate' },
  { name: 'Cable Fly', sets: 3, reps: '12-15', rest: '60s', description: 'Chest', type: 'gym', level: 'intermediate' },
  { name: 'Dumbbell Lateral Raise', sets: 3, reps: '12-15', rest: '60s', description: 'Shoulders', type: 'gym', level: 'intermediate' },
  { name: 'Dumbbell Shrug', sets: 3, reps: '12-15', rest: '60s', description: 'Traps', type: 'gym', level: 'intermediate' },
  { name: 'Smith Machine Squat', sets: 4, reps: '10-15', rest: '90s', description: 'Legs', type: 'gym', level: 'advanced' },
  { name: 'Hack Squat', sets: 4, reps: '10-15', rest: '90s', description: 'Legs', type: 'gym', level: 'advanced' },
  { name: 'Preacher Curl', sets: 3, reps: '10-12', rest: '60s', description: 'Biceps', type: 'gym', level: 'intermediate' },
  { name: 'Triceps Overhead Extension', sets: 3, reps: '10-12', rest: '60s', description: 'Triceps', type: 'gym', level: 'intermediate' },
  { name: 'Standing Calf Raise (Machine)', sets: 3, reps: '15-20', rest: '60s', description: 'Calves', type: 'gym', level: 'beginner' },
  // Boxing
  { name: 'Shadow Boxing', sets: 4, reps: '3 min', rest: '1 min', description: 'Boxing technique practice', type: 'boxing', level: 'beginner' },
  { name: 'Heavy Bag', sets: 5, reps: '2 min', rest: '1 min', description: 'Punching bag workout', type: 'boxing', level: 'intermediate' },
  { name: 'Speed Bag', sets: 4, reps: '2 min', rest: '1 min', description: 'Hand speed and coordination', type: 'boxing', level: 'intermediate' },
  { name: 'Double End Bag', sets: 4, reps: '2 min', rest: '1 min', description: 'Accuracy and rhythm', type: 'boxing', level: 'intermediate' },
  { name: 'Box Jumps', sets: 3, reps: '10', rest: '60s', description: 'Explosive power', type: 'boxing', level: 'intermediate' },
  { name: 'Jump Rope', sets: 5, reps: '2 min', rest: '1 min', description: 'Cardio and footwork', type: 'boxing', level: 'beginner' },
  { name: 'Focus Mitts', sets: 4, reps: '3 min', rest: '1 min', description: 'Pad work with partner', type: 'boxing', level: 'intermediate' },
  { name: 'Defensive Drills', sets: 4, reps: '3 min', rest: '1 min', description: 'Slips, rolls, blocks', type: 'boxing', level: 'intermediate' },
  // ... (add more to reach 200)
];

// Large pool of Indian meals (add more as needed)
export const mealPool: Meal[] = [
  // Veg
  { name: 'Paneer Tikka', calories: 320, protein: 18, carbs: 12, fats: 20, ingredients: ['Paneer', 'Spices', 'Yogurt'], instructions: 'Grill marinated paneer cubes.', veg: true },
  { name: 'Chana Masala', calories: 280, protein: 12, carbs: 40, fats: 6, ingredients: ['Chickpeas', 'Tomato', 'Spices'], instructions: 'Cook chickpeas with tomato and spices.', veg: true },
  { name: 'Masoor Dal', calories: 220, protein: 14, carbs: 30, fats: 3, ingredients: ['Red lentils', 'Spices'], instructions: 'Boil dal and temper with spices.', veg: true },
  { name: 'Aloo Gobi', calories: 210, protein: 5, carbs: 35, fats: 7, ingredients: ['Potato', 'Cauliflower', 'Spices'], instructions: 'Cook potato and cauliflower with spices.', veg: true },
  { name: 'Rajma', calories: 250, protein: 10, carbs: 40, fats: 4, ingredients: ['Kidney beans', 'Spices', 'Tomato'], instructions: 'Cook kidney beans in tomato gravy.', veg: true },
  { name: 'Palak Paneer', calories: 300, protein: 16, carbs: 14, fats: 18, ingredients: ['Spinach', 'Paneer', 'Spices'], instructions: 'Cook paneer in spinach gravy.', veg: true },
  { name: 'Vegetable Biryani', calories: 350, protein: 8, carbs: 60, fats: 8, ingredients: ['Rice', 'Vegetables', 'Spices'], instructions: 'Cook rice with mixed vegetables and spices.', veg: true },
  { name: 'Dhokla', calories: 180, protein: 7, carbs: 30, fats: 3, ingredients: ['Gram flour', 'Spices', 'Yogurt'], instructions: 'Steam gram flour batter.', veg: true },
  { name: 'Idli Sambar', calories: 220, protein: 8, carbs: 40, fats: 2, ingredients: ['Rice', 'Lentils', 'Spices'], instructions: 'Steam idli and serve with sambar.', veg: true },
  { name: 'Upma', calories: 200, protein: 6, carbs: 35, fats: 4, ingredients: ['Semolina', 'Vegetables', 'Spices'], instructions: 'Cook semolina with vegetables.', veg: true },
  { name: 'Poha', calories: 210, protein: 5, carbs: 38, fats: 5, ingredients: ['Flattened rice', 'Vegetables', 'Spices'], instructions: 'Cook poha with vegetables.', veg: true },
  { name: 'Bhindi Masala', calories: 180, protein: 4, carbs: 20, fats: 8, ingredients: ['Okra', 'Spices', 'Onion'], instructions: 'Cook okra with onion and spices.', veg: true },
  { name: 'Baingan Bharta', calories: 170, protein: 4, carbs: 18, fats: 7, ingredients: ['Eggplant', 'Spices', 'Onion'], instructions: 'Roast and mash eggplant with spices.', veg: true },
  { name: 'Kadhi', calories: 160, protein: 6, carbs: 20, fats: 6, ingredients: ['Yogurt', 'Gram flour', 'Spices'], instructions: 'Cook yogurt and gram flour with spices.', veg: true },
  { name: 'Moong Dal', calories: 200, protein: 12, carbs: 28, fats: 3, ingredients: ['Moong dal', 'Spices'], instructions: 'Boil moong dal and temper with spices.', veg: true },
  // Non-Veg
  { name: 'Chicken Curry', calories: 400, protein: 30, carbs: 10, fats: 22, ingredients: ['Chicken', 'Spices', 'Yogurt'], instructions: 'Cook chicken with spices and yogurt.', veg: false },
  { name: 'Fish Fry', calories: 350, protein: 28, carbs: 8, fats: 18, ingredients: ['Fish', 'Spices', 'Oil'], instructions: 'Shallow fry marinated fish.', veg: false },
  { name: 'Egg Curry', calories: 300, protein: 16, carbs: 8, fats: 18, ingredients: ['Eggs', 'Spices', 'Tomato'], instructions: 'Cook boiled eggs in tomato gravy.', veg: false },
  { name: 'Mutton Rogan Josh', calories: 450, protein: 28, carbs: 12, fats: 30, ingredients: ['Mutton', 'Spices', 'Yogurt'], instructions: 'Cook mutton with spices and yogurt.', veg: false },
  { name: 'Prawn Masala', calories: 320, protein: 22, carbs: 6, fats: 16, ingredients: ['Prawns', 'Spices', 'Onion'], instructions: 'Cook prawns with onion and spices.', veg: false },
  { name: 'Chicken Biryani', calories: 500, protein: 28, carbs: 60, fats: 18, ingredients: ['Chicken', 'Rice', 'Spices'], instructions: 'Cook chicken and rice with spices.', veg: false },
  { name: 'Fish Curry', calories: 340, protein: 24, carbs: 10, fats: 14, ingredients: ['Fish', 'Spices', 'Coconut milk'], instructions: 'Cook fish in coconut milk and spices.', veg: false },
  { name: 'Keema', calories: 420, protein: 25, carbs: 8, fats: 28, ingredients: ['Minced meat', 'Spices', 'Onion'], instructions: 'Cook minced meat with onion and spices.', veg: false },
  { name: 'Egg Bhurji', calories: 250, protein: 14, carbs: 6, fats: 16, ingredients: ['Eggs', 'Onion', 'Spices'], instructions: 'Scramble eggs with onion and spices.', veg: false },
  { name: 'Butter Chicken', calories: 480, protein: 26, carbs: 14, fats: 28, ingredients: ['Chicken', 'Butter', 'Tomato'], instructions: 'Cook chicken in butter and tomato gravy.', veg: false },
  { name: 'Tandoori Chicken', calories: 350, protein: 30, carbs: 6, fats: 14, ingredients: ['Chicken', 'Spices', 'Yogurt'], instructions: 'Grill marinated chicken.', veg: false },
  { name: 'Fish Tikka', calories: 300, protein: 22, carbs: 4, fats: 12, ingredients: ['Fish', 'Spices', 'Yogurt'], instructions: 'Grill marinated fish.', veg: false },
  { name: 'Chicken Korma', calories: 420, protein: 24, carbs: 12, fats: 26, ingredients: ['Chicken', 'Spices', 'Cream'], instructions: 'Cook chicken in creamy sauce.', veg: false },
  { name: 'Egg Paratha', calories: 320, protein: 12, carbs: 38, fats: 12, ingredients: ['Eggs', 'Wheat flour', 'Spices'], instructions: 'Stuff paratha with egg mixture.', veg: false },
  // ... (add more to reach 200)
];

// Utility to get random unique items from an array
function getRandomUnique<T>(arr: T[], count: number): T[] {
  const shuffled = arr.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// New generateWeeklyPlan: randomizes each day
export const generateWeeklyPlan = (
  goal: string,
  experience: string,
  weight: number,
  height: number,
  options?: { vegOnly?: boolean }
) => {
  // Filter exercises by level and type (bodyweight, gym, boxing)
  const level = experience === 'advanced' ? 'intermediate' : experience;
  const exercisesFiltered = exercisePool.filter(e => e.level === level);
  // For demo, mix all types; you can filter by user preference if needed

  // Filter meals by veg/non-veg
  let mealsFiltered = mealPool;
  if (options?.vegOnly) {
    mealsFiltered = mealPool.filter(m => m.veg);
  }

  // For each day, pick 3 random exercises and 1 random meal for breakfast, lunch, dinner
  const days = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
  const plan: any = {};
  days.forEach(day => {
    plan[day] = {
      exercises: getRandomUnique(exercisesFiltered, 3),
      meals: {
        breakfast: getRandomUnique(mealsFiltered, 1)[0],
        lunch: getRandomUnique(mealsFiltered, 1)[0],
        dinner: getRandomUnique(mealsFiltered, 1)[0],
      }
    };
  });
  return plan;
}; 