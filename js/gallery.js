/**
 * Gallery Lightbox with Keyboard & Swipe Support
 * A Sterling Landscapes
 */
(function() {
  'use strict';

  // Get all gallery items and lightbox elements
  const galleryItems = document.querySelectorAll('.gallery-grid__item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  let currentIndex = 0;
  let imageSources = [];

  // Build array of full-size image sources
  galleryItems.forEach((item, index) => {
    const fullSrc = item.getAttribute('data-full');
    imageSources.push(fullSrc);

    // Click to open lightbox
    item.addEventListener('click', function() {
      currentIndex = index;
      showLightbox();
    });
  });

  // Show lightbox
  function showLightbox() {
    lightboxImg.src = imageSources[currentIndex];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  // Hide lightbox
  function hideLightbox() {
    lightbox.classList.remove('active');
    lightboxImg.src = '';
    document.body.style.overflow = ''; // Restore scrolling
  }

  // Navigate to previous image
  function showPrev() {
    currentIndex = (currentIndex - 1 + imageSources.length) % imageSources.length;
    lightboxImg.src = imageSources[currentIndex];
  }

  // Navigate to next image
  function showNext() {
    currentIndex = (currentIndex + 1) % imageSources.length;
    lightboxImg.src = imageSources[currentIndex];
  }

  // Event listeners
  closeBtn.addEventListener('click', hideLightbox);
  prevBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    showPrev();
  });
  nextBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    showNext();
  });

  // Click outside image to close
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      hideLightbox();
    }
  });

  // Keyboard support
  document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') {
      hideLightbox();
    } else if (e.key === 'ArrowLeft') {
      showPrev();
    } else if (e.key === 'ArrowRight') {
      showNext();
    }
  });

  // Touch/swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
  }, false);

  lightbox.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, false);

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swiped left - show next
        showNext();
      } else {
        // Swiped right - show previous
        showPrev();
      }
    }
  }

})();
