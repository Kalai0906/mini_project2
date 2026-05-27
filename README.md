# Weather Application

A dynamic weather application that fetches real-time weather data using the OpenWeatherMap API and displays it on a user-friendly interface.

## Features

- **City Search**: Users can enter a city name to fetch weather information
- **Weather Information Display**: Shows the following details:
  - City Name and Country
  - Temperature (in Celsius)
  - Weather Condition (Cloudy, Sunny, Rainy, etc.)
  - Humidity percentage
  - Wind Speed (in m/s)
- **API Integration**: Uses OpenWeatherMap API for real-time data
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: Displays appropriate error messages for invalid inputs or API issues

## Setup Instructions

1. **Get an API Key**:
   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up for a free account
   - Generate an API key

2. **Configure the Application**:
   - Open `script.js`
   - Replace `YOUR_API_KEY_HERE` with your actual API key:
     ```javascript
     const API_KEY = 'your_actual_api_key_here';
     ```

3. **Run the Application**:
   - Open `index.html` in a web browser
   - Enter a city name and click "Search" or press Enter

## Technologies Used

- **HTML5**: Structure and markup
- **CSS3**: Styling and responsive design
- **JavaScript (ES6+)**: Functionality and API integration
- **OpenWeatherMap API**: Weather data source

## File Structure

```
weather-app/
├── index.html      # Main HTML file
├── styles.css      # CSS styling
├── script.js       # JavaScript functionality
└── README.md       # Project documentation
```

## API Integration

The application uses the OpenWeatherMap Current Weather Data API:
- **Endpoint**: `https://api.openweathermap.org/data/2.5/weather`
- **Parameters**: 
  - `q`: City name
  - `appid`: API key
  - `units`: metric (for Celsius)

## Error Handling

The application handles various error scenarios:
- Empty city input
- City not found (404)
- Invalid API key (401)
- Network errors
- API rate limits

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Future Enhancements

- 5-day weather forecast
- Geolocation support
- Weather icons
- Temperature unit conversion (Celsius/Fahrenheit)
- Local storage for recent searches