# Weather Dashboard

A modern weather dashboard application that fetches real-time weather data from the OpenWeatherMap API.

## Features

- ✅ Real-time weather information
- 🌡️ Current temperature and conditions
- 💧 Humidity and wind speed
- 🌅 Sunrise and sunset times
- 📍 Location-based weather search
- 🔄 Auto-refresh capability
- 📱 Responsive design
- 🌙 Dark mode support
- 📊 5-day forecast
- ❤️ Favorite locations

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, JavaScript
- **API**: OpenWeatherMap API
- **Database**: LocalStorage (frontend)

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- OpenWeatherMap API key (free tier available at https://openweathermap.org/api)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/zkltd2013-stack/weather-dashboard.git
   cd weather-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your OpenWeatherMap API key:
   ```
   OPENWEATHER_API_KEY=your_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## Project Structure

```
weather-dashboard/
├── public/
│   ├── index.html
│   ├── css/
│   │   ├── style.css
│   │   └── responsive.css
│   └── js/
│       ├── app.js
│       ├── api.js
│       ├── ui.js
│       └── storage.js
├── src/
│   ├── routes/
│   │   └── weather.js
│   ├── controllers/
│   │   └── weatherController.js
│   ├── services/
│   │   └── weatherService.js
│   └── utils/
│       └── helpers.js
├── server.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## API Endpoints

### Get Current Weather
```
GET /api/weather/current?city=London
```

### Get Weather Forecast
```
GET /api/weather/forecast?city=London&days=5
```

### Search Cities
```
GET /api/weather/search?q=Lond
```

## Usage Examples

### JavaScript Frontend
```javascript
// Get current weather
const weather = await getWeather('London');
console.log(weather);

// Save favorite location
saveFavorite('London');

// Get favorites
const favorites = getFavorites();
```

## Features in Detail

### Current Weather Display
- Temperature in Celsius/Fahrenheit
- Weather condition with icon
- Feels like temperature
- Humidity percentage
- Wind speed and direction
- Atmospheric pressure
- Visibility
- UV index

### 5-Day Forecast
- Daily temperature high/low
- Weather condition
- Precipitation probability
- Wind information

### Location Management
- Search weather by city name
- Save favorite locations
- Quick access to recent searches
- Geolocation support

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Enter` | Search weather |
| `F` | Toggle Fahrenheit/Celsius |
| `D` | Toggle Dark mode |
| `R` | Refresh weather |
| `S` | Save to favorites |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## API Rate Limits

OpenWeatherMap Free Tier:
- 60 calls/minute
- 1,000,000 calls/month

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

**zkltd2013-stack**

## Support

If you have any questions or issues, please open an issue on GitHub.

## Roadmap

- [ ] Add Air Quality Index (AQI) data
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Database integration for saved locations
- [ ] Notification system for weather alerts
- [ ] Weather history graphs
- [ ] Social sharing features
