import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
from data_processor import ExerciseDataProcessor
from recommender import WorkoutRecommender

st.title("AI Workout Recommender 💪")

st.write("""
Upload a MetaMotion accelerometer CSV file, preview the data, set your preferences, and get workout recommendations based on your sensor data!
""")

# File uploader
data_file = st.file_uploader("Upload a MetaMotion Accelerometer CSV", type=["csv"])

if data_file:
    # Read uploaded file into DataFrame
    df = pd.read_csv(data_file)
    st.subheader("Raw Data Preview")
    st.dataframe(df.head())

    # Preprocess data
    processor = ExerciseDataProcessor()
    processor.raw_data = df
    processed_data = processor.preprocess_data()

    st.subheader("Processed Data Info")
    st.dataframe(processed_data.describe())

    # Visualization: Plot x, y, z axes over time
    st.subheader("Sensor Data Visualization (x, y, z over time)")
    fig, ax = plt.subplots(figsize=(10, 4))
    ax.plot(processed_data['elapsed (s)'], processed_data['x-axis (g)'], label='x-axis (g)')
    ax.plot(processed_data['elapsed (s)'], processed_data['y-axis (g)'], label='y-axis (g)')
    ax.plot(processed_data['elapsed (s)'], processed_data['z-axis (g)'], label='z-axis (g)')
    ax.set_xlabel('Elapsed (s)')
    ax.set_ylabel('Acceleration (g)')
    ax.legend()
    st.pyplot(fig)

    # User preferences input
    st.subheader("Set Your Preferences (x, y, z axis values)")
    x_val = st.number_input("x-axis (g)", value=float(processed_data['x-axis (g)'].iloc[0]))
    y_val = st.number_input("y-axis (g)", value=float(processed_data['y-axis (g)'].iloc[0]))
    z_val = st.number_input("z-axis (g)", value=float(processed_data['z-axis (g)'].iloc[0]))
    user_preferences = {
        'x-axis (g)': x_val,
        'y-axis (g)': y_val,
        'z-axis (g)': z_val
    }

    # Run recommender
    recommender = WorkoutRecommender()
    recommender.load_data(processed_data)
    recommendations = recommender.get_recommendations(user_preferences, n_recommendations=5)

    st.subheader("Top 5 Recommendations (Most Similar Rows)")
    for i, rec in enumerate(recommendations, 1):
        st.write(f"**Recommendation {i}:**")
        st.json(rec)
else:
    st.info("Please upload a MetaMotion CSV file to get started.") 