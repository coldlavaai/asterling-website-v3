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
  
  /* ============================================
     Lightbox Modal with Carousel
     ============================================ */
  
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImage = document.querySelector('.lightbox-image');
  const lightboxLabel = document.querySelector('.lightbox-label');
  const closeButton = document.querySelector('.lightbox-close');
  const prevButton = document.querySelector('.lightbox-nav--prev');
  const nextButton = document.querySelector('.lightbox-nav--next');
  
  let currentCard = null;
  let currentImageIndex = 0; // 0 = before, 1 = after
  let beforeImageSrc = '';
  let afterImageSrc = '';
  let beforeImageAlt = '';
  let afterImageAlt = '';
  
  // Open lightbox when clicking comparison images
  const comparisonImageContainers = document.querySelectorAll('.comparison-images');
  comparisonImageContainers.forEach(container => {
    container.addEventListener('click', function() {
      currentCard = this;
      const beforeImg = this.querySelector('.comparison-before img');
      const afterImg = this.querySelector('.comparison-after img');
      
      if (beforeImg && afterImg) {
        beforeImageSrc = beforeImg.src;
        afterImageSrc = afterImg.src;
        beforeImageAlt = beforeImg.alt;
        afterImageAlt = afterImg.alt;
        
        // Start with "before" image
        currentImageIndex = 0;
        openLightbox();
      }
    });
  });
  
  function openLightbox() {
    lightboxModal.classList.add('active');
    document.body.classList.add('lightbox-open');
    showCurrentImage();
  }
  
  function closeLightbox() {
    lightboxModal.classList.remove('active');
    document.body.classList.remove('lightbox-open');
    lightboxImage.classList.remove('loaded');
  }
  
  function showCurrentImage() {
    // Remove loaded class for fade transition
    lightboxImage.classList.remove('loaded');
    
    // Small delay to trigger transition
    setTimeout(() => {
      if (currentImageIndex === 0) {
        // Show Before
        lightboxImage.src = beforeImageSrc;
        lightboxImage.alt = beforeImageAlt;
        lightboxLabel.textContent = 'Before';
      } else {
        // Show After
        lightboxImage.src = afterImageSrc;
        lightboxImage.alt = afterImageAlt;
        lightboxLabel.textContent = 'After';
      }
      
      // Wait for image to load before showing
      lightboxImage.onload = function() {
        lightboxImage.classList.add('loaded');
      };
    }, 50);
  }
  
  function showNextImage() {
    if (currentImageIndex < 1) {
      currentImageIndex++;
      showCurrentImage();
    }
  }
  
  function showPrevImage() {
    if (currentImageIndex > 0) {
      currentImageIndex--;
      showCurrentImage();
    }
  }
  
  // Close button
  closeButton.addEventListener('click', closeLightbox);
  
  // Navigation buttons
  nextButton.addEventListener('click', showNextImage);
  prevButton.addEventListener('click', showPrevImage);
  
  // Close on overlay click (but not on image)
  lightboxModal.addEventListener('click', function(e) {
    if (e.target === lightboxModal) {
      closeLightbox();
    }
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (!lightboxModal.classList.contains('active')) return;
    
    switch(e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowRight':
        showNextImage();
        break;
      case 'ArrowLeft':
        showPrevImage();
        break;
    }
  });
  
  // Touch/swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  lightboxModal.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
  }, false);
  
  lightboxModal.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, false);
  
  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swiped left - show next
        showNextImage();
      } else {
        // Swiped right - show previous
        showPrevImage();
      }
    }
  }
});
