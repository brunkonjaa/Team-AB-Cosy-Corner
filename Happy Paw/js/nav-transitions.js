// Navigation Transitions with Barba.js
// Added: November 12, 2025
// This script enables smooth page transitions between HTML pages


// Navigation Transitions with Barba.js
// UMD global usage (Barba.js loaded via CDN)
// Added: November 12, 2025
// This script enables smooth page transitions between HTML pages

document.addEventListener('DOMContentLoaded', function() {
  initBarbaTransitions();
  initNavbarFallbacks();
});

function initBarbaTransitions() {
  if (!window.barba) return;

  window.barba.init({
    transitions: [{
      name: 'fade',
      leave({ current }) {
        return new Promise(resolve => {
          current.container.classList.add('fade-out');
          setTimeout(resolve, 500); // match CSS animation duration
        });
      },
      enter({ next }) {
        next.container.classList.add('fade-in');
        setTimeout(() => {
          next.container.classList.remove('fade-in');
        }, 500);
      }
    }]
  });

  window.barba.hooks.before(() => {
    document.body.classList.add('is-loading');
  });
  window.barba.hooks.after(() => {
    document.body.classList.remove('is-loading');
  });
}

function initNavbarFallbacks() {
  const bootstrapActive = typeof window.bootstrap !== 'undefined';
  const toggler = document.querySelector('.navbar-toggler');
  const targetSelector = toggler ? toggler.getAttribute('data-bs-target') : null;
  const target = targetSelector ? document.querySelector(targetSelector) : null;

  if (toggler && target) {
    toggler.addEventListener('click', event => {
      if (bootstrapActive) return;
      event.preventDefault();
      const isOpen = target.classList.toggle('show');
      toggler.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    target.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (bootstrapActive) return;
        target.classList.remove('show');
        toggler.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const dropdownToggles = Array.from(document.querySelectorAll('[data-bs-toggle="dropdown"]'));
  if (!dropdownToggles.length) return;

  dropdownToggles.forEach(toggle => {
    const menu = toggle.nextElementSibling;
    if (!menu) return;

    toggle.addEventListener('click', event => {
      if (bootstrapActive) return;
      event.preventDefault();
      const isOpen = menu.classList.toggle('show');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });

  document.addEventListener('click', event => {
    if (bootstrapActive) return;
    dropdownToggles.forEach(toggle => {
      const menu = toggle.nextElementSibling;
      if (!menu || !menu.classList.contains('show')) return;
      if (toggle.contains(event.target) || menu.contains(event.target)) return;
      menu.classList.remove('show');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}
