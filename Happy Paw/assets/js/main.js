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
      if (overlay) {
        overlay.classList.remove("hidden");
      }
      setTimeout(() => {
        window.location.href = href;
      }, 220);
    });
  });

  window.addEventListener("load", () => {
    if (overlay) {
      setTimeout(() => overlay.classList.add("hidden"), 80);
    }
  });
})();
