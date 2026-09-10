const weatherService = require('../services/weatherService');

const getCurrentWeather = async (req, res, next) => {
  try {
    const { city, units = 'metric' } = req.query;

    if (!city) {
      return res.status(400).json({
        error: {
          message: 'City parameter is required',
          status: 400
        }
      });
    }

    const weather = await weatherService.getCurrentWeather(city, units);
    res.json({
      success: true,
      data: weather,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

const getWeatherForecast = async (req, res, next) => {
  try {
    const { city, days = 5, units = 'metric' } = req.query;

    if (!city) {
      return res.status(400).json({
        error: {
          message: 'City parameter is required',
          status: 400
        }
      });
    }

    const forecast = await weatherService.getWeatherForecast(city, days, units);
    res.json({
      success: true,
      data: forecast,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

const searchCities = async (req, res, next) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({
        error: {
          message: 'Search query must be at least 2 characters',
          status: 400
        }
      });
    }

    const results = await weatherService.searchCities(q, limit);
    res.json({
      success: true,
      data: results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

const getWeatherByCoordinates = async (req, res, next) => {
  try {
    const { lat, lon, units = 'metric' } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        error: {
          message: 'Latitude and longitude are required',
          status: 400
        }
      });
    }

    const weather = await weatherService.getWeatherByCoordinates(lat, lon, units);
    res.json({
      success: true,
      data: weather,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCurrentWeather,
  getWeatherForecast,
  searchCities,
  getWeatherByCoordinates
};
