from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
from pathlib import Path
import re
from .data_processor import ExerciseDataProcessor
from .recommender import WorkoutRecommender
import json
import os
from datetime import datetime, timedelta

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class UserProfile(BaseModel):
    weight: float
    height: float
    age: int
    gender: str
    goals: List[str]
    experience: str
    medical_conditions: Optional[str] = None

class ExerciseData(BaseModel):
    name: str
    category: str
    accelerometer_data: Optional[dict] = None
    gyroscope_data: Optional[dict] = None

# Exercise categories (same as in the original app)
EXERCISE_CATEGORIES = {
    "Upper Body - Push": [
        "bench", "ohp", "pushup", "dip", "incline_bench", "decline_bench",
        "shoulder_press", "lateral_raise", "front_raise", "tricep_extension",
        "tricep_pushdown"
    ],
    "Upper Body - Pull": [
        "row", "pullup", "chinup", "lat_pulldown", "face_pull", "bicep_curl",
        "hammer_curl", "preacher_curl", "reverse_curl", "shrug", "upright_row"
    ],
    "Lower Body": [
        "squat", "deadlift", "lunge", "leg_press", "leg_extension", "leg_curl",
        "calf_raise", "hip_thrust", "bulgarian_split_squat", "step_up",
        "romanian_deadlift"
    ],
    "Core": [
        "crunch", "plank", "russian_twist", "leg_raise", "cable_woodchop",
        "ab_wheel_rollout", "hanging_leg_raise", "cable_crunch", "side_plank",
        "reverse_crunch"
    ],
    "Full Body": [
        "clean", "snatch", "thruster", "burpee", "kettlebell_swing",
        "medicine_ball_slam", "wall_ball", "box_jump", "jumping_jack",
        "mountain_climber"
    ]
}

def get_available_exercises():
    """Get list of available exercises from the data directory"""
    data_dir = Path("data/raw/MetaMotion")
    exercises = set()
    
    for file in data_dir.glob("*.csv"):
        match = re.search(r'[A-Z]-([a-z]+)-', file.name)
        if match:
            exercise = match.group(1)
            exercises.add(exercise)
    
    return sorted(list(exercises))

def load_exercise_data(exercise_name: str):
    """Load both accelerometer and gyroscope data for a given exercise"""
    data_dir = Path("data/raw/MetaMotion")
    exercise_files = list(data_dir.glob(f"*{exercise_name}*.csv"))
    
    if not exercise_files:
        return None, None
    
    accel_files = [f for f in exercise_files if "Accelerometer" in f.name]
    gyro_files = [f for f in exercise_files if "Gyroscope" in f.name]
    
    if not accel_files or not gyro_files:
        return None, None
    
    accel_data = pd.read_csv(accel_files[-1])
    gyro_data = pd.read_csv(gyro_files[-1])
    
    return accel_data, gyro_data

@app.get("/api/exercises/categories")
async def get_exercise_categories():
    """Get all exercise categories"""
    return EXERCISE_CATEGORIES

@app.get("/api/exercises/available")
async def get_available_exercises_endpoint():
    """Get list of available exercises"""
    return get_available_exercises()

@app.get("/api/exercises/{exercise_name}")
async def get_exercise_data(exercise_name: str):
    """Get exercise data for a specific exercise"""
    accel_data, gyro_data = load_exercise_data(exercise_name)
    
    if accel_data is None or gyro_data is None:
        raise HTTPException(status_code=404, detail="Exercise data not found")
    
    # Process the data
    processor_accel = ExerciseDataProcessor()
    processor_accel.raw_data = accel_data
    processed_accel = processor_accel.preprocess_data()
    
    processor_gyro = ExerciseDataProcessor()
    processor_gyro.raw_data = gyro_data
    processed_gyro = processor_gyro.preprocess_data()
    
    return {
        "accelerometer": processed_accel.to_dict(orient="records"),
        "gyroscope": processed_gyro.to_dict(orient="records")
    }

@app.post("/api/recommendations")
async def get_recommendations(profile: UserProfile):
    """Get workout recommendations based on user profile"""
    recommender = WorkoutRecommender()
    recommendations = recommender.get_recommendations(
        weight=profile.weight,
        height=profile.height,
        age=profile.age,
        gender=profile.gender,
        goals=profile.goals,
        experience=profile.experience,
        medical_conditions=profile.medical_conditions
    )
    return recommendations

# Create data directory if it doesn't exist
DATA_DIR = Path("data")
PROFILE_FILE = DATA_DIR / "user_profile.json"

# Ensure data directory exists
DATA_DIR.mkdir(exist_ok=True)

@app.post("/api/profile")
async def save_profile(profile: UserProfile):
    try:
        # Save profile data to file
        with open(PROFILE_FILE, 'w') as f:
            json.dump(profile.dict(), f)
        return {"message": "Profile saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/profile")
async def get_profile():
    try:
        if PROFILE_FILE.exists():
            with open(PROFILE_FILE, 'r') as f:
                profile_data = json.load(f)
            return profile_data
        else:
            raise HTTPException(status_code=404, detail="No profile found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

SECRET_KEY = "your-secret-key"  # Change this in production!
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

USERS_FILE = Path("data/users.json")
USERS_FILE.parent.mkdir(exist_ok=True)

def load_users():
    if USERS_FILE.exists():
        with open(USERS_FILE, "r") as f:
            return json.load(f)
    return {}

def save_users(users):
    with open(USERS_FILE, "w") as f:
        json.dump(users, f)

class User(BaseModel):
    username: str
    password: str

class Profile(BaseModel):
    weight: float
    height: float
    age: int
    gender: str
    goals: List[str]
    experience: str
    medical_conditions: Optional[str] = None

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        users = load_users()
        if username not in users:
            raise HTTPException(status_code=401, detail="User not found")
        return username
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/api/signup")
def signup(user: User):
    users = load_users()
    if user.username in users:
        raise HTTPException(status_code=400, detail="Username already exists")
    users[user.username] = {
        "password": get_password_hash(user.password),
        "profile": None
    }
    save_users(users)
    return {"message": "User created successfully"}

@app.post("/api/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    users = load_users()
    user = users.get(form_data.username)
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    access_token = create_access_token(data={"sub": form_data.username}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/profile")
def get_profile(current_user: str = Depends(get_current_user)):
    users = load_users()
    profile = users[current_user].get("profile")
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@app.post("/api/profile")
def set_profile(profile: Profile, current_user: str = Depends(get_current_user)):
    users = load_users()
    users[current_user]["profile"] = profile.dict()
    save_users(users)
    return {"message": "Profile saved successfully"}

if __name__ == '__main__':
    app.run(debug=True) 