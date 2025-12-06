// Happy Paw shared interactions
(function () {
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  const footer = document.querySelector(".footer");
  const overlay = document.querySelector(".page-transition-overlay");

  // Mobile nav toggler
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
  }

  // Retractable footer (hover/tab only; no scroll popups)
  if (footer) {
    const isTouch = window.matchMedia && window.matchMedia("(hover: none)").matches;
    const openFooter = () => footer.classList.add("open");
    const closeFooter = () => footer.classList.remove("open");
    let isHoveringFooter = false;
    let hasScrolled = false;
    const staticScrollThreshold = 300;

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
  // Konami Code Easter Egg
  // Inspired by the classic Konami Code cheat (↑↑↓↓←→←→BA)
  // Origin: https://en.wikipedia.org/wiki/Konami_Code
  // First appeared in Gradius (1986) and popularized by Contra (1988)
  // ------------------------------
  const secretBtn = document.querySelector('#secretBtn');
  if (secretBtn) {
    secretBtn.addEventListener('click', () => {
      alert('🎮 Secret Code:\n\n↑ ↑ ↓ ↓ ← → ← → B A\n\nYou found the secret code, try it 😉');
    });
  }

  let keys = [];
  const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
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
  // Parallax effect for tilted photo cards (About page)
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
