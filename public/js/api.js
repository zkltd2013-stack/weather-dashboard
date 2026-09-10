// ============================================
// API 管理
// ============================================

const API = {
  BASE_URL: 'http://localhost:3000/api/weather',
  TIMEOUT: 10000,

  // 获取当前天气
  async getCurrentWeather(city, units = 'metric') {
    try {
      const response = await fetch(
        `${this.BASE_URL}/current?city=${encodeURIComponent(city)}&units=${units}`,
        { timeout: this.TIMEOUT }
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || '获取天气信息失败');
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // 获取天气预报
  async getWeatherForecast(city, days = 5, units = 'metric') {
    try {
      const response = await fetch(
        `${this.BASE_URL}/forecast?city=${encodeURIComponent(city)}&days=${days}&units=${units}`,
        { timeout: this.TIMEOUT }
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || '获取预报信息失败');
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // 搜索城市
  async searchCities(query, limit = 10) {
    try {
      const response = await fetch(
        `${this.BASE_URL}/search?q=${encodeURIComponent(query)}&limit=${limit}`,
        { timeout: this.TIMEOUT }
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || '搜索失败');
      }
      
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('API Error:', error);
      return [];
    }
  },

  // 通过坐标获取天气
  async getWeatherByCoordinates(lat, lon, units = 'metric') {
    try {
      const response = await fetch(
        `${this.BASE_URL}/coordinates?lat=${lat}&lon=${lon}&units=${units}`,
        { timeout: this.TIMEOUT }
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || '获取天气信息失败');
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};
