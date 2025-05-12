import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import re
import os
from pathlib import Path
from data_processor import ExerciseDataProcessor
from recommender import WorkoutRecommender

# Initialize session state for user data
if 'user_profile' not in st.session_state:
    st.session_state.user_profile = None

# Define exercise categories and their exercises
EXERCISE_CATEGORIES = {
    "Upper Body - Push": [
        "bench",  # Bench Press
        "ohp",    # Overhead Press
        "pushup", # Push-ups
        "dip",    # Dips
        "incline_bench", # Incline Bench Press
        "decline_bench", # Decline Bench Press
        "shoulder_press", # Shoulder Press
        "lateral_raise", # Lateral Raises
        "front_raise",   # Front Raises
        "tricep_extension", # Tricep Extensions
        "tricep_pushdown",  # Tricep Pushdowns
    ],
    "Upper Body - Pull": [
        "row",    # Barbell Rows
        "pullup", # Pull-ups
        "chinup", # Chin-ups
        "lat_pulldown", # Lat Pulldowns
        "face_pull", # Face Pulls
        "bicep_curl", # Bicep Curls
        "hammer_curl", # Hammer Curls
        "preacher_curl", # Preacher Curls
        "reverse_curl", # Reverse Curls
        "shrug", # Shrugs
        "upright_row", # Upright Rows
    ],
    "Lower Body": [
        "squat",  # Squats
        "deadlift", # Deadlifts
        "lunge",  # Lunges
        "leg_press", # Leg Press
        "leg_extension", # Leg Extensions
        "leg_curl", # Leg Curls
        "calf_raise", # Calf Raises
        "hip_thrust", # Hip Thrusts
        "bulgarian_split_squat", # Bulgarian Split Squats
        "step_up", # Step-ups
        "romanian_deadlift", # Romanian Deadlifts
    ],
    "Core": [
        "crunch", # Crunches
        "plank",  # Planks
        "russian_twist", # Russian Twists
        "leg_raise", # Leg Raises
        "cable_woodchop", # Cable Woodchops
        "ab_wheel_rollout", # Ab Wheel Rollouts
        "hanging_leg_raise", # Hanging Leg Raises
        "cable_crunch", # Cable Crunches
        "side_plank", # Side Planks
        "reverse_crunch", # Reverse Crunches
    ],
    "Full Body": [
        "clean", # Power Cleans
        "snatch", # Snatches
        "thruster", # Thrusters
        "burpee", # Burpees
        "kettlebell_swing", # Kettlebell Swings
        "medicine_ball_slam", # Medicine Ball Slams
        "wall_ball", # Wall Balls
        "box_jump", # Box Jumps
        "jumping_jack", # Jumping Jacks
        "mountain_climber", # Mountain Climbers
    ]
}

def get_available_exercises():
    """Get list of available exercises from the data directory"""
    data_dir = Path("data/raw/MetaMotion")
    exercises = set()
    
    for file in data_dir.glob("*.csv"):
        # Extract exercise name from filename (e.g., "A-bench-heavy2" -> "bench")
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
    
    # Find the most recent files for this exercise
    accel_files = [f for f in exercise_files if "Accelerometer" in f.name]
    gyro_files = [f for f in exercise_files if "Gyroscope" in f.name]
    
    if not accel_files or not gyro_files:
        return None, None
    
    # Load the most recent files
    accel_data = pd.read_csv(accel_files[-1])
    gyro_data = pd.read_csv(gyro_files[-1])
    
    return accel_data, gyro_data

