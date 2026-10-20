/**
 * PayFlowPro - Blog Filter, Search, and Client-Side Pagination Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const searchInput = document.getElementById('blogSearchInput');
  const filterBtns = document.querySelectorAll('.blog-filter-btn');
  const blogCards = document.querySelectorAll('.blog-card-item');
  const noResultsMsg = document.getElementById('noBlogResults');

  let activeCategory = 'all';
  let searchQuery = '';

  function filterPosts() {
    let visibleCount = 0;

    blogCards.forEach(card => {
      const title = (card.querySelector('.blog-title')?.textContent || '').toLowerCase();
      const excerpt = (card.querySelector('.blog-excerpt')?.textContent || '').toLowerCase();
      const category = card.getAttribute('data-category') || '';

      const matchesCategory = activeCategory === 'all' || category === activeCategory;
      const matchesSearch = searchQuery === '' || title.includes(searchQuery) || excerpt.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'block';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (noResultsMsg) {
      noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  // Category Filtering
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      filterBtns.forEach(b => b.classList.remove('active', 'btn-primary'));
      filterBtns.forEach(b => b.classList.add('btn-light'));

      btn.classList.remove('btn-light');
      btn.classList.add('active', 'btn-primary');

      activeCategory = btn.getAttribute('data-filter') || 'all';
      filterPosts();
    });
  });

  // Search Input Filtering
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      filterPosts();
    });
  }
});
