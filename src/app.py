import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import re
from data_processor import ExerciseDataProcessor
from recommender import WorkoutRecommender

st.title("AI Workout Recommender 💪")

st.write("""
Upload a MetaMotion accelerometer or gyroscope CSV file, preview the data, set your preferences, and get workout recommendations based on your sensor data!
""")

# File uploader
data_file = st.file_uploader("Upload a MetaMotion CSV file", type=["csv"])

if data_file:
    # Read uploaded file into DataFrame
    df = pd.read_csv(data_file)
    
    # Determine data type (accelerometer or gyroscope)
    file_name = data_file.name
    is_gyroscope = "Gyroscope" in file_name
    data_type = "Gyroscope (deg/s)" if is_gyroscope else "Accelerometer (g)"
    
    st.subheader(f"Raw Data Preview ({data_type})")
    st.dataframe(df.head())

    # Preprocess data
    processor = ExerciseDataProcessor()
    processor.raw_data = df
    processed_data = processor.preprocess_data()

    st.subheader("Processed Data Info")
    st.dataframe(processed_data.describe())

    # Get axis names based on file type
    # For accelerometer: x-axis (g), y-axis (g), z-axis (g)
    # For gyroscope: x-axis (deg/s), y-axis (deg/s), z-axis (deg/s)
    axis_columns = [col for col in processed_data.columns if 'axis' in col]
    
    # Visualization: Plot x, y, z axes over time
    st.subheader(f"Sensor Data Visualization ({data_type})")
    
    # Main visualization
    fig, ax = plt.subplots(figsize=(10, 4))
    for col in axis_columns:
        ax.plot(processed_data['elapsed (s)'], processed_data[col], label=col)
    
    ax.set_xlabel('Elapsed (s)')
    y_label = "Angular Velocity (deg/s)" if is_gyroscope else "Acceleration (g)"
    ax.set_ylabel(y_label)
    ax.legend()
    st.pyplot(fig)
    
    # Add exercise activity detection visualization (simple thresholding)
    st.subheader("Activity Detection")
    
    # Calculate magnitude of movement (vector magnitude)
    magnitude = np.sqrt(np.sum(processed_data[axis_columns].pow(2), axis=1))
    
    # Detect potential exercise movements using a simple threshold
    threshold = np.percentile(magnitude, 75)  # Use 75th percentile as threshold
    activity_detected = magnitude > threshold
    
    # Plot magnitude with highlighted active periods
    fig2, ax2 = plt.subplots(figsize=(10, 4))
    ax2.plot(processed_data['elapsed (s)'], magnitude, label='Movement Magnitude')
    ax2.axhline(y=threshold, color='r', linestyle='--', label='Activity Threshold')
    
    # Highlight regions with activity
    activity_regions = []
    in_activity = False
    start_idx = 0
    
    for i, is_active in enumerate(activity_detected):
        if is_active and not in_activity:
            in_activity = True
            start_idx = i
        elif not is_active and in_activity:
            in_activity = False
            activity_regions.append((start_idx, i))
    
    # Add the last region if we ended in an activity
    if in_activity:
        activity_regions.append((start_idx, len(activity_detected)-1))
    
    # Highlight activity regions
    for start, end in activity_regions:
        ax2.axvspan(processed_data['elapsed (s)'].iloc[start], 
                    processed_data['elapsed (s)'].iloc[end], 
                    alpha=0.3, color='green')
    
    ax2.set_xlabel('Elapsed (s)')
    ax2.set_ylabel('Movement Magnitude')
    ax2.legend()
    st.pyplot(fig2)
    
    # Get exercise name from filename
    match = re.search(r'([A-Z]-[a-z]+-[a-z]+\d*-?[a-z]*\d*)', file_name)
    if match:
        exercise_name = match.group(1)
        st.info(f"Detected Exercise: {exercise_name}")

    # User preferences input
    st.subheader(f"Set Your Preferences ({data_type} values)")
    
    user_preferences = {}
    for col in axis_columns:
        value = st.number_input(col, value=float(processed_data[col].iloc[0]))
        user_preferences[col] = value

    # Run recommender
    recommender = WorkoutRecommender()
    recommender.load_data(processed_data)
    recommendations = recommender.get_recommendations(user_preferences, n_recommendations=5)

    st.subheader("Top 5 Recommendations (Most Similar Sensor Patterns)")
    for i, rec in enumerate(recommendations, 1):
        st.write(f"**Recommendation {i}:**")
        st.json(rec)
else:
    st.info("Please upload a MetaMotion CSV file to get started.") 