def collect_user_profile():
    """Collect user profile information"""
    st.subheader("👤 User Profile")
    
    # Basic Information
    st.write("Please provide your basic information:")
    weight = st.number_input("Weight (kg)", min_value=30.0, max_value=300.0, step=0.1)
    height = st.number_input("Height (cm)", min_value=100.0, max_value=250.0, step=0.1)
    age = st.number_input("Age", min_value=16, max_value=100, step=1)
    gender = st.selectbox("Gender", ["Male", "Female", "Other"])
    
    # Fitness Goals
    st.write("What are your fitness goals?")
    goals = st.multiselect(
        "Select your goals",
        ["Weight Loss", "Muscle Gain", "Endurance", "Flexibility", "General Fitness"],
        default=["General Fitness"]
    )
    
    # Experience Level
    experience = st.select_slider(
        "Fitness Experience Level",
        options=["Beginner", "Intermediate", "Advanced"],
        value="Beginner"
    )
    
    # Medical Conditions
    st.write("Do you have any medical conditions or injuries?")
    medical_conditions = st.text_area("Please list any medical conditions or injuries (if none, leave blank)")
    
    # Save profile
    if st.button("Save Profile"):
        st.session_state.user_profile = {
            "weight": weight,
            "height": height,
            "age": age,
            "gender": gender,
            "goals": goals,
            "experience": experience,
            "medical_conditions": medical_conditions
        }
        st.success("Profile saved successfully!")
        st.rerun()
    return False

# Main app
st.title("AI Workout Recommender 💪")

# Check if user profile exists
if st.session_state.user_profile is None:
    if collect_user_profile():
        st.rerun()
