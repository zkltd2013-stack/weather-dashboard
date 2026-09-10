const express = require('express');
const weatherController = require('../controllers/weatherController');
const router = express.Router();

// Get current weather
router.get('/current', weatherController.getCurrentWeather);

// Get weather forecast
router.get('/forecast', weatherController.getWeatherForecast);

// Search cities
router.get('/search', weatherController.searchCities);

// Get weather by coordinates
router.get('/coordinates', weatherController.getWeatherByCoordinates);

module.exports = router;
