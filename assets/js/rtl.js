/**
 * PayFlowPro - RTL Direction Engine
 * Handles LTR/RTL switching with localStorage memory
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'payflow_dir';

  function getPreferredDir() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? stored : 'ltr';
  }

  function applyDirection(dir) {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem(STORAGE_KEY, dir);
    updateRtlControls(dir);
  }

  function updateRtlControls(dir) {
    const rtlBtns = document.querySelectorAll('.rtl-toggle-btn');
    rtlBtns.forEach(btn => {
      btn.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
    });
  }

  // Initialize immediately
  const initialDir = getPreferredDir();
  applyDirection(initialDir);

  document.addEventListener('DOMContentLoaded', () => {
    updateRtlControls(initialDir);

    const rtlBtns = document.querySelectorAll('.rtl-toggle-btn');
    rtlBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
        const nextDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
        applyDirection(nextDir);
      });
    });
  });
})();
