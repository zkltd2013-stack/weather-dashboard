// ============================================
// UI 管理
// ============================================

const UI = {
  // DOM 缓存
  elements: {
    currentWeather: document.getElementById('currentWeather'),
    forecastContainer: document.getElementById('forecastContainer'),
    searchInput: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchBtn'),
    searchResults: document.getElementById('searchResults'),
    favoritesList: document.getElementById('favoritesList'),
    recentList: document.getElementById('recentList'),
    errorToast: document.getElementById('errorToast'),
    successToast: document.getElementById('successToast'),
    themeToggle: document.getElementById('themeToggle'),
    unitToggle: document.getElementById('unitToggle')
  },

  // 显示当前天气
  displayCurrentWeather(weather) {
    const unit = StorageManager.getSettings().unit === 'metric' ? '°C' : '°F';
    const isFavorite = StorageManager.isFavorite(weather.city);
    
    const html = `
      <div class="weather-header">
        <div>
          <h2 class="weather-title">${weather.city}, ${weather.country}</h2>
          <p class="weather-subtitle">${new Date(weather.timestamp).toLocaleString('zh-CN')}</p>
        </div>
        <button class="btn btn-small ${isFavorite ? 'btn-primary' : 'btn-secondary'}" id="favBtn">
          ${isFavorite ? '★ 已收藏' : '☆ 收藏'}
        </button>
      </div>
      
      <div class="weather-main">
        <div class="weather-icon" id="weatherIcon"></div>
        <div>
          <div class="temperature-section">
            <span class="temperature">${Math.round(weather.temperature)}</span>
            <span class="temperature-unit">${unit}</span>
          </div>
          <p class="weather-description">${weather.weather.description}</p>
        </div>
      </div>
      
      <div class="weather-info">
        <div class="weather-info-item">
          <p class="weather-info-label">体感温度</p>
          <p class="weather-info-value">${Math.round(weather.feelsLike)}${unit}</p>
        </div>
        <div class="weather-info-item">
          <p class="weather-info-label">最低/最高</p>
          <p class="weather-info-value">${Math.round(weather.tempMin)}${unit} / ${Math.round(weather.tempMax)}${unit}</p>
        </div>
        <div class="weather-info-item">
          <p class="weather-info-label">气压</p>
          <p class="weather-info-value">${weather.pressure} hPa</p>
        </div>
        <div class="weather-info-item">
          <p class="weather-info-label">云量</p>
          <p class="weather-info-value">${weather.cloudiness}%</p>
        </div>
      </div>
    `;
    
    this.elements.currentWeather.innerHTML = html;
    this.updateWeatherIcon(weather.weather.icon);
    
    // 更新详情卡片
    document.getElementById('humidityValue').textContent = weather.humidity + '%';
    document.getElementById('windValue').textContent = weather.windSpeed + ' m/s';
    document.getElementById('visibilityValue').textContent = (weather.visibility / 1000).toFixed(1) + ' km';
    document.getElementById('feelsLikeValue').textContent = Math.round(weather.feelsLike) + unit;
    
    // 更新日出日落时间
    const sunriseTime = new Date(weather.sunrise);
    const sunsetTime = new Date(weather.sunset);
    document.getElementById('sunriseTime').textContent = sunriseTime.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('sunsetTime').textContent = sunsetTime.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    
    // 添加收藏按钮事件
    document.getElementById('favBtn')?.addEventListener('click', () => {
      App.toggleFavorite(weather);
    });
  },

  // 更新天气图标
  updateWeatherIcon(iconCode) {
    const iconMap = {
      '01d': '☀️',
      '01n': '🌙',
      '02d': '⛅',
      '02n': '☁️',
      '03d': '☁️',
      '03n': '☁️',
      '04d': '☁️',
      '04n': '☁️',
      '09d': '🌧️',
      '09n': '🌧️',
      '10d': '🌧️',
      '10n': '🌧️',
      '11d': '⛈️',
      '11n': '⛈️',
      '13d': '❄️',
      '13n': '❄️',
      '50d': '🌫️',
      '50n': '🌫️'
    };
    
    const icon = iconMap[iconCode] || '🌤️';
    const weatherIcon = document.getElementById('weatherIcon');
    if (weatherIcon) {
      weatherIcon.textContent = icon;
    }
  },

  // 显示天气预报
  displayForecast(forecastData) {
    const unit = StorageManager.getSettings().unit === 'metric' ? '°C' : '°F';
    const forecasts = Object.entries(forecastData.forecast).slice(0, 5);
    
    let html = '';
    forecasts.forEach(([date, items]) => {
      if (items.length === 0) return;
      
      // 获取每日的信息（中间时间点）
      const midItem = items[Math.floor(items.length / 2)];
      const temps = items.map(item => item.temperature);
      const maxTemp = Math.max(...temps);
      const minTemp = Math.min(...temps);
      const avgPrecip = (items.reduce((sum, item) => sum + item.precipitationProbability, 0) / items.length * 100).toFixed(0);
      
      html += `
        <div class="forecast-card">
          <p class="forecast-date">${new Date(date).toLocaleDateString('zh-CN', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
          <div class="forecast-icon">${this.getWeatherEmoji(midItem.weather.icon)}</div>
          <p class="forecast-desc">${midItem.weather.description}</p>
          <div class="forecast-temp">
            <span class="forecast-temp-high">${Math.round(maxTemp)}${unit}</span>
            <span class="forecast-temp-low">${Math.round(minTemp)}${unit}</span>
          </div>
          <div class="forecast-details">
            <div class="forecast-detail">
              <p class="forecast-detail-label">💧</p>
              <p class="forecast-detail-value">${avgPrecip}%</p>
            </div>
            <div class="forecast-detail">
              <p class="forecast-detail-label">💨</p>
              <p class="forecast-detail-value">${Math.round(midItem.windSpeed)}</p>
            </div>
          </div>
        </div>
      `;
    });
    
    this.elements.forecastContainer.innerHTML = html;
  },

  // 获取天气表情
  getWeatherEmoji(iconCode) {
    const emojiMap = {
      '01d': '☀️',
      '01n': '🌙',
      '02d': '⛅',
      '02n': '☁️',
      '03d': '☁️',
      '03n': '☁️',
      '04d': '☁️',
      '04n': '☁️',
      '09d': '🌧️',
      '09n': '🌧️',
      '10d': '🌧️',
      '10n': '🌧️',
      '11d': '⛈️',
      '11n': '⛈️',
      '13d': '❄️',
      '13n': '❄️',
      '50d': '🌫️',
      '50n': '🌫️'
    };
    return emojiMap[iconCode] || '🌤️';
  },

  // 显示搜索结果
  displaySearchResults(results) {
    if (results.length === 0) {
      this.elements.searchResults.innerHTML = '<p style="padding: 1rem; color: var(--text-secondary);">未找到结果</p>';
      return;
    }
    
    let html = '';
    results.forEach(city => {
      html += `
        <div class="search-result-item" data-city='${JSON.stringify(city)}'>
          <strong>${city.name}</strong>, ${city.country}
          <span style="font-size: 0.85rem; color: var(--text-secondary);"> · ${Math.round(city.main)}°</span>
        </div>
      `;
    });
    this.elements.searchResults.innerHTML = html;
  },

  // 更新收藏列表
  updateFavoritesList() {
    const favorites = StorageManager.getFavorites();
    if (favorites.length === 0) {
      this.elements.favoritesList.innerHTML = '<p style="color: var(--text-secondary);">暂无收藏</p>';
      return;
    }
    
    let html = '';
    favorites.forEach(city => {
      html += `
        <div class="list-item" data-city='${JSON.stringify(city)}'>
          <span class="list-item-name">⭐ ${city.name}, ${city.country}</span>
          <button class="list-item-remove" data-name="${city.name}">✕</button>
        </div>
      `;
    });
    this.elements.favoritesList.innerHTML = html;
  },

  // 更新最近搜索
  updateRecentList() {
    const recent = StorageManager.getRecent();
    if (recent.length === 0) {
      this.elements.recentList.innerHTML = '<p style="color: var(--text-secondary);">暂无记录</p>';
      return;
    }
    
    let html = '';
    recent.forEach(city => {
      html += `
        <div class="list-item" data-city='${JSON.stringify(city)}'>
          <span class="list-item-name">🕐 ${city.name}, ${city.country}</span>
        </div>
      `;
    });
    this.elements.recentList.innerHTML = html;
  },

  // 显示错误信息
  showError(message) {
    this.elements.errorToast.textContent = message;
    this.elements.errorToast.classList.add('show');
    setTimeout(() => {
      this.elements.errorToast.classList.remove('show');
    }, 3000);
  },

  // 显示成功信息
  showSuccess(message) {
    this.elements.successToast.textContent = message;
    this.elements.successToast.classList.add('show');
    setTimeout(() => {
      this.elements.successToast.classList.remove('show');
    }, 3000);
  },

  // 切换主题
  toggleTheme() {
    const isDark = document.body.classList.toggle('dark-theme');
    StorageManager.updateSettings('theme', isDark ? 'dark' : 'light');
    this.elements.themeToggle.textContent = isDark ? '☀️' : '🌙';
  },

  // 切换温度单位
  toggleUnit() {
    const settings = StorageManager.getSettings();
    const newUnit = settings.unit === 'metric' ? 'imperial' : 'metric';
    StorageManager.updateSettings('unit', newUnit);
    this.elements.unitToggle.textContent = newUnit === 'metric' ? '°F' : '°C';
  },

  // 初始化UI
  init() {
    const settings = StorageManager.getSettings();
    
    // 设置主题
    if (settings.theme === 'dark') {
      document.body.classList.add('dark-theme');
      this.elements.themeToggle.textContent = '☀️';
    } else {
      this.elements.themeToggle.textContent = '🌙';
    }
    
    // 设置温度单位
    this.elements.unitToggle.textContent = settings.unit === 'metric' ? '°F' : '°C';
    
    // 更新列表
    this.updateFavoritesList();
    this.updateRecentList();
  }
};
