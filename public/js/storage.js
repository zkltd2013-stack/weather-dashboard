// ============================================
// 本地存储管理
// ============================================

const StorageManager = {
  // 前缀
  PREFIX: 'weather_dashboard_',

  // 保存数据
  set(key, value) {
    try {
      const data = JSON.stringify(value);
      localStorage.setItem(this.PREFIX + key, data);
      return true;
    } catch (error) {
      console.error('Storage error:', error);
      return false;
    }
  },

  // 获取数据
  get(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(this.PREFIX + key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error('Storage error:', error);
      return defaultValue;
    }
  },

  // 移除数据
  remove(key) {
    try {
      localStorage.removeItem(this.PREFIX + key);
      return true;
    } catch (error) {
      console.error('Storage error:', error);
      return false;
    }
  },

  // 清空所有数据
  clear() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.PREFIX)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('Storage error:', error);
      return false;
    }
  },

  // 添加收藏
  addFavorite(city) {
    const favorites = this.get('favorites', []);
    if (!favorites.find(item => item.name === city.name && item.country === city.country)) {
      favorites.push(city);
      this.set('favorites', favorites);
      return true;
    }
    return false;
  },

  // 获取收藏列表
  getFavorites() {
    return this.get('favorites', []);
  },

  // 移除收藏
  removeFavorite(cityName) {
    const favorites = this.get('favorites', []);
    const filtered = favorites.filter(city => city.name !== cityName);
    this.set('favorites', filtered);
    return filtered;
  },

  // 添加最近搜索
  addRecent(city) {
    const recent = this.get('recent', []);
    // 移除重复项
    const filtered = recent.filter(item => item.name !== city.name || item.country !== city.country);
    // 添加到开头
    filtered.unshift(city);
    // 只保留最近10个
    this.set('recent', filtered.slice(0, 10));
  },

  // 获取最近搜索
  getRecent() {
    return this.get('recent', []);
  },

  // 保存用户设置
  setSettings(settings) {
    this.set('settings', settings);
  },

  // 获取用户设置
  getSettings() {
    return this.get('settings', {
      unit: 'metric',
      theme: 'light',
      refreshInterval: 30 * 60 * 1000 // 30分钟
    });
  },

  // 更新用户设置
  updateSettings(key, value) {
    const settings = this.getSettings();
    settings[key] = value;
    this.setSettings(settings);
    return settings;
  },

  // 检查城市是否收藏
  isFavorite(cityName) {
    const favorites = this.getFavorites();
    return favorites.some(city => city.name === cityName);
  }
};