else:
    # Display user profile
    st.sidebar.subheader("👤 Your Profile")
    st.sidebar.write(f"**Weight:** {st.session_state.user_profile['weight']} kg")
    st.sidebar.write(f"**Height:** {st.session_state.user_profile['height']} cm")
    st.sidebar.write(f"**Age:** {st.session_state.user_profile['age']}")
    st.sidebar.write(f"**Gender:** {st.session_state.user_profile['gender']}")
    st.sidebar.write(f"**Goals:** {', '.join(st.session_state.user_profile['goals'])}")
    st.sidebar.write(f"**Experience:** {st.session_state.user_profile['experience']}")
    
    if st.sidebar.button("Edit Profile", key="edit_profile_sidebar"):
        st.session_state.user_profile = None
        st.rerun()

    st.write("""
    Select an exercise to analyze and get personalized recommendations based on your profile and exercise data!
    """)

    # Exercise selection with categories
    st.subheader("Select Exercise Category")
    selected_category = st.selectbox("Category", list(EXERCISE_CATEGORIES.keys()))
    
    # Get available exercises from data directory
    available_exercises = get_available_exercises()
    
    # Filter exercises in the selected category that have data available
    category_exercises = [ex for ex in EXERCISE_CATEGORIES[selected_category] if ex in available_exercises]
    
    if not category_exercises:
        st.warning(f"No data available for exercises in the {selected_category} category.")
        st.info("Available exercises with data:")
        st.write(", ".join(available_exercises))
    else:
        selected_exercise = st.selectbox("Select Exercise", category_exercises)
        
        if selected_exercise:
            # Load exercise data
            accel_data, gyro_data = load_exercise_data(selected_exercise)
            
            if accel_data is not None and gyro_data is not None:
                # Process accelerometer data
                st.subheader("Accelerometer Data Analysis")
                processor_accel = ExerciseDataProcessor()
                processor_accel.raw_data = accel_data
                processed_accel = processor_accel.preprocess_data()
                
                # Process gyroscope data
                st.subheader("Gyroscope Data Analysis")
                processor_gyro = ExerciseDataProcessor()
                processor_gyro.raw_data = gyro_data
                processed_gyro = processor_gyro.preprocess_data()

                # Display data previews
                col1, col2 = st.columns(2)
                with col1:
                    st.write("Accelerometer Data Preview")
                    st.dataframe(processed_accel.head())
                with col2:
                    st.write("Gyroscope Data Preview")
                    st.dataframe(processed_gyro.head())

                # Visualizations
                st.subheader("Sensor Data Visualization")
                
                # Accelerometer visualization
                fig1, ax1 = plt.subplots(figsize=(10, 4))
                accel_columns = [col for col in processed_accel.columns if 'axis' in col]
                for col in accel_columns:
                    ax1.plot(processed_accel['elapsed (s)'], processed_accel[col], label=col)
                ax1.set_xlabel('Elapsed (s)')
                ax1.set_ylabel('Acceleration (g)')
                ax1.set_title('Accelerometer Data')
                ax1.legend()
                st.pyplot(fig1)
                
                # Gyroscope visualization
                fig2, ax2 = plt.subplots(figsize=(10, 4))
                gyro_columns = [col for col in processed_gyro.columns if 'axis' in col]
                for col in gyro_columns:
                    ax2.plot(processed_gyro['elapsed (s)'], processed_gyro[col], label=col)
                ax2.set_xlabel('Elapsed (s)')
                ax2.set_ylabel('Angular Velocity (deg/s)')
                ax2.set_title('Gyroscope Data')
                ax2.legend()
                st.pyplot(fig2)

                # Activity detection
                st.subheader("Activity Detection")
                
                # Calculate magnitude for both sensors
                accel_magnitude = np.sqrt(np.sum(processed_accel[accel_columns].pow(2), axis=1))
                gyro_magnitude = np.sqrt(np.sum(processed_gyro[gyro_columns].pow(2), axis=1))
                
                # Detect potential exercise movements
                accel_threshold = np.percentile(accel_magnitude, 75)
                gyro_threshold = np.percentile(gyro_magnitude, 75)
                
                # Plot magnitudes with highlighted active periods
                fig3, (ax3, ax4) = plt.subplots(2, 1, figsize=(10, 8))
                
                # Accelerometer activity
                ax3.plot(processed_accel['elapsed (s)'], accel_magnitude, label='Movement Magnitude')
                ax3.axhline(y=accel_threshold, color='r', linestyle='--', label='Activity Threshold')
                ax3.set_xlabel('Elapsed (s)')
                ax3.set_ylabel('Acceleration Magnitude')
                ax3.set_title('Accelerometer Activity')
                ax3.legend()
                
                # Gyroscope activity
                ax4.plot(processed_gyro['elapsed (s)'], gyro_magnitude, label='Movement Magnitude')
                ax4.axhline(y=gyro_threshold, color='r', linestyle='--', label='Activity Threshold')
                ax4.set_xlabel('Elapsed (s)')
                ax4.set_ylabel('Angular Velocity Magnitude')
                ax4.set_title('Gyroscope Activity')
                ax4.legend()
                
                plt.tight_layout()
                st.pyplot(fig3)

                # Get recommendations
                st.subheader("Personalized Recommendations")
                
                # Combine user preferences with exercise data
                user_preferences = {
                    'weight': st.session_state.user_profile['weight'],
                    'height': st.session_state.user_profile['height'],
                    'age': st.session_state.user_profile['age'],
                    'gender': st.session_state.user_profile['gender'],
                    'goals': st.session_state.user_profile['goals'],
                    'experience': st.session_state.user_profile['experience']
                }
                
                # Add sensor data preferences
                for col in accel_columns:
                    user_preferences[f'accel_{col}'] = float(processed_accel[col].mean())
                for col in gyro_columns:
                    user_preferences[f'gyro_{col}'] = float(processed_gyro[col].mean())

                # Run recommender
                recommender = WorkoutRecommender()
                recommender.load_data(processed_accel)  # Use accelerometer data as base
                recommendations = recommender.get_recommendations(user_preferences, n_recommendations=5)

                st.subheader("Top 5 Recommendations")
                for i, rec in enumerate(recommendations, 1):
                    st.write(f"**Recommendation {i}:**")
                    st.json(rec)
            else:
                st.error(f"Could not load data for exercise: {selected_exercise}")
        else:
            st.info("Please select an exercise category to get started.")


# Initialize session state for user data
if 'user_profile' not in st.session_state:
    st.session_state.user_profile = None

