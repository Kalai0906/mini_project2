// Using Open-Meteo API (no API key required) + Geocoding
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

// DOM elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherDisplay = document.getElementById('weatherDisplay');
const errorMessage = document.getElementById('errorMessage');
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const weatherCondition = document.getElementById('weatherCondition');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');

// Event listeners
searchBtn.addEventListener('click', searchWeather);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchWeather();
    }
});

// Main function to search weather
async function searchWeather() {
    const city = cityInput.value.trim();
    
    if (!city) {
        showError('Please enter a city name');
        return;
    }
    
    try {
        showLoading();
        
        // First, get coordinates for the city
        const coordinates = await getCoordinates(city);
        
        // Then get weather data using coordinates
        const weatherData = await fetchWeatherData(coordinates);
        
        displayWeatherData(weatherData, coordinates);
        hideError();
    } catch (error) {
        showError(error.message);
        hideWeatherDisplay();
    }
}

// Get coordinates for a city
async function getCoordinates(city) {
    const url = `${GEOCODING_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error('Failed to find city location. Please try again.');
    }
    
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
        throw new Error('City not found. Please check the spelling and try again.');
    }
    
    return data.results[0];
}

// Fetch weather data from API
async function fetchWeatherData(coordinates) {
    const url = `${WEATHER_URL}?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error('Failed to fetch weather data. Please try again later.');
    }
    
    return await response.json();
}

// Weather code to description mapping
function getWeatherDescription(code) {
    const weatherCodes = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Fog',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        56: 'Light freezing drizzle',
        57: 'Dense freezing drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        66: 'Light freezing rain',
        67: 'Heavy freezing rain',
        71: 'Slight snow fall',
        73: 'Moderate snow fall',
        75: 'Heavy snow fall',
        77: 'Snow grains',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail'
    };
    
    return weatherCodes[code] || 'Unknown weather condition';
}

// Display weather data
function displayWeatherData(data, coordinates) {
    const current = data.current;
    
    cityName.textContent = `${coordinates.name}, ${coordinates.country}`;
    temperature.textContent = Math.round(current.temperature_2m);
    weatherCondition.textContent = getWeatherDescription(current.weather_code);
    humidity.textContent = `${current.relative_humidity_2m}%`;
    windSpeed.textContent = `${current.wind_speed_10m} km/h`;
    
    weatherDisplay.style.display = 'block';
}

// Show loading state
function showLoading() {
    searchBtn.textContent = 'Loading...';
    searchBtn.disabled = true;
}

// Reset button state
function resetButton() {
    searchBtn.textContent = 'Search';
    searchBtn.disabled = false;
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    resetButton();
}

// Hide error message
function hideError() {
    errorMessage.style.display = 'none';
    resetButton();
}

// Hide weather display
function hideWeatherDisplay() {
    weatherDisplay.style.display = 'none';
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    cityInput.focus();
});