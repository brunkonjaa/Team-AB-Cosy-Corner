// Shared UI behaviours used across the site: small scripts for the nav,
// the footer, link transitions, a little hidden easter egg, and a bit of
// visual motion on the About page.
(function () {
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  const footer = document.querySelector(".footer");
  const overlay = document.querySelector(".page-transition-overlay");

  // Mobile menu button
  // On small screens the nav button opens and closes the main navigation
  // so the menu doesn't always take up space.
  // (This only toggles a CSS class, it doesn't change the HTML.)
  // Mobile nav toggler
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
  }

  // Footer behavior on touch vs desktop
  // On phones the footer opens based on scrolling so it doesn't block the page
  // On desktop the footer opens when the pointer is near the bottom of the page
  // (hover) or after the user scrolls down a bit.
  // Retractable footer (hover/tab only; no scroll popups)
  if (footer) {
    const isTouch = window.matchMedia && window.matchMedia("(hover: none)").matches;
    const openFooter = () => footer.classList.add("open");
    const closeFooter = () => footer.classList.remove("open");
    let isHoveringFooter = false;
    let hasScrolled = false;
    const staticScrollThreshold = 300;

    // Touch devices: open/close the footer based on how the page scrolls
    if (isTouch) {
      closeFooter();
      let lastY = window.scrollY;
      const handleTouchScroll = () => {
        const currentY = window.scrollY;
        const delta = currentY - lastY;
        if (delta > 24) openFooter();
        if (delta < -12) closeFooter();
        if (currentY < 80) closeFooter();
        lastY = currentY;
      };
      window.addEventListener("scroll", handleTouchScroll, { passive: true });
      
      // openFooter(); // always open on touch devices for accessibility
    // Desktop: open/close the footer when the mouse is near the bottom
    } else {
      const updateScrollFlag = () => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const dynamicThreshold = Math.max(staticScrollThreshold, scrollable * 0.6);
        const scrolledNow = window.scrollY > dynamicThreshold;
        if (!scrolledNow && !isHoveringFooter) closeFooter();
        hasScrolled = scrolledNow;
      };

      const handleMove = (e) => {
        const distanceFromBottom = window.innerHeight - e.clientY;
        const nearPointer = distanceFromBottom < 24;
        if (!hasScrolled) return;
        if (nearPointer) openFooter();
        else if (!isHoveringFooter) closeFooter();
      };
      closeFooter();
      updateScrollFlag();
      window.addEventListener("scroll", updateScrollFlag);
      window.addEventListener("mousemove", handleMove);
      footer.addEventListener("mouseenter", () => {
        isHoveringFooter = true;
        openFooter();
      });
      footer.addEventListener("mouseleave", (e) => {
        isHoveringFooter = false;
        const distanceFromBottom = window.innerHeight - e.clientY;
        if (distanceFromBottom > 60) closeFooter();
      });
    }
  }

  // Fade effect when clicking internal links
  // When a user clicks a normal link, the page fades out before navigating.
  // This gives a smoother feel compared to an instant page change.
  // Simple page fade transition
  const internalLinks = document.querySelectorAll("a[href]:not([target]):not([href^='#'])");
  internalLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      e.preventDefault();
      
      // Fade out current content smoothly
      document.body.classList.add("transitioning");
      
      if (overlay) {
        overlay.classList.remove("hidden");
      }
      
      setTimeout(() => {
        window.location.href = href;
      }, 250);
    });
  });

  window.addEventListener("load", () => {
    document.body.classList.remove("transitioning");
    if (overlay) {
      setTimeout(() => overlay.classList.add("hidden"), 100);
    }
  });

  // ------------------------------
  // Konami Code: a little hidden surprise
  // Konami Code easter egg (inspired by the classic Konami Code).
  // Origin: Kazuhisa Hashimoto (used in Gradius, 1986) and popularized by Contra.
  // More info: https://en.wikipedia.org/wiki/Konami_Code
  // If someone types the classic key sequence (up, up, down, down, left, right, left, right, B, A)
  // a small animation plays and a coupon alert appears. It's just for fun.
  // ------------------------------
  const secretBtn = document.querySelector('#secretBtn');
  if (secretBtn) {
    secretBtn.addEventListener('click', () => {
      alert('🎮 Secret Code:\n\n↑ ↑ ↓ ↓ ← → ← → B A\n\nYou found the secret code, try it 😉');
    });
  }

  let keys = [];
  const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  // Watch the last few keys typed and check if they match the code
  document.addEventListener('keydown', (e) => {
    keys.push(e.key);
    keys = keys.slice(-10);
    if (keys.join(',') === code.join(',')) {
      document.body.style.animation = 'spin 1s ease-in-out';
      setTimeout(() => {
        alert('🐾 WOOF WOOF! You unlocked the secret! Good boy/girl! 🐾\n\nUse code: GOODBOY for 10% off your next groom! 💚');
        document.body.style.animation = '';
      }, 1000);
    }
  });

  // ------------------------------
  // Small parallax on the About page
  // Cards with photos tilt and move a bit as you scroll to add visual depth.
  // ------------------------------
  document.addEventListener('scroll', () => {
    const tiltCards = document.querySelectorAll('.tilt-card');
    
    tiltCards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const scrollPercent = (window.innerHeight - rect.top) / window.innerHeight;
      
      if (scrollPercent > 0 && scrollPercent < 1) {
        const speeds = [0.3, 0.6, 0.9]; // Very different speeds
        const moveY = (scrollPercent - 0.5) * 150 * speeds[index];
        const rotation = index === 1 ? 2 : (index === 2 ? -5 : -3);
        card.style.transform = `rotate(${rotation}deg) translateY(${moveY}px)`;
      }
    });
  }, { passive: true });
})();
