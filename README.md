# Fitness Web App

A modern, interactive fitness web application that provides personalized workout and nutrition recommendations, an exercise library, AI chatbot, weather widget, and more.

## Features

- **User Profile**: Enter your weight, height, age, gender, goals, experience, and medical conditions
- **Personalized Recommendations**: Get a one-week plan with daily exercises and Indian meal suggestions, tailored to your profile and goals
- **Exercise Library**: Browse exercises by category and view detailed instructions
- **AI Chatbot**: Floating chatbot for fitness Q&A (rule-based, no external API required)
- **Weather Widget**: See real-time weather and time in the app
- **Modern UI/UX**: Beautiful, responsive design with Material-UI, glassmorphism, and animated buttons
- **Local Profile Storage**: Your profile is saved in your browser for seamless experience

## Project Structure

```
AI/
├── backend/                # FastAPI backend (authentication, recommendations API)
├── frontend/               # React frontend (user interface)
│   ├── src/components/     # React components
│   ├── src/data/           # Exercise and meal data
│   └── ...
├── data/                   # (Optional) Data for ML/AI
└── README.md               # This file
```

## Setup Instructions

### Backend (FastAPI)
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend (React)
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React app:
   ```bash
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage
- Sign up or log in
- Complete your profile
- Get personalized recommendations for workouts and Indian meals
- Explore the exercise library
- Chat with the AI assistant
- Check the weather and time

## Contributing
Pull requests and suggestions are welcome! 
