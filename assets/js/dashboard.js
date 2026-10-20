/**
 * PayFlowPro - Admin Dashboard Controller & Visualization Engine
 * Handles Chart.js initializations, dynamic theme palette switches, 
 * modal workflows, and interactive table filtering.
 */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 0. Dynamic Merchant User Profile from Session / LocalStorage
  const currentUser = JSON.parse(localStorage.getItem('payflow_current_user') || 'null');
  if (currentUser) {
    const nameEl = document.querySelector('.dropdown-toggle span.d-sm-inline');
    const avatarEl = document.querySelector('.dropdown-toggle .badge-custom');
    const portalTitleEl = document.querySelector('.admin-topbar h6');
    
    if (nameEl && currentUser.name) {
      nameEl.textContent = currentUser.name;
    }
    if (avatarEl && currentUser.initials) {
      avatarEl.textContent = currentUser.initials;
    }
    if (portalTitleEl && currentUser.business) {
      portalTitleEl.textContent = currentUser.business + ' Portal';
    }
  }

  // 1. Sidebar Collapse & Offcanvas Toggle
  const sidebarToggle = document.getElementById('sidebarToggle');
  const adminLayout = document.querySelector('.admin-layout');

  if (sidebarToggle && adminLayout) {
    sidebarToggle.addEventListener('click', (e) => {
      e.preventDefault();
      adminLayout.classList.toggle('sidebar-collapsed');
    });
  }

  // 2. Chart.js Palette Helpers
  function getChartColors(theme) {
    const isDark = theme === 'dark';
    return {
      primary: '#0066ff',
      primaryFill: isDark ? 'rgba(0, 102, 255, 0.15)' : 'rgba(0, 102, 255, 0.08)',
      secondary: '#00d2ff',
      success: '#10b981',
      warning: '#f59e0b',
      text: isDark ? '#94a3b8' : '#64748b',
      grid: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)'
    };
  }

  let revenueChartInstance = null;
  let transactionChartInstance = null;

  function initCharts() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const colors = getChartColors(currentTheme);

    // Revenue Area Chart
    const revCanvas = document.getElementById('revenueChartCanvas');
    if (revCanvas && typeof Chart !== 'undefined') {
      if (revenueChartInstance) revenueChartInstance.destroy();

      revenueChartInstance = new Chart(revCanvas, {
        type: 'line',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            label: 'Net Revenue ($)',
            data: [12400, 18900, 15600, 24800, 31200, 48920, 42100],
            borderColor: colors.primary,
            backgroundColor: colors.primaryFill,
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: {
              grid: { color: colors.grid },
              ticks: { color: colors.text }
            },
            y: {
              grid: { color: colors.grid },
              ticks: {
                color: colors.text,
                callback: (val) => '$' + val.toLocaleString()
              }
            }
          }
        }
      });
    }

    // Payment Methods Doughnut Chart
    const methodCanvas = document.getElementById('paymentMethodCanvas');
    if (methodCanvas && typeof Chart !== 'undefined') {
      if (transactionChartInstance) transactionChartInstance.destroy();

      transactionChartInstance = new Chart(methodCanvas, {
        type: 'doughnut',
        data: {
          labels: ['Visa / MC', 'Apple Pay', 'Google Pay', 'Amex', 'ACH Transfer'],
          datasets: [{
            data: [52, 24, 12, 8, 4],
            backgroundColor: ['#0066ff', '#00d2ff', '#10b981', '#f59e0b', '#8b5cf6'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: colors.text, boxWidth: 12 }
            }
          },
          cutout: '70%'
        }
      });
    }
  }

  // Listen for theme change events to re-render charts
  window.addEventListener('themeChanged', () => {
    initCharts();
  });

  // Initialize charts on load
  initCharts();

  // 3. Table Search & Status Filter
  const tableSearch = document.getElementById('tableSearchInput');
  const statusFilter = document.getElementById('statusFilterSelect');
  const dataRows = document.querySelectorAll('.filterable-row');

  function filterTable() {
    const query = (tableSearch ? tableSearch.value : '').toLowerCase().trim();
    const status = statusFilter ? statusFilter.value : 'all';

    dataRows.forEach(row => {
      const text = row.textContent.toLowerCase();
      const rowStatus = row.getAttribute('data-status') || '';

      const matchesQuery = query === '' || text.includes(query);
      const matchesStatus = status === 'all' || rowStatus === status;

      row.style.display = (matchesQuery && matchesStatus) ? '' : 'none';
    });
  }

  if (tableSearch) tableSearch.addEventListener('input', filterTable);
  if (statusFilter) statusFilter.addEventListener('change', filterTable);
});
