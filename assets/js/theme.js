/**
 * PayFlowPro - Theme Management Engine
 * Handles Dark/Light Mode with localStorage persistence
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'payflow_theme';
  const THEME_ATTR = 'data-theme';

  function getPreferredTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute(THEME_ATTR, theme);
    document.documentElement.setAttribute('data-bs-theme', theme);
    if (document.body) {
      document.body.setAttribute(THEME_ATTR, theme);
      document.body.setAttribute('data-bs-theme', theme);
    }
    localStorage.setItem(STORAGE_KEY, theme);
    updateToggleIcons(theme);

    // Dispatch event for other scripts (e.g., Chart.js)
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
  }

  function updateToggleIcons(theme) {
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) {
        if (theme === 'dark') {
          icon.className = 'bi bi-sun-fill';
        } else {
          icon.className = 'bi bi-moon-stars-fill';
        }
      }
    });
  }

  // Initialize immediately to prevent flash of light content
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(initialTheme);
    updateToggleIcons(initialTheme);

    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const currentTheme = document.documentElement.getAttribute(THEME_ATTR) || 'light';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
      });
    });
  });
})();
