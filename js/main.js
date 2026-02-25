/* ============================================================
   ATG-C — Main JavaScript
   Vanilla JS, no dependencies
   ============================================================ */

(function () {
  'use strict';

  /* --------------------------------------------------------
     Sticky nav — add shadow class on scroll
     -------------------------------------------------------- */
  var header = document.getElementById('site-header');

  function updateHeaderShadow() {
    if (window.scrollY > 10) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', updateHeaderShadow, { passive: true });
  updateHeaderShadow();

  /* --------------------------------------------------------
     Mobile hamburger menu
     -------------------------------------------------------- */
  var navToggle = document.getElementById('nav-toggle');
  var navMenu = document.getElementById('nav-menu');

  navToggle.addEventListener('click', function () {
    var isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
    navMenu.classList.toggle('is-open');
  });

  // Close mobile menu when a regular nav link is clicked (not the dropdown trigger)
  navMenu.querySelectorAll('a:not(.nav-dropdown-trigger)').forEach(function (link) {
    link.addEventListener('click', function () {
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open menu');
      navMenu.classList.remove('is-open');
    });
  });

  // Close mobile menu on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      // Close mobile menu
      if (navMenu.classList.contains('is-open')) {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open menu');
        navMenu.classList.remove('is-open');
        navToggle.focus();
      }
      // Close dropdown
      var openDropdown = document.querySelector('.nav-dropdown.is-open');
      if (openDropdown) {
        openDropdown.classList.remove('is-open');
      }
    }
  });

  /* --------------------------------------------------------
     Technologies dropdown
     -------------------------------------------------------- */
  var dropdown = document.querySelector('.nav-dropdown');
  var trigger = document.querySelector('.nav-dropdown-trigger');
  var dropdownMenu = document.querySelector('.nav-dropdown-menu');

  if (dropdown && trigger && dropdownMenu) {
    var openTimer = null;
    var closeTimer = null;
    var isMobile = function () {
      return window.innerWidth <= 640;
    };

    // Toggle on click (works on both mobile and desktop)
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      clearTimeout(openTimer);
      clearTimeout(closeTimer);
      dropdown.classList.toggle('is-open');
    });

    // Desktop: show on hover with delay
    dropdown.addEventListener('mouseenter', function () {
      if (isMobile()) return;
      clearTimeout(closeTimer);
      openTimer = setTimeout(function () {
        dropdown.classList.add('is-open');
      }, 150);
    });

    dropdown.addEventListener('mouseleave', function () {
      if (isMobile()) return;
      clearTimeout(openTimer);
      closeTimer = setTimeout(function () {
        dropdown.classList.remove('is-open');
      }, 300);
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function (e) {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('is-open');
      }
    });

    // Close dropdown when a dropdown link is clicked (on mobile, also close hamburger)
    dropdownMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        dropdown.classList.remove('is-open');
        if (isMobile()) {
          navToggle.setAttribute('aria-expanded', 'false');
          navToggle.setAttribute('aria-label', 'Open menu');
          navMenu.classList.remove('is-open');
        }
      });
    });
  }

  /* --------------------------------------------------------
     Smooth scroll for in-page anchor links
     -------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"], a[href*="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      // Only handle anchors on the same page
      var hashIndex = href.indexOf('#');
      if (hashIndex === -1) return;

      var hash = href.substring(hashIndex);
      if (hash === '#') return;

      // If the href has a path component (like index.html#get-started), only handle
      // if we're on that page or the path is empty
      var path = href.substring(0, hashIndex);
      if (path) {
        var currentPage = window.location.pathname.split('/').pop() || 'index.html';
        // Normalize: treat empty string and index.html as the same
        if (path !== currentPage && !(path === 'index.html' && currentPage === '')) {
          return; // Let the browser navigate normally
        }
      }

      var target = document.querySelector(hash);
      if (!target) return;

      e.preventDefault();

      var headerHeight = header.offsetHeight;
      var targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Move focus to the target for accessibility
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });

      // Update URL hash without jumping
      if (history.pushState) {
        history.pushState(null, null, hash);
      }
    });
  });

  /* --------------------------------------------------------
     Active page detection — highlight current page in nav
     -------------------------------------------------------- */
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';

  // Map pages to their nav items
  var techPages = ['xenium.html', 'crispr.html', 'chemgenomics.html', 'phenotypic.html'];

  // Highlight dropdown trigger if we're on a tech page
  if (trigger && techPages.indexOf(currentPage) !== -1) {
    trigger.classList.add('is-active');
  }

  // Highlight specific dropdown items
  if (dropdownMenu) {
    dropdownMenu.querySelectorAll('a').forEach(function (link) {
      var linkPage = link.getAttribute('href').split('/').pop();
      if (linkPage === currentPage) {
        link.classList.add('is-active');
      }
    });
  }

  // Highlight calculator in dropdown if on calculator page
  if ((currentPage === 'calculator.html' || currentPage === 'in4mer-calculator.html') && trigger) {
    trigger.classList.add('is-active');
  }

})();