def get_available_exercises():
    """Get list of available exercises from the data directory"""
    data_dir = Path("data/raw/MetaMotion")
    exercises = set()
    
    for file in data_dir.glob("*.csv"):
        # Extract exercise name from filename (e.g., "A-bench-heavy2" -> "bench")
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
    
    # Find the most recent files for this exercise
    accel_files = [f for f in exercise_files if "Accelerometer" in f.name]
    gyro_files = [f for f in exercise_files if "Gyroscope" in f.name]
    
    if not accel_files or not gyro_files:
        return None, None
    
    # Load the most recent files
    accel_data = pd.read_csv(accel_files[-1])
    gyro_data = pd.read_csv(gyro_files[-1])
    
    return accel_data, gyro_data

def collect_user_profile():
    """Collect user profile information"""
    st.subheader("👤 User Profile")
    
    # Basic Information
    st.write("Please provide your basic information:")
    weight = st.number_input("Weight (kg)", min_value=30.0, max_value=300.0, step=0.1)
    height = st.number_input("Height (cm)", min_value=100.0, max_value=250.0, step=0.1)
    age = st.number_input("Age", min_value=16, max_value=100, step=1)
    gender = st.selectbox("Gender", ["Male", "Female", "Other"])
    
    # Fitness Goals
    st.write("What are your fitness goals?")
    goals = st.multiselect(
        "Select your goals",
        ["Weight Loss", "Muscle Gain", "Endurance", "Flexibility", "General Fitness"],
        default=["General Fitness"]
    )
    
    # Experience Level
    experience = st.select_slider(
        "Fitness Experience Level",
        options=["Beginner", "Intermediate", "Advanced"],
        value="Beginner"
    )
    
    # Medical Conditions
    st.write("Do you have any medical conditions or injuries?")
    medical_conditions = st.text_area("Please list any medical conditions or injuries (if none, leave blank)")
    
    # Save profile
    if st.button("Save Profile"):
        st.session_state.user_profile = {
            "weight": weight,
            "height": height,
            "age": age,
            "gender": gender,
            "goals": goals,
            "experience": experience,
            "medical_conditions": medical_conditions
        }
        st.success("Profile saved successfully!")
        st.rerun()
    return False

# Main app
st.title("AI Workout Recommender 💪")

# Check if user profile exists
if st.session_state.user_profile is None:
    if collect_user_profile():
        st.rerun()
