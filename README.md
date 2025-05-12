# AI Workout Recommender

This project uses artificial intelligence to recommend personalized workout routines based on user data and exercise information.

## Project Structure

```
AI/
├── data/
│   ├── raw/          # Original, immutable data
│   ├── processed/    # Cleaned and processed data
│   ├── interim/      # Intermediate data
│   └── external/     # External data sources
├── src/              # Source code
├── notebooks/        # Jupyter notebooks
├── models/           # Trained models
└── requirements.txt  # Project dependencies
```

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Data

The project uses exercise data stored in the `data/raw` directory. The data is organized into different categories for raw, processed, and intermediate data.

## Features

- Exercise recommendation based on user preferences
- Personalized workout plans
- Exercise difficulty classification
- Workout intensity optimization

## Contributing

Feel free to contribute to this project by submitting issues or pull requests. 