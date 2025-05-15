from fastapi import FastAPI, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from datetime import timedelta, datetime
from typing import Optional, Dict, List
from pydantic import BaseModel
import json
import os
import jwt
from passlib.context import CryptContext
import cohere
import requests
from dotenv import load_dotenv

from auth import (
    User, UserInDB, Token, authenticate_user, create_access_token,
    get_current_active_user, get_password_hash, get_users, save_users,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

# Load environment variables
load_dotenv()

# Debug: Print if API key is loaded
api_key = os.getenv("COHERE_API_KEY")
print("API Key loaded:", "Yes" if api_key else "No")
if not api_key:
    print("WARNING: COHERE_API_KEY not found in environment variables!")

# Initialize Cohere client
co = cohere.Client(api_key)

# Weather API configuration
WEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
WEATHER_BASE_URL = "http://api.openweathermap.org/data/2.5/weather"

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# User profile model
class UserProfile(BaseModel):
    weight: Optional[float] = None
    height: Optional[float] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    goals: Optional[list] = None
    experience: Optional[str] = None
    medical_conditions: Optional[str] = None

# Exercise categories and data
EXERCISE_CATEGORIES = {
    "Upper Body": [
        "bench", "ohp", "pushup", "dip", "shoulder_press", "lateral_raise",
        "front_raise", "tricep_extension", "tricep_pushdown", "pull_up",
        "chin_up", "row"
    ],
    "Lower Body": [
        "squat", "deadlift", "romanian_deadlift", "leg_press", "calf_raise",
        "lunges", "leg_extension", "leg_curl"
    ],
    "Core": [
        "plank", "sit_up", "russian_twist", "leg_raise", "bicycle_crunch",
        "hanging_knee_raise", "v_up", "side_plank", "toe_touch"
    ],
    "Full Body": [
        "burpee", "mountain_climber", "jumping_jack"
    ]
}

# Exercise endpoints
@app.get("/api/exercises/categories")
async def get_exercise_categories():
    return EXERCISE_CATEGORIES

@app.get("/api/exercises/available")
async def get_available_exercises():
    # For now, return all exercises as available
    # In a real app, this would check which exercises have data
    all_exercises = []
    for exercises in EXERCISE_CATEGORIES.values():
        all_exercises.extend(exercises)
    return all_exercises

@app.get("/api/exercises/{exercise_name}")
async def get_exercise_data(exercise_name: str):
    # For now, return empty data
    # In a real app, this would return actual exercise data
    return []

# Authentication endpoints
@app.post("/api/signup", response_model=Token)
async def signup(form_data: OAuth2PasswordRequestForm = Depends()):
    users = get_users()
    if form_data.username in users:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    hashed_password = get_password_hash(form_data.password)
    users[form_data.username] = {
        "username": form_data.username,
        "hashed_password": hashed_password,
        "disabled": False
    }
    save_users(users)
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": form_data.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Profile endpoints
PROFILES_FILE = "profiles.json"

def get_profiles():
    if os.path.exists(PROFILES_FILE):
        with open(PROFILES_FILE, "r") as f:
            return json.load(f)
    return {}

def save_profiles(profiles):
    with open(PROFILES_FILE, "w") as f:
        json.dump(profiles, f)

@app.get("/api/profile")
async def get_profile(current_user: User = Depends(get_current_active_user)):
    profiles = get_profiles()
    return profiles.get(current_user.username, {})

@app.post("/api/profile")
async def update_profile(
    profile: UserProfile,
    current_user: User = Depends(get_current_active_user)
):
    profiles = get_profiles()
    profiles[current_user.username] = profile.dict()
    save_profiles(profiles)
    return {"message": "Profile updated successfully"}

# Define chat models
class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

# Enhanced fitness knowledge base with more natural responses
FITNESS_RESPONSES = {
    "workout": {
        "beginner": "Hey there! As a beginner, let's start with something manageable: \n\n1) Begin with 10-15 minutes of light cardio - walking or jogging is perfect! \n2) Then try these basic exercises: \n   - Push-ups (start with knee push-ups if needed) \n   - Bodyweight squats \n   - Lunges \n3) Do 2-3 sets of 10-12 reps for each exercise \n\nRemember to warm up for 5 minutes before starting and cool down after. How does that sound? 😊",
        "intermediate": "Great! For intermediate level, here's a solid plan: \n\n1) Start with 20-30 minutes of cardio - mix it up with running, cycling, or jumping rope \n2) Your workout should include: \n   - A mix of bodyweight exercises and light weights \n   - 3-4 sets of 12-15 reps \n   - Compound exercises like deadlifts and bench press \n\nWould you like me to break down any of these exercises in detail? 💪",
        "advanced": "Awesome! For advanced training, let's step it up: \n\n1) Begin with 30-45 minutes of varied cardio - try HIIT or circuit training \n2) Focus on: \n   - Heavy compound lifts \n   - 4-5 sets of 8-12 reps \n   - Include supersets and drop sets \n   - Progressive overload \n\nWhat specific areas would you like to focus on? 🏋️‍♂️"
    },
    "nutrition": {
        "weight_loss": "Let's talk about healthy weight loss! Here's a sustainable approach: \n\n1) Create a caloric deficit of 500 calories daily \n2) Focus on protein: aim for 1.6g per kg of bodyweight \n3) Choose complex carbs and healthy fats \n4) Stay hydrated - drink 2-3L of water daily \n\nWould you like some meal plan examples? 🥗",
        "muscle_gain": "Time to build some muscle! Here's what you need: \n\n1) Eat in a caloric surplus of 300-500 calories \n2) Load up on protein: 2g per kg of bodyweight \n3) Include complex carbs for energy \n4) Don't forget healthy fats for hormone production \n\nNeed some meal ideas to hit these targets? 💪",
        "maintenance": "Maintaining your current weight? Here's how to do it right: \n\n1) Calculate your TDEE (Total Daily Energy Expenditure) \n2) Eat at maintenance calories \n3) Balance your macros: \n   - 40% carbs \n   - 30% protein \n   - 30% fat \n4) Focus on whole, nutritious foods \n\nWould you like help calculating your TDEE? 🥑"
    },
    "form": {
        "squat": "Let's perfect your squat form! Here's the step-by-step: \n\n1) Stand with feet shoulder-width apart \n2) Keep your chest up and core tight \n3) Push your knees out in line with your toes \n4) Lower until thighs are parallel to ground \n5) Drive through your heels to stand up \n\nCommon mistakes to avoid: \n- Don't let knees cave in \n- Keep your back straight \n- Don't lift your heels \n\nWould you like me to explain any of these points in more detail? 🏋️‍♀️",
        "deadlift": "Let's master the deadlift! Here's the proper form: \n\n1) Stand with feet hip-width apart \n2) Bend at hips and knees \n3) Keep your back straight and chest up \n4) Pull the bar close to your body \n5) Drive through your heels to stand up \n\nKey tips: \n- Keep the bar close to your shins \n- Don't round your back \n- Engage your core throughout \n\nNeed any clarification on these points? 💪",
        "pushup": "Let's get your push-up form perfect! Here's how: \n\n1) Place hands slightly wider than shoulders \n2) Keep your body in a straight line \n3) Lower your chest to the ground \n4) Push through your palms to return up \n5) Keep your core tight throughout \n\nModifications if needed: \n- Start with knee push-ups \n- Use an elevated surface \n- Focus on form over reps \n\nWould you like to know about push-up variations? 🏋️‍♂️"
    },
    "motivation": [
        "Remember: Every small step you take is progress! You're doing better than you think! 💪",
        "Stay consistent - the results will come! Think about how far you've already come! 🌟",
        "Focus on progress, not perfection. Every workout makes you stronger! 🏋️‍♀️",
        "You're stronger than you think! Push through this moment, and you'll be proud you did! 💫",
        "Every workout is a victory! Keep going, you've got this! 🎯"
    ],
    "general": {
        "hi": "Hey there! 👋 I'm your fitness buddy! I can help with workout plans, nutrition advice, exercise form, and motivation. What would you like to know?",
        "help": "I'm here to help! I can assist with: \n\n1) Workout plans (beginner/intermediate/advanced) \n2) Nutrition advice \n3) Exercise form \n4) Motivation \n\nJust ask about any of these topics, and I'll guide you! 💪",
        "thanks": "You're welcome! Keep up the amazing work on your fitness journey! Remember, I'm here whenever you need help! 🌟",
        "bye": "Take care! Remember to stay active and healthy! Come back anytime you need fitness advice! 👋"
    }
}

def get_fitness_response(message: str) -> str:
    message = message.lower()
    
    # Check for general greetings and help
    if any(word in message for word in ["hi", "hello", "hey"]):
        return FITNESS_RESPONSES["general"]["hi"]
    if "help" in message:
        return FITNESS_RESPONSES["general"]["help"]
    if any(word in message for word in ["thanks", "thank you"]):
        return FITNESS_RESPONSES["general"]["thanks"]
    if any(word in message for word in ["bye", "goodbye"]):
        return FITNESS_RESPONSES["general"]["bye"]
    
    # Check for workout level
    if any(word in message for word in ["beginner", "start", "new", "first time"]):
        return FITNESS_RESPONSES["workout"]["beginner"]
    if "intermediate" in message:
        return FITNESS_RESPONSES["workout"]["intermediate"]
    if "advanced" in message:
        return FITNESS_RESPONSES["workout"]["advanced"]
    
    # Check for nutrition goals
    if any(phrase in message for phrase in ["lose weight", "weight loss", "burn fat", "slim down"]):
        return FITNESS_RESPONSES["nutrition"]["weight_loss"]
    if any(phrase in message for phrase in ["gain muscle", "build muscle", "get stronger", "bulk up"]):
        return FITNESS_RESPONSES["nutrition"]["muscle_gain"]
    if any(word in message for word in ["maintain", "maintenance", "stay same"]):
        return FITNESS_RESPONSES["nutrition"]["maintenance"]
    
    # Check for form questions
    if "squat" in message and any(word in message for word in ["form", "how to", "proper", "correct"]):
        return FITNESS_RESPONSES["form"]["squat"]
    if "deadlift" in message and any(word in message for word in ["form", "how to", "proper", "correct"]):
        return FITNESS_RESPONSES["form"]["deadlift"]
    if any(word in message for word in ["push", "pushup", "push-up"]) and any(word in message for word in ["form", "how to", "proper", "correct"]):
        return FITNESS_RESPONSES["form"]["pushup"]
    
    # Check for motivation
    if any(word in message for word in ["motivation", "tired", "hard", "difficult", "can't", "cannot", "don't want"]):
        import random
        return random.choice(FITNESS_RESPONSES["motivation"])
    
    # If no specific match, provide a helpful default response
    return "I can help you with: 1) Workout plans (beginner/intermediate/advanced) 2) Nutrition advice 3) Exercise form 4) Motivation. Just ask about any of these topics!"

@app.post("/api/chat", response_model=ChatResponse)
async def chat(message: ChatMessage):
    try:
        # Debug: Print the incoming message
        print("Received message:", message.message)
        
        # Get response from local fitness knowledge base
        response = get_fitness_response(message.message)
        
        # Debug: Print successful response
        print("Generated response successfully!")
        
        return ChatResponse(response=response)

    except Exception as e:
        # Debug: Print the error
        print("Error generating response:", str(e))
        
        # Fallback to simple responses if something goes wrong
        msg = message.message.lower()
        response = FITNESS_RESPONSES["motivation"][0]
        for key in FITNESS_RESPONSES:
            if key in msg:
                response = FITNESS_RESPONSES[key]
                break
        return ChatResponse(response=response)

# Weather models
class WeatherResponse(BaseModel):
    temperature: float
    description: str
    icon: str
    city: str
    time: str

@app.get("/api/weather", response_model=WeatherResponse)
async def get_weather(lat: float, lon: float):
    try:
        # Get current time
        current_time = datetime.now().strftime("%I:%M %p")
        
        # Get weather data
        params = {
            "lat": lat,
            "lon": lon,
            "appid": WEATHER_API_KEY,
            "units": "metric"  # For Celsius
        }
        
        response = requests.get(WEATHER_BASE_URL, params=params)
        data = response.json()
        
        # Debug print
        print("Weather API response:", data)
        
        if response.status_code == 200:
            return WeatherResponse(
                temperature=round(data["main"]["temp"]),
                description=data["weather"][0]["description"],
                icon=data["weather"][0]["icon"],
                city=data["name"],
                time=current_time
            )
        else:
            raise HTTPException(status_code=500, detail=f"Weather data not available: {data}")
            
    except Exception as e:
        print("Weather fetch error:", str(e))
        raise HTTPException(status_code=500, detail=str(e))

class Recommendation(BaseModel):
    day: str
    exercise: str
    sets: int
    reps: int
    rest_time: int
    notes: str = ""

@app.get("/api/recommendations")
async def get_recommendations(current_user: User = Depends(get_current_active_user)):
    profiles = get_profiles()
    profile = profiles.get(current_user.username, {})
    # Use the first goal as the main category, fallback to 'Upper Body'
    category = (profile.get('goals') or ['Upper Body'])[0]
    # Map common goal names to categories
    category_map = {
        'Weight Loss': 'Full Body',
        'Muscle Gain': 'Upper Body',
        'Endurance': 'Lower Body',
        'Flexibility': 'Core',
        'General Fitness': 'Full Body',
    }
    category = category_map.get(category, category)
    exercises = EXERCISE_CATEGORIES.get(category, EXERCISE_CATEGORIES['Upper Body'])
    # Generate a 7-day plan, rotating through exercises
    plan = []
    for i in range(7):
        exercise = exercises[i % len(exercises)]
        plan.append({
            'day': f'Day {i+1}',
            'exercise': exercise,
            'sets': 3,
            'reps': 12,
            'rest_time': 60,
            'notes': f'Focus on form and control for {exercise.replace("_", " ")}.'
        })
    return plan
