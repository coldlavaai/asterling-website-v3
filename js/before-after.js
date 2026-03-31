/* ============================================
   Before & After Gallery — Category Filtering
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  // Get all filter buttons and comparison cards
  const filterButtons = document.querySelectorAll('.filter-btn');
  const comparisonCards = document.querySelectorAll('.comparison-card');

  // Filter functionality
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const category = this.getAttribute('data-category');
      
      // Update active button state
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      // Filter cards with smooth transition
      comparisonCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (category === 'all' || cardCategory === category) {
          // Show card
          card.classList.remove('fade-out', 'hidden');
        } else {
          // Hide card with animation
          card.classList.add('fade-out');
          setTimeout(() => {
            card.classList.add('hidden');
          }, 400);
        }
      });
      
      // Check if any cards are visible
      setTimeout(() => {
        const visibleCards = document.querySelectorAll('.comparison-card:not(.hidden)');
        const emptyState = document.querySelector('.empty-state');
        
        if (visibleCards.length === 0) {
          if (!emptyState) {
            const gallery = document.querySelector('.before-after-gallery');
            const empty = document.createElement('div');
            empty.className = 'empty-state';
            empty.textContent = 'No projects in this category yet. Check back soon!';
            gallery.appendChild(empty);
          }
        } else {
          if (emptyState) {
            emptyState.remove();
          }
        }
      }, 400);
    });
  });
  
  // Initialize - show all by default
  const allButton = document.querySelector('.filter-btn[data-category="all"]');
  if (allButton) {
    allButton.classList.add('active');
  }
});
