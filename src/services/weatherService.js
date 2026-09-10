const axios = require('axios');

const BASE_URL = process.env.OPENWEATHER_API_URL || 'https://api.openweathermap.org/data/2.5';
const API_KEY = process.env.OPENWEATHER_API_KEY;

if (!API_KEY) {
  console.warn('⚠️  Warning: OPENWEATHER_API_KEY is not set in environment variables');
}

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000
});

// Add API key to all requests
axiosInstance.interceptors.request.use((config) => {
  config.params = config.params || {};
  config.params.appid = API_KEY;
  return config;
});

// Error handler
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.message;
      
      const err = new Error(message);
      err.status = status;
      throw err;
    }
    throw error;
  }
);

const getCurrentWeather = async (city, units = 'metric') => {
  try {
    const response = await axiosInstance.get('/weather', {
      params: {
        q: city,
        units: units
      }
    });
    return formatWeatherData(response.data);
  } catch (error) {
    throw handleApiError(error, `Failed to fetch weather for ${city}`);
  }
};

const getWeatherForecast = async (city, days = 5, units = 'metric') => {
  try {
    const response = await axiosInstance.get('/forecast', {
      params: {
        q: city,
        units: units,
        cnt: days * 8 // 8 forecasts per day (3-hour intervals)
      }
    });
    return formatForecastData(response.data);
  } catch (error) {
    throw handleApiError(error, `Failed to fetch forecast for ${city}`);
  }
};

const searchCities = async (query, limit = 10) => {
  try {
    const response = await axiosInstance.get('/find', {
      params: {
        q: query,
        type: 'like',
        cnt: limit
      }
    });
    return response.data.list.map((city) => ({
      id: city.id,
      name: city.name,
      country: city.sys.country,
      lat: city.coord.lat,
      lon: city.coord.lon,
      main: city.main.temp,
      description: city.weather[0].description,
      icon: city.weather[0].icon
    }));
  } catch (error) {
    throw handleApiError(error, 'Failed to search cities');
  }
};

const getWeatherByCoordinates = async (lat, lon, units = 'metric') => {
  try {
    const response = await axiosInstance.get('/weather', {
      params: {
        lat: lat,
        lon: lon,
        units: units
      }
    });
    return formatWeatherData(response.data);
  } catch (error) {
    throw handleApiError(error, 'Failed to fetch weather by coordinates');
  }
};

const formatWeatherData = (data) => {
  return {
    city: data.name,
    country: data.sys.country,
    coordinates: {
      lat: data.coord.lat,
      lon: data.coord.lon
    },
    temperature: data.main.temp,
    feelsLike: data.main.feels_like,
    tempMin: data.main.temp_min,
    tempMax: data.main.temp_max,
    pressure: data.main.pressure,
    humidity: data.main.humidity,
    visibility: data.visibility,
    windSpeed: data.wind.speed,
    windDeg: data.wind.deg,
    windGust: data.wind.gust || null,
    cloudiness: data.clouds.all,
    precipitation: data.rain?.['1h'] || 0,
    snow: data.snow?.['1h'] || 0,
    weather: {
      main: data.weather[0].main,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      id: data.weather[0].id
    },
    sunrise: new Date(data.sys.sunrise * 1000).toISOString(),
    sunset: new Date(data.sys.sunset * 1000).toISOString(),
    timezone: data.timezone,
    timestamp: new Date(data.dt * 1000).toISOString()
  };
};

const formatForecastData = (data) => {
  const forecastMap = {};
  
  data.list.forEach((item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString('en-US');
    if (!forecastMap[date]) {
      forecastMap[date] = [];
    }
    forecastMap[date].push({
      timestamp: new Date(item.dt * 1000).toISOString(),
      temperature: item.main.temp,
      feelsLike: item.main.feels_like,
      tempMin: item.main.temp_min,
      tempMax: item.main.temp_max,
      pressure: item.main.pressure,
      humidity: item.main.humidity,
      weather: {
        main: item.weather[0].main,
        description: item.weather[0].description,
        icon: item.weather[0].icon
      },
      windSpeed: item.wind.speed,
      windDeg: item.wind.deg,
      cloudiness: item.clouds.all,
      precipitation: item.rain?.['3h'] || 0,
      precipitationProbability: item.pop || 0,
      visibility: item.visibility
    });
  });
  
  return {
    city: data.city.name,
    country: data.city.country,
    timezone: data.city.timezone,
    forecast: forecastMap
  };
};

const handleApiError = (error, message) => {
  const err = new Error(message);
  err.status = error.status || 500;
  err.originalError = error.message;
  return err;
};

module.exports = {
  getCurrentWeather,
  getWeatherForecast,
  searchCities,
  getWeatherByCoordinates
};
