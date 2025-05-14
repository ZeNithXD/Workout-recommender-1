from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from datetime import timedelta
from typing import Optional, Dict, List
from pydantic import BaseModel
import json
import os

from auth import (
    User, UserInDB, Token, authenticate_user, create_access_token,
    get_current_active_user, get_password_hash, get_users, save_users,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

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

# Keep your existing exercise and recommendation endpoints here
