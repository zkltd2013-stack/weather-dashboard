// ============================================
// 应用主程序
// ============================================

const App = {
  currentWeather: null,
  currentForecast: null,
  refreshInterval: null,

  // 初始化应用
  async init() {
    UI.init();
    this.attachEventListeners();
    
    // 尝试使用地理位置
    this.useGeolocation();
    
    // 或加载最后一个搜索的城市
    const recent = StorageManager.getRecent();
    if (recent.length > 0) {
      await this.searchWeather(recent[0].name);
    } else {
      await this.searchWeather('Beijing');
    }
  },

  // 附加事件监听器
  attachEventListeners() {
    // 搜索按钮
    UI.elements.searchBtn.addEventListener('click', () => {
      const city = UI.elements.searchInput.value.trim();
      if (city) {
        this.searchWeather(city);
      }
    });

    // 搜索输入框
    UI.elements.searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const city = UI.elements.searchInput.value.trim();
        if (city) {
          this.searchWeather(city);
        }
      }
    });

    // 搜索建议
    UI.elements.searchInput.addEventListener('input', async (e) => {
      const query = e.target.value.trim();
      if (query.length >= 2) {
        const results = await API.searchCities(query);
        UI.displaySearchResults(results);
      } else {
        UI.elements.searchResults.innerHTML = '';
      }
    });

    // 搜索结果点击
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('search-result-item')) {
        const city = JSON.parse(e.target.dataset.city);
        this.searchWeather(city.name);
        UI.elements.searchInput.value = '';
        UI.elements.searchResults.innerHTML = '';
      }
    });

    // 收藏列表点击
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('list-item') && e.target.parentElement.id === 'favoritesList') {
        const city = JSON.parse(e.target.dataset.city);
        this.searchWeather(city.name);
      }
    });

    // 最近列表点击
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('list-item') && e.target.parentElement.id === 'recentList') {
        const city = JSON.parse(e.target.dataset.city);
        this.searchWeather(city.name);
      }
    });

    // 移除收藏
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('list-item-remove')) {
        e.stopPropagation();
        const cityName = e.target.dataset.name;
        StorageManager.removeFavorite(cityName);
        UI.updateFavoritesList();
        UI.showSuccess('已移除收藏');
      }
    });

    // 主题切换
    UI.elements.themeToggle.addEventListener('click', () => {
      UI.toggleTheme();
    });

    // 温度单位切换
    UI.elements.unitToggle.addEventListener('click', async () => {
      UI.toggleUnit();
      if (this.currentWeather) {
        await this.loadWeather(this.currentWeather.city, true);
      }
    });

    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
      if (e.code === 'KeyF' && e.ctrlKey) {
        e.preventDefault();
        UI.toggleUnit();
        if (this.currentWeather) {
          this.loadWeather(this.currentWeather.city, true);
        }
      }
      if (e.code === 'KeyD' && e.ctrlKey) {
        e.preventDefault();
        UI.toggleTheme();
      }
      if (e.code === 'KeyR' && e.ctrlKey) {
        e.preventDefault();
        if (this.currentWeather) {
          this.loadWeather(this.currentWeather.city, true);
        }
      }
    });
  },

  // 使用地理位置
  async useGeolocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const weather = await API.getWeatherByCoordinates(latitude, longitude);
            this.currentWeather = weather;
            UI.displayCurrentWeather(weather);
            
            // 加载预报
            const forecast = await API.getWeatherForecast(weather.city);
            this.currentForecast = forecast;
            UI.displayForecast(forecast);
            
            // 添加到最近搜索
            StorageManager.addRecent({
              name: weather.city,
              country: weather.country,
              lat: weather.coordinates.lat,
              lon: weather.coordinates.lon
            });
            UI.updateRecentList();
          } catch (error) {
            console.log('Geolocation weather fetch failed, using default city');
          }
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }
  },

  // 搜索天气
  async searchWeather(city) {
    try {
      UI.elements.currentWeather.innerHTML = '<div class="weather-loading"><div class="spinner"></div><p>加载中...</p></div>';
      await this.loadWeather(city);
    } catch (error) {
      UI.showError(error.message || '搜索失败');
    }
  },

  // 加载天气数据
  async loadWeather(city, skipCache = false) {
    const settings = StorageManager.getSettings();
    const unit = settings.unit;
    
    try {
      // 获取当前天气
      const weather = await API.getCurrentWeather(city, unit);
      this.currentWeather = weather;
      UI.displayCurrentWeather(weather);
      
      // 获取预报
      const forecast = await API.getWeatherForecast(city, 5, unit);
      this.currentForecast = forecast;
      UI.displayForecast(forecast);
      
      // 添加到最近搜索
      StorageManager.addRecent({
        name: weather.city,
        country: weather.country,
        lat: weather.coordinates.lat,
        lon: weather.coordinates.lon
      });
      UI.updateRecentList();
      UI.updateFavoritesList();
      
      // 清除搜索结果
      UI.elements.searchResults.innerHTML = '';
    } catch (error) {
      console.error('Load weather error:', error);
      throw error;
    }
  },

  // 切换收藏
  async toggleFavorite(weather) {
    const city = {
      name: weather.city,
      country: weather.country,
      lat: weather.coordinates.lat,
      lon: weather.coordinates.lon
    };
    
    if (StorageManager.isFavorite(weather.city)) {
      StorageManager.removeFavorite(weather.city);
      UI.showSuccess('已移除收藏');
    } else {
      StorageManager.addFavorite(city);
      UI.showSuccess('已添加收藏');
    }
    
    UI.updateFavoritesList();
    
    // 重新显示当前天气以更新按钮状态
    if (this.currentWeather) {
      UI.displayCurrentWeather(this.currentWeather);
    }
  }
};

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    App.init();
  });
} else {
  App.init();
}
