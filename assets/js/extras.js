// Optional extras: wellness log, form toasts, and 3D carousel/lightbox.
(function () {
// Optional extras: Wellness log, simple form messages, and a gallery.
// These features are small helpers used on some pages. They don't change
// the main site functionality - they just make things nicer.
  document.addEventListener("DOMContentLoaded", () => {
    initWellness();
    initFormToasts();
    initCarousel();
  });

  // ------------------------------
  // Wellness log (Trust Hub)
  // ------------------------------
    // This part provides a small log for staff to record observations about
    // a pet visit (like dry paws). Entries are saved in the browser so you
    // can see previous notes and which issues happen more than once.
  function initWellness() {
    const form = document.querySelector("#wellnessForm");
    const entriesBody = document.querySelector("#wellnessEntries");
    const emptyState = document.querySelector("#wellnessEmpty");
    const trendList = document.querySelector("#trendList");
    if (!form || !entriesBody || !trendList) return;

    const STORAGE_KEY = "hpWellnessEntries";
      // Browser storage key and a small initial dataset for the demo
    const SEED = [
      { petName: "Luna", observationType: "Dry paws", severity: "Moderate", notes: "Cracks between pads, balm + booties", visitDate: "2025-11-05" },
      { petName: "Max", observationType: "Coat matting", severity: "Severe", notes: "Hips matted, advised slicker comb homework", visitDate: "2025-10-28" },
      { petName: "Luna", observationType: "Dry paws", severity: "Mild", notes: "Improving but still dry after forest walks", visitDate: "2025-10-14" },
    ];

    let entries = loadEntries();
    render(entries);

    form.addEventListener("submit", (event) => {
      // When user submits the form, add a new log entry and refresh the list
      event.preventDefault();
      const formData = new FormData(form);
      const entry = {
        petName: (formData.get("petName") || "Unnamed friend").trim(),
        observationType: formData.get("observationType") || "General",
        severity: formData.get("severity") || "Mild",
        notes: (formData.get("notes") || "—").trim(),
        visitDate: formData.get("visitDate"),
      };
      entries = [entry, ...entries].slice(0, 12);
      saveEntries(entries);
      render(entries);
      form.reset();
    });

    function render(list) {
      // Update table that shows log entries, and show or hide the empty state
      if (!list.length) {
        emptyState.hidden = false;
        entriesBody.innerHTML = "";
      } else {
        emptyState.hidden = true;
        entriesBody.innerHTML = list
          .map(
            (entry) => `
              <tr>
                <td>${sanitize(entry.petName)}</td>
                <td>${sanitize(entry.observationType)}</td>
                <td>${sanitize(entry.severity)}</td>
                <td>${formatDate(entry.visitDate)}</td>
              </tr>
            `
          )
          .join("");
      }
      renderTrends(list);
    }

    function renderTrends(list) {
      // Look for issues that happen more than once and show a short note for each
      if (!list.length) {
        trendList.innerHTML = `<div class="wellness-empty">Log a few sessions to see pattern prompts.</div>`;
        return;
      }
      const summary = list.reduce((acc, entry) => {
        const key = entry.observationType;
        if (!acc[key]) acc[key] = { count: 0, lastSeverity: entry.severity, sample: entry.petName };
        acc[key].count += 1;
        acc[key].lastSeverity = entry.severity;
        acc[key].sample = entry.petName;
        return acc;
      }, {});
      const ranked = Object.entries(summary)
        .filter(([, data]) => data.count >= 2)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 4);
      if (!ranked.length) {
        trendList.innerHTML = `<div class="trend-pill positive">All clear — no repeated concerns logged.</div>`;
        return;
      }
      trendList.innerHTML = ranked
        .map(([issue, data]) => {
          const tone = data.count >= 3 ? "alert" : "";
          const suggestion = buildSuggestion(issue, data.count, data.lastSeverity);
          return `<div class="trend-pill ${tone}"><span>${issue} ×${data.count}</span><span>${suggestion}</span></div>`;
        })
        .join("");
    }

    function loadEntries() {
      // Load entries from browser storage (localStorage), or use initial data
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) return JSON.parse(cached);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
        return [...SEED];
      } catch {
        return [...SEED];
      }
    }

    function saveEntries(list) {
      // Save the entries back to localStorage so data stays in the browser
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      } catch (e) {
        console.warn("Unable to persist wellness entries", e);
      }
    }
  }

  function buildSuggestion(issue, count, severity) {
    // Give a short suggestion text for a repeated issue or a severe case
    const base = {
      "Dry paws": "Suggest balm add-on + home hydration plan.",
      "Coat matting": "Offer maintenance trim or comb coaching.",
      "Skin redness": "Flag for vet follow-up if irritation continues.",
      "Shedding spike": "Promote de-shedding package and omega boosters.",
      "Ear irritation": "Recommend gentle ear cleanse & monitor.",
    };
    if (count >= 3 || severity === "Severe") {
      return base[issue] || "Highlight for owner conversation.";
    }
    return "Monitor next visit to confirm improvement.";
  }

  function sanitize(value) {
    // Escape special characters to keep text safe when we display it on the page
    return value?.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch])) || "";
  }

  function formatDate(value) {
    // Show a short, readable date string for the visit date (e.g. "Nov 05")
    if (!value) return "—";
    try {
      const formatter = new Intl.DateTimeFormat("en-IE", { month: "short", day: "2-digit" });
      return formatter.format(new Date(value));
    } catch {
      return value;
    }
  }

  // ------------------------------
  // Form toasts (Contact/Booking)
  // ------------------------------
    // Small messages when a form is submitted
    // These are tiny messages shown to the user when a contact or booking
    // form is submitted. They do not send data anywhere by themselves.
  function initFormToasts() {
    const toast = document.querySelector("#toast");
    const contactForm = document.querySelector("#contactForm");
    const bookingForm = document.querySelector("#bookingForm");
    const thankYou = document.querySelector("#thankYouMessage");

    if (contactForm) {
      // Show a short message at top of the page when contact form is sent
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (toast) {
          toast.classList.add("show");
          setTimeout(() => toast.classList.remove("show"), 2600);
        }
        contactForm.reset();
      });
    }

    if (bookingForm) {
      // Show a quick “thank you” message when booking form is sent
      bookingForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (thankYou) {
          thankYou.classList.add("show");
          setTimeout(() => thankYou.classList.remove("show"), 2600);
        }
        bookingForm.reset();
      });
    }
  }

  // ------------------------------
  // 3D carousel + lightbox (Gallery)
  // ------------------------------
    // Gallery carousel and lightbox
    // A rotating gallery with a larger view that opens when you click an image.
  function initCarousel() {
    const stage = document.querySelector(".carousel-stage");
    const carousel = document.querySelector("#carousel");
    const prevBtn = document.querySelector("#prev");
    const nextBtn = document.querySelector("#next");
    const lb = document.querySelector("#lightbox");
    const lbImg = document.querySelector("#lbImg");
    const lbCredit = document.querySelector("#lbCredit");
    const lbClose = document.querySelector("#lbClose");
    const lbPrev = document.querySelector("#lbPrev");
    const lbNext = document.querySelector("#lbNext");
    if (!stage || !carousel || !prevBtn || !nextBtn || !lb || !lbImg || !lbCredit || !lbClose || !lbPrev || !lbNext) return;
      // If we don't have right HTML on this page, stop doing anything here

    const photos = [
      // Photos used in gallery. Each item has a source, alt text, and credit.
      { src: "../assets/img/gallery-01.webp", alt: "Teddy trim", credit: "Happy Paw" },
      { src: "../assets/img/gallery-02.webp", alt: "Post-bath smiles", credit: "Happy Paw" },
      { src: "../assets/img/gallery-03.webp", alt: "Gentle scissoring", credit: "Happy Paw" },
      { src: "../assets/img/gallery-04.webp", alt: "Puppy intro", credit: "Happy Paw" },
      { src: "../assets/img/gallery-05.webp", alt: "Spa bubbles", credit: "Happy Paw" },
      { src: "../assets/img/gallery-06.webp", alt: "Towel wrap", credit: "Happy Paw" },
      { src: "../assets/img/gallery-07.webp", alt: "Finishing touches", credit: "Happy Paw" },
      { src: "../assets/img/gallery-08.webp", alt: "Happy portraits", credit: "Happy Paw" },
      { src: "../assets/img/gallery-09.webp", alt: "Groom room", credit: "Happy Paw" },
      { src: "../assets/img/gallery-10.webp", alt: "Tools ready", credit: "Happy Paw" },
      { src: "../assets/img/gallery-11.webp", alt: "Outdoor joy", credit: "Happy Paw" },
      { src: "../assets/img/gallery-12.webp", alt: "Fresh cut", credit: "Happy Paw" }
    ];

    const total = photos.length;
    const step = 360 / total;
    const radius = 520;
    let targetRotation = 0;
    let currentRotation = 0;
    let isRotating = false;
    let lbIndex = 0;

    photos.forEach((photo, i) => {
      // Build small cards for each photo and add them to carousel
      const card = document.createElement("div");
      card.className = "carousel-card";
      card.innerHTML = `<img src="${photo.src}" alt="${photo.alt}">`;
      card.dataset.index = i;
      carousel.appendChild(card);
    });

    function updatePositions() {
      // Update each card's position and appearance based on current rotation
      const cards = carousel.children;
      for (let i = 0; i < cards.length; i++) {
        const angle = step * i + currentRotation;
        cards[i].style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
        cards[i].style.opacity = "1";
      }
      requestAnimationFrame(() => {
        for (let i = 0; i < cards.length; i++) {
          const angle = step * i + currentRotation;
          const rad = (angle * Math.PI) / 180;
          const z = Math.cos(rad) * radius;
          if (z > 0) {
            cards[i].style.pointerEvents = "auto";
          } else {
            cards[i].style.pointerEvents = "none";
          }
        }
      });
    }

    function animate() {
      // Smoothly move the carousel until it settles on target rotation
      const diff = targetRotation - currentRotation;
      if (Math.abs(diff) > 0.1) {
        currentRotation += diff * 0.12;
        carousel.style.transform = `rotateY(${currentRotation}deg)`;
        updatePositions();
        requestAnimationFrame(animate);
      } else {
        currentRotation = targetRotation;
        carousel.style.transform = `rotateY(${currentRotation}deg)`;
        updatePositions();
        isRotating = false;
      }
    }

    function rotate(dir) {
      // Move the carousel one step to the left or right
      targetRotation -= dir * (step / 2);
      if (!isRotating) {
        isRotating = true;
        animate();
      }
    }

    prevBtn.addEventListener("click", () => rotate(-1));
      // Arrow buttons: rotate carousel
    nextBtn.addEventListener("click", () => rotate(1));

    carousel.addEventListener("click", (e) => {
      // Clicking a card opens bigger view (lightbox) for that photo
      const card = e.target.closest(".carousel-card");
      if (!card || card.style.pointerEvents === "none") return;
      openLightbox(parseInt(card.dataset.index, 10));
    });

    function openLightbox(idx) {
      // Open lightbox and show selected photo
      lbIndex = idx;
      showPhoto(lbIndex);
      lb.classList.add("show");
    }

    function showPhoto(idx) {
      // Update the lightbox with photo
      lbIndex = (idx + photos.length) % photos.length;
      lbImg.src = photos[lbIndex].src;
      lbImg.alt = photos[lbIndex].alt;
      lbCredit.textContent = photos[lbIndex].credit;
    }

    function closeLightbox() {
      // Close big photo view
      lb.classList.remove("show");
    }

    lbClose.addEventListener("click", closeLightbox);
    lb.addEventListener("click", (e) => {
      if (e.target === lb) closeLightbox();
    });
    lbPrev.addEventListener("click", () => showPhoto(lbIndex - 1));
    lbNext.addEventListener("click", () => showPhoto(lbIndex + 1));

    document.addEventListener("keydown", (e) => {
      if (lb.classList.contains("show")) {
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowLeft") showPhoto(lbIndex - 1);
        if (e.key === "ArrowRight") showPhoto(lbIndex + 1);
      } else if (stage.contains(document.activeElement) || document.activeElement === document.body) {
        if (e.key === "ArrowLeft") rotate(-1);
        if (e.key === "ArrowRight") rotate(1);
      }
    });

    // initial position
    updatePositions();
  }
})();
