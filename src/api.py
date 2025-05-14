from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
from pathlib import Path
import re
from .data_processor import ExerciseDataProcessor
from .recommender import WorkoutRecommender

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
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