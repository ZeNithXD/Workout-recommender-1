import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Weather.css';

const Weather = () => {
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        fetchWeather(position.coords.latitude, position.coords.longitude);
                    },
                    (error) => {
                        setError('Unable to get your location');
                    }
                );
            } else {
                setError('Geolocation is not supported by your browser');
            }
        };

        const fetchWeather = async (lat, lon) => {
            try {
                const response = await axios.get(`http://localhost:8000/api/weather?lat=${lat}&lon=${lon}`);
                setWeather(response.data);
            } catch (error) {
                setError('Unable to fetch weather data');
            }
        };

        getLocation();
        // Update weather every 5 minutes
        const interval = setInterval(getLocation, 300000);
        return () => clearInterval(interval);
    }, []);
    
    //real time clock
    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            let hours = now.getHours();
            let minutes = now.getMinutes();
            let ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            const strTime = `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
            setCurrentTime(strTime);
        };
        updateClock();
        const timer = setInterval(updateClock, 1000);
        return () => clearInterval(timer);
    }, []);

    if (error) {
        return <div className="weather-container error">{error}</div>;
    }

    if (!weather) {
        return <div className="weather-container loading">Loading weather...</div>;
    }

    return (
        <div className="weather-container">
            <div className="weather-info">
                <div className="time">{currentTime}</div>
                <div className="temperature">{weather.temperature}°C</div>
                <div className="description">{weather.description}</div>
                <div className="city">{weather.city}</div>
            </div>
            <img 
                src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                alt={weather.description}
                className="weather-icon"
            />
        </div>
    );
};

export default Weather; 
