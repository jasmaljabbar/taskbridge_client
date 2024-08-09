// mockLocalStorage.js
class LocalStorageMock {
    constructor() {
      this.store = {};
    }
  
    getItem(key) {
      return this.store[key] || null;
    }
  
    setItem(key, value) {
      this.store[key] = value;
    }
  
    removeItem(key) {
      delete this.store[key];
    }
  
    clear() {
      this.store = {};
    }
  }
  
  global.localStorage = new LocalStorageMock();
  