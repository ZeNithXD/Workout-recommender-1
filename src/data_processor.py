"""
Data processing module for the workout recommender.
Handles loading, cleaning, and preprocessing of exercise data.
"""

import pandas as pd
import numpy as np
from pathlib import Path
from typing import Dict, List, Optional

class ExerciseDataProcessor:
    def __init__(self, data_dir: str = "../data"):
        """
        Initialize the data processor.
        
        Args:
            data_dir (str): Path to the data directory
        """
        self.data_dir = Path(data_dir)
        self.raw_data = None
        self.processed_data = None
    
    def load_raw_data(self, file_path: str) -> pd.DataFrame:
        """
        Load raw exercise data from a file.
        
        Args:
            file_path (str): Path to the raw data file
            
        Returns:
            pd.DataFrame: Loaded data
        """
        file_path = self.data_dir / "raw" / file_path
        try:
            self.raw_data = pd.read_csv(file_path)
            return self.raw_data
        except Exception as e:
            print(f"Error loading data: {e}")
            return None
    
    def preprocess_data(self) -> pd.DataFrame:
        """
        Preprocess the raw exercise data.
        
        Returns:
            pd.DataFrame: Processed data
        """
        if self.raw_data is None:
            raise ValueError("No raw data loaded. Call load_raw_data first.")
        
        # Basic preprocessing steps
        df = self.raw_data.copy()
        
        # Remove duplicates
        df = df.drop_duplicates()
        
        # Handle missing values
        df = df.fillna(method='ffill')
        
        # Convert categorical variables
        categorical_columns = df.select_dtypes(include=['object']).columns
        for col in categorical_columns:
            df[col] = df[col].astype('category')
        
        self.processed_data = df
        return df
    
    def save_processed_data(self, filename: str) -> None:
        """
        Save processed data to a file.
        
        Args:
            filename (str): Name of the output file
        """
        if self.processed_data is None:
            raise ValueError("No processed data available. Call preprocess_data first.")
        
        output_path = self.data_dir / "processed" / filename
        self.processed_data.to_csv(output_path, index=False)
        print(f"Processed data saved to {output_path}") 