// Using Open-Meteo API (no API key required) + Geocoding
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

// DOM elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherDisplay = document.getElementById('weatherDisplay');
const errorMessage = document.getElementById('errorMessage');
const loadingDiv = document.getElementById('loadingDiv');
const recentSearches = document.getElementById('recentSearches');
const recentList = document.getElementById('recentList');
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const weatherCondition = document.getElementById('weatherCondition');
const weatherIcon = document.getElementById('weatherIcon');
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

// Weather code to description and icon mapping
function getWeatherInfo(code) {
    const weatherData = {
        0: { description: 'Clear sky', icon: '☀️' },
        1: { description: 'Mainly clear', icon: '🌤️' },
        2: { description: 'Partly cloudy', icon: '⛅' },
        3: { description: 'Overcast', icon: '☁️' },
        45: { description: 'Fog', icon: '🌫️' },
        48: { description: 'Depositing rime fog', icon: '🌫️' },
        51: { description: 'Light drizzle', icon: '🌦️' },
        53: { description: 'Moderate drizzle', icon: '🌦️' },
        55: { description: 'Dense drizzle', icon: '🌧️' },
        56: { description: 'Light freezing drizzle', icon: '🌨️' },
        57: { description: 'Dense freezing drizzle', icon: '🌨️' },
        61: { description: 'Slight rain', icon: '🌧️' },
        63: { description: 'Moderate rain', icon: '🌧️' },
        65: { description: 'Heavy rain', icon: '⛈️' },
        66: { description: 'Light freezing rain', icon: '🌨️' },
        67: { description: 'Heavy freezing rain', icon: '🌨️' },
        71: { description: 'Slight snow fall', icon: '❄️' },
        73: { description: 'Moderate snow fall', icon: '🌨️' },
        75: { description: 'Heavy snow fall', icon: '❄️' },
        77: { description: 'Snow grains', icon: '❄️' },
        80: { description: 'Slight rain showers', icon: '🌦️' },
        81: { description: 'Moderate rain showers', icon: '🌧️' },
        82: { description: 'Violent rain showers', icon: '⛈️' },
        85: { description: 'Slight snow showers', icon: '🌨️' },
        86: { description: 'Heavy snow showers', icon: '❄️' },
        95: { description: 'Thunderstorm', icon: '⛈️' },
        96: { description: 'Thunderstorm with slight hail', icon: '⛈️' },
        99: { description: 'Thunderstorm with heavy hail', icon: '⛈️' }
    };
    
    return weatherData[code] || { description: 'Unknown weather condition', icon: '🌤️' };
}

// Display weather data
function displayWeatherData(data, coordinates) {
    const current = data.current;
    const weatherInfo = getWeatherInfo(current.weather_code);
    
    cityName.textContent = `${coordinates.name}, ${coordinates.country}`;
    temperature.textContent = Math.round(current.temperature_2m);
    weatherCondition.textContent = weatherInfo.description;
    weatherIcon.textContent = weatherInfo.icon;
    humidity.textContent = `${current.relative_humidity_2m}%`;
    windSpeed.textContent = `${current.wind_speed_10m} km/h`;
    
    // Add to recent searches
    addToRecentSearches(coordinates.name);
    
    weatherDisplay.style.display = 'block';
}

// Recent searches functionality
function addToRecentSearches(city) {
    let recent = JSON.parse(localStorage.getItem('recentSearches')) || [];
    
    // Remove if already exists
    recent = recent.filter(item => item.toLowerCase() !== city.toLowerCase());
    
    // Add to beginning
    recent.unshift(city);
    
    // Keep only last 5
    recent = recent.slice(0, 5);
    
    localStorage.setItem('recentSearches', JSON.stringify(recent));
    displayRecentSearches();
}

function displayRecentSearches() {
    const recent = JSON.parse(localStorage.getItem('recentSearches')) || [];
    
    if (recent.length === 0) {
        recentSearches.style.display = 'none';
        return;
    }
    
    recentSearches.style.display = 'block';
    recentList.innerHTML = '';
    
    recent.forEach(city => {
        const item = document.createElement('span');
        item.className = 'recent-item';
        item.textContent = city;
        item.onclick = () => {
            cityInput.value = city;
            searchWeather();
        };
        recentList.appendChild(item);
    });
}

// Show loading state
function showLoading() {
    loadingDiv.style.display = 'block';
    weatherDisplay.style.display = 'none';
    errorMessage.style.display = 'none';
}

// Reset button state
function resetButton() {
    loadingDiv.style.display = 'none';
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
    displayRecentSearches();
});
