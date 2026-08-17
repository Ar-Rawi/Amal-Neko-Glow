// src/main.js
// Entry point – initializes the enhanced Todo app UI
import { initApp } from './ui.js';

// When the DOM is ready, start the app
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
