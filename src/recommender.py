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
    
    def get_recommendations(self, 
                          user_preferences: Dict,
                          n_recommendations: int = 5) -> List[Dict]:
        """
        Generate workout recommendations based on user preferences.
        
        Args:
            user_preferences (Dict): User's exercise preferences and constraints
            n_recommendations (int): Number of recommendations to generate
            
        Returns:
            List[Dict]: List of recommended exercises
        """
        if self.exercise_data is None:
            raise ValueError("No data loaded. Call load_data first.")
        
        # Convert user preferences to feature vector
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