else:
    # Display user profile
    st.sidebar.subheader("👤 Your Profile")
    st.sidebar.write(f"**Weight:** {st.session_state.user_profile['weight']} kg")
    st.sidebar.write(f"**Height:** {st.session_state.user_profile['height']} cm")
    st.sidebar.write(f"**Age:** {st.session_state.user_profile['age']}")
    st.sidebar.write(f"**Gender:** {st.session_state.user_profile['gender']}")
    st.sidebar.write(f"**Goals:** {', '.join(st.session_state.user_profile['goals'])}")
    st.sidebar.write(f"**Experience:** {st.session_state.user_profile['experience']}")
    
    if st.sidebar.button("Edit Profile", key="edit_profile_sidebar"):
        st.session_state.user_profile = None
        st.rerun()

    st.write("""
    Select an exercise to analyze and get personalized recommendations based on your profile and exercise data!
    """)

    # Exercise selection
    available_exercises = get_available_exercises()
    selected_exercise = st.selectbox("Select Exercise", available_exercises)

    if selected_exercise:
        # Load exercise data
        accel_data, gyro_data = load_exercise_data(selected_exercise)
        
        if accel_data is not None and gyro_data is not None:
            # Process accelerometer data
            st.subheader("Accelerometer Data Analysis")
            processor_accel = ExerciseDataProcessor()
            processor_accel.raw_data = accel_data
            processed_accel = processor_accel.preprocess_data()
            
            # Process gyroscope data
            st.subheader("Gyroscope Data Analysis")
            processor_gyro = ExerciseDataProcessor()
            processor_gyro.raw_data = gyro_data
            processed_gyro = processor_gyro.preprocess_data()

            # Display data previews
            col1, col2 = st.columns(2)
            with col1:
                st.write("Accelerometer Data Preview")
                st.dataframe(processed_accel.head())
            with col2:
                st.write("Gyroscope Data Preview")
                st.dataframe(processed_gyro.head())

            # Visualizations
            st.subheader("Sensor Data Visualization")
            
            # Accelerometer visualization
            fig1, ax1 = plt.subplots(figsize=(10, 4))
            accel_columns = [col for col in processed_accel.columns if 'axis' in col]
            for col in accel_columns:
                ax1.plot(processed_accel['elapsed (s)'], processed_accel[col], label=col)
            ax1.set_xlabel('Elapsed (s)')
            ax1.set_ylabel('Acceleration (g)')
            ax1.set_title('Accelerometer Data')
            ax1.legend()
            st.pyplot(fig1)
            
            # Gyroscope visualization
            fig2, ax2 = plt.subplots(figsize=(10, 4))
            gyro_columns = [col for col in processed_gyro.columns if 'axis' in col]
            for col in gyro_columns:
                ax2.plot(processed_gyro['elapsed (s)'], processed_gyro[col], label=col)
            ax2.set_xlabel('Elapsed (s)')
            ax2.set_ylabel('Angular Velocity (deg/s)')
            ax2.set_title('Gyroscope Data')
            ax2.legend()
            st.pyplot(fig2)

            # Activity detection
            st.subheader("Activity Detection")
            
            # Calculate magnitude for both sensors
            accel_magnitude = np.sqrt(np.sum(processed_accel[accel_columns].pow(2), axis=1))
            gyro_magnitude = np.sqrt(np.sum(processed_gyro[gyro_columns].pow(2), axis=1))
            
            # Detect potential exercise movements
            accel_threshold = np.percentile(accel_magnitude, 75)
            gyro_threshold = np.percentile(gyro_magnitude, 75)
            
            # Plot magnitudes with highlighted active periods
            fig3, (ax3, ax4) = plt.subplots(2, 1, figsize=(10, 8))
            
            # Accelerometer activity
            ax3.plot(processed_accel['elapsed (s)'], accel_magnitude, label='Movement Magnitude')
            ax3.axhline(y=accel_threshold, color='r', linestyle='--', label='Activity Threshold')
            ax3.set_xlabel('Elapsed (s)')
            ax3.set_ylabel('Acceleration Magnitude')
            ax3.set_title('Accelerometer Activity')
            ax3.legend()
            
            # Gyroscope activity
            ax4.plot(processed_gyro['elapsed (s)'], gyro_magnitude, label='Movement Magnitude')
            ax4.axhline(y=gyro_threshold, color='r', linestyle='--', label='Activity Threshold')
            ax4.set_xlabel('Elapsed (s)')
            ax4.set_ylabel('Angular Velocity Magnitude')
            ax4.set_title('Gyroscope Activity')
            ax4.legend()
            
            plt.tight_layout()
            st.pyplot(fig3)

            # Get recommendations
            st.subheader("Personalized Recommendations")
            
            # Combine user preferences with exercise data
            user_preferences = {
                'weight': st.session_state.user_profile['weight'],
                'height': st.session_state.user_profile['height'],
                'age': st.session_state.user_profile['age'],
                'gender': st.session_state.user_profile['gender'],
                'goals': st.session_state.user_profile['goals'],
                'experience': st.session_state.user_profile['experience']
            }
            
            # Add sensor data preferences
            for col in accel_columns:
                user_preferences[f'accel_{col}'] = float(processed_accel[col].mean())
            for col in gyro_columns:
                user_preferences[f'gyro_{col}'] = float(processed_gyro[col].mean())

            # Run recommender
            recommender = WorkoutRecommender()
            recommender.load_data(processed_accel)  # Use accelerometer data as base
            recommendations = recommender.get_recommendations(user_preferences, n_recommendations=5)

            st.subheader("Top 5 Recommendations")
            for i, rec in enumerate(recommendations, 1):
                st.write(f"**Recommendation {i}:**")
                st.json(rec)
        else:
            st.error(f"Could not load data for exercise: {selected_exercise}")
    else:
        st.info("Please select an exercise to get started.") 