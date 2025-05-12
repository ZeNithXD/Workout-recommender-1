"""
Workout recommendation engine module.
Implements the core recommendation logic for personalized workout plans.
"""

import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Dict, Optional

class WorkoutRecommender:
    def __init__(self):
        """
        Initialize the workout recommender.
        """
        self.exercise_data = None
        self.scaler = StandardScaler()
        self.feature_matrix = None
        self.feature_columns = None  # Store the columns used for similarity
    
    def load_data(self, data: pd.DataFrame) -> None:
        """
        Load and prepare exercise data for recommendations.
        
        Args:
            data (pd.DataFrame): Processed exercise data
        """
        self.exercise_data = data
        # Prepare feature matrix for similarity calculations
        self._prepare_features()
    
    def _prepare_features(self) -> None:
        """
        Prepare feature matrix for similarity calculations.
        """
        if self.exercise_data is None:
            raise ValueError("No data loaded. Call load_data first.")
        
        # Select numerical features for similarity calculation
        self.feature_columns = self.exercise_data.select_dtypes(include=[np.number]).columns.tolist()
        self.feature_matrix = self.exercise_data[self.feature_columns].copy()
        
        # Scale features
        self.feature_matrix = self.scaler.fit_transform(self.feature_matrix)
    
    def _calculate_bmi(self, weight: float, height: float) -> float:
        """
        Calculate BMI from weight (kg) and height (cm).
        """
        height_m = height / 100
        return weight / (height_m * height_m)
    
    def _adjust_recommendations_for_profile(self, recommendations: List[Dict], user_profile: Dict) -> List[Dict]:
        """
        Adjust recommendations based on user profile information.
        """
        bmi = self._calculate_bmi(user_profile['weight'], user_profile['height'])
        
        for rec in recommendations:
            # Add profile-based adjustments
            rec['profile_adjustments'] = {
                'bmi': bmi,
                'age_appropriate': user_profile['age'] >= 18,  # Basic age check
                'experience_level': user_profile['experience'],
                'goals': user_profile['goals']
            }
            
            # Add personalized notes based on profile
            notes = []
            
            # BMI-based notes
            if bmi < 18.5:
                notes.append("Consider focusing on strength training and muscle building exercises.")
            elif bmi > 25:
                notes.append("Consider incorporating more cardio and endurance exercises.")
            
            # Age-based notes
            if user_profile['age'] > 50:
                notes.append("Focus on low-impact exercises and proper form.")
            
            # Experience-based notes
            if user_profile['experience'] == "Beginner":
                notes.append("Start with basic exercises and focus on proper form.")
            elif user_profile['experience'] == "Advanced":
                notes.append("You can handle more intense and complex exercises.")
            
            # Goal-based notes
            if "Weight Loss" in user_profile['goals']:
                notes.append("Include high-intensity interval training (HIIT) in your routine.")
            if "Muscle Gain" in user_profile['goals']:
                notes.append("Focus on progressive overload and compound exercises.")
            if "Flexibility" in user_profile['goals']:
                notes.append("Include stretching and mobility exercises.")
            
            rec['personalized_notes'] = notes
        
        return recommendations
    
    def get_recommendations(self, 
                          user_preferences: Dict,
                          n_recommendations: int = 5) -> List[Dict]:
        """
        Generate workout recommendations based on user preferences and profile.
        
        Args:
            user_preferences (Dict): User's exercise preferences and profile information
            n_recommendations (int): Number of recommendations to generate
            
        Returns:
            List[Dict]: List of recommended exercises with personalized adjustments
        """
        if self.exercise_data is None:
            raise ValueError("No data loaded. Call load_data first.")
        
        # Extract profile information
        profile_info = {
            'weight': user_preferences.pop('weight', None),
            'height': user_preferences.pop('height', None),
            'age': user_preferences.pop('age', None),
            'gender': user_preferences.pop('gender', None),
            'goals': user_preferences.pop('goals', []),
            'experience': user_preferences.pop('experience', 'Beginner')
        }
        
        # Convert remaining user preferences to feature vector
        user_vector = self._create_user_vector(user_preferences)
        
        # Calculate similarity scores
        similarities = cosine_similarity([user_vector], self.feature_matrix)[0]
        
        # Get top N recommendations
        top_indices = np.argsort(similarities)[-n_recommendations:][::-1]
        
        recommendations = []
        for idx in top_indices:
            exercise = self.exercise_data.iloc[idx].to_dict()
            recommendations.append({
                'exercise': exercise,
                'similarity_score': similarities[idx]
            })
        
        # Apply profile-based adjustments
        if all(v is not None for v in profile_info.values()):
            recommendations = self._adjust_recommendations_for_profile(recommendations, profile_info)
        
        return recommendations
    
    def _create_user_vector(self, preferences: Dict) -> np.ndarray:
        """
        Convert user preferences to a feature vector matching the feature matrix columns.
        
        Args:
            preferences (Dict): User's exercise preferences
            
        Returns:
            np.ndarray: Feature vector representing user preferences
        """
        # Ensure the user vector matches the feature matrix columns
        user_vector = []
        for col in self.feature_columns:
            user_vector.append(preferences.get(col, 0))  # Default to 0 if not provided
        return np.array(user_vector) 