/* ============================================
   A STERLING LANDSCAPES — Main JavaScript
   v3: Enhanced animations + stat counters
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // --- Header Scroll Effect ---
  const header = document.querySelector('.site-header');
  const floatingCta = document.querySelector('.floating-cta');
  const backToTop = document.querySelector('.back-to-top');

  function handleScroll() {
    const scrollY = window.scrollY;

    // Header shadow
    if (header) {
      header.classList.toggle('scrolled', scrollY > 50);
    }

    // Floating CTA
    if (floatingCta) {
      floatingCta.classList.toggle('visible', scrollY > 600);
    }

    // Back to top
    if (backToTop) {
      backToTop.classList.toggle('visible', scrollY > 800);
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --- Back to Top ---
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Mobile Navigation ---
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  const body = document.body;

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('active');
      mainNav.classList.toggle('open');
      body.style.overflow = mainNav.classList.contains('open') ? 'hidden' : '';
    });

    // Close nav on link click
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth <= 768) {
          navToggle.classList.remove('active');
          mainNav.classList.remove('open');
          body.style.overflow = '';
        }
      });
    });

    // Mobile dropdown toggle
    const dropdownParents = mainNav.querySelectorAll('.has-dropdown > a');
    dropdownParents.forEach(function (link) {
      link.addEventListener('click', function (e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          const parent = this.parentElement;
          parent.classList.toggle('dropdown-open');
        }
      });
    });
  }

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', function () {
        const isActive = item.classList.contains('active');
        // Close all
        faqItems.forEach(function (fi) { fi.classList.remove('active'); });
        // Toggle current
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // --- Smooth Scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = header ? header.offsetHeight + 20 : 20;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // --- Staggered Animation Setup ---
  // Assign stagger index to sibling groups
  function assignStagger(selector) {
    const groups = {};
    document.querySelectorAll(selector).forEach(function (el) {
      const parent = el.parentElement;
      if (!groups[parent]) {
        groups[parent] = 0;
      }
      el.style.setProperty('--stagger', groups[parent]);
      groups[parent]++;
    });
  }

  assignStagger('.service-card');
  assignStagger('.project-card');
  assignStagger('.blog-card');
  assignStagger('.stat');

  // --- Intersection Observer for fade-in animations ---
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.section, .service-card, .project-card, .blog-card, .stat').forEach(function (el) {
    el.classList.add('animate-target');
    observer.observe(el);
  });

  // --- Animated Stat Counters ---
  function animateCounter(el) {
    const text = el.textContent.trim();
    // Parse: extract prefix (e.g. "£"), number, and suffix (e.g. "+", "K+")
    const match = text.match(/^([^\d]*)(\d+)(.*)$/);
    if (!match) return;

    const prefix = match[1];
    const target = parseInt(match[2], 10);
    const suffix = match[3];
    const duration = 1600;
    const start = performance.now();

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.round(easeOutQuart(progress) * target);
      el.textContent = prefix + current + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }

  const statObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat__number').forEach(function (el) {
    statObserver.observe(el);
  });

  // --- Contact Form (basic validation) ---
  const contactForm = document.querySelector('.contact-form form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      // In production, this would submit to a backend
      const btn = this.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Message Sent — Thank You';
      btn.disabled = true;
      btn.style.opacity = '0.7';
      setTimeout(function () {
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.opacity = '1';
        contactForm.reset();
      }, 3000);
    });
  }

  // --- Active Nav Highlight ---
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  const navLinks = document.querySelectorAll('.nav-list a');
  navLinks.forEach(function (link) {
    const href = link.getAttribute('href');
    if (href) {
      const linkPath = href.replace(/\.html$/, '').replace(/\/$/, '') || '/';
      if (currentPath === linkPath || (currentPath.includes(linkPath) && linkPath !== '/')) {
        link.classList.add('active');
      }
    }
  });

});

/* --- Animation CSS injected via JS --- */
(function () {
  const style = document.createElement('style');
  style.textContent = `
    .animate-target {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      transition-delay: calc(var(--stagger, 0) * 0.1s);
    }
    .animate-target.animate-in {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);
})();
