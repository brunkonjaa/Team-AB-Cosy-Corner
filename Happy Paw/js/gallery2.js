
    const photos = [
      { src: "../images/gallery/photo_1.jpg", alt: "Cute Groomed Dog", credit: "Happy Paw Gallery" },
      { src: "../images/gallery/photo_2.jpg", alt: "Cat portrait", credit: "Happy Paw Gallery" },
      { src: "../images/gallery/photo_3.jpg", alt: "Smiling Puppy", credit: "Happy Paw Gallery" },
      { src: "../images/gallery/photo_4.jpg", alt: "Cat looking back", credit: "Happy Paw Gallery" },
      { src: "../images/gallery/photo_5.jpg", alt: "Brown tabby cat", credit: "Happy Paw Gallery" },
      { src: "../images/gallery/photo_6.jpg", alt: "Cat sitting indoor", credit: "Happy Paw Gallery" },
      { src: "../images/gallery/photo_7.jpg", alt: "Cute Groomed Dog", credit: "Happy Paw Gallery" },
      { src: "../images/gallery/photo_8.jpg", alt: "Running dogs", credit: "Happy Paw Gallery" }
    ];

    const carousel = document.getElementById('carousel');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    
    let rotation = 0;
    const total = photos.length;
    const step = 360 / total;
    const radius = 550;

    let audioCtx;
    function initAudio() {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

  // Plays a mechanical revolver cylinder click sound
    // Combines multiple audio components to simulate metal-on-metal locking
    function playClick() {
      initAudio();
      const now = audioCtx.currentTime;
      
    
      
      // Component 3: Low thud (mechanical lock engaging)
      // Simulates the heavy mechanism locking into place
      const osc3 = audioCtx.createOscillator();
      const gain3 = audioCtx.createGain();
      osc3.connect(gain3);
      gain3.connect(audioCtx.destination);
      osc3.frequency.value = 150; // Low bass thump
      osc3.type = 'sine'; // Smooth low end
      gain3.gain.setValueAtTime(0.5, now);
      gain3.gain.exponentialRampToValueAtTime(0.01, now + 0.06); // Longer decay
      osc3.start(now);
      osc3.stop(now + 0.06);
    
    }

   // Create cards
    photos.forEach((photo, i) => {
      const card = document.createElement('div');
      card.className = 'carousel-card';
      card.innerHTML = `<img src="${photo.src}" alt="${photo.alt}">`;
      card.dataset.index = i;
      carousel.appendChild(card);
    });

    // Updates carousel card positions and visibility
    function update() {
      const cards = carousel.children;
      
      // First pass: Update 3D transforms for all cards
      for (let i = 0; i < cards.length; i++) {
        const angle = step * i + rotation; // Calculate current angle for this card
        const rad = angle * Math.PI / 180; // Convert to radians
        const x = Math.sin(rad) * radius; // X position on cylinder
        const z = Math.cos(rad) * radius; // Z position (depth)
        
        // Apply 3D transform to position card on cylinder
        cards[i].style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
      }
      
      // Second pass: Update visibility/opacity AFTER transforms complete
      // This ensures opacity is based on NEW position, not old position
      requestAnimationFrame(() => {
        for (let i = 0; i < cards.length; i++) {
          const angle = step * i + rotation;
          const rad = angle * Math.PI / 180;
          const z = Math.cos(rad) * radius; // Recalculate Z position
          
          // Set opacity and interactivity based on depth (z position)
          // Cards at front (z > 100) are fully visible and clickable
          if (z > 100) {
            cards[i].style.opacity = '1';
            cards[i].style.pointerEvents = 'auto';
          } 
          // Cards on sides (z > -200) are semi-transparent and not clickable
          else if (z > -200) {
            cards[i].style.opacity = '0.4';
            cards[i].style.pointerEvents = 'none';
          } 
          // Cards at back (z <= -200) are nearly invisible
          else {
            cards[i].style.opacity = '0.1';
            cards[i].style.pointerEvents = 'none';
          }
        }
      });
    }

    let lastZone = -1;
    function checkClick() {
      const zone = Math.floor(((rotation % 360) + 360) % 360 / step);
      if (lastZone !== -1 && zone !== lastZone) {
        playClick();
      }
      lastZone = zone;
    }

    let isRotating = false;
    let currentRotation = 0;
    let targetRotation = 0;
    
    function animateRotation() {
      const diff = targetRotation - currentRotation;
      
      if (Math.abs(diff) > 0.1) {
        // Smooth interpolation - adjust speed here (0.08 = slower, 0.15 = faster)
        currentRotation += diff * 0.12;
        carousel.style.transform = `rotateY(${currentRotation}deg)`;
        rotation = currentRotation;
        update();
        requestAnimationFrame(animateRotation);
      } else {
        currentRotation = targetRotation;
        rotation = currentRotation;
        carousel.style.transform = `rotateY(${currentRotation}deg)`;
        update();
        isRotating = false;
      }
    }
    
    function rotate(dir) {
      if (isRotating) return;
      isRotating = true;
      
      targetRotation -= dir * (step / 2);
      checkClick();
      animateRotation();
    }

    prevBtn.onclick = () => { initAudio(); rotate(-1); };
    nextBtn.onclick = () => { initAudio(); rotate(1); };

    document.addEventListener('keydown', e => {
      if (!document.getElementById('lightbox').classList.contains('show')) {
        if (e.key === 'ArrowLeft') { initAudio(); rotate(-1); }
        if (e.key === 'ArrowRight') { initAudio(); rotate(1); }
      }
    });

    // Lightbox
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lbImg');
    const lbCredit = document.getElementById('lbCredit');
    const lbClose = document.getElementById('lbClose');
    const lbPrev = document.getElementById('lbPrev');
    const lbNext = document.getElementById('lbNext');
    let lbIndex = 0;

    function openLightbox(idx) {
      lbIndex = idx;
      lbImg.src = photos[idx].src;
      lbImg.alt = photos[idx].alt;
      lbCredit.textContent = photos[idx].credit;
      lb.classList.add('show');
    }

    function closeLightbox() {
      lb.classList.remove('show');
    }

    function showPhoto(idx) {
      lbIndex = (idx + total) % total;
      lbImg.src = photos[lbIndex].src;
      lbImg.alt = photos[lbIndex].alt;
      lbCredit.textContent = photos[lbIndex].credit;
    }

    carousel.onclick = e => {
      const card = e.target.closest('.carousel-card');
      if (card && card.style.pointerEvents !== 'none') {
        openLightbox(parseInt(card.dataset.index));
      }
    };

    lbClose.onclick = closeLightbox;
    lb.onclick = e => { if (e.target === lb) closeLightbox(); };
    lbPrev.onclick = () => showPhoto(lbIndex - 1);
    lbNext.onclick = () => showPhoto(lbIndex + 1);

    document.addEventListener('keydown', e => {
      if (lb.classList.contains('show')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPhoto(lbIndex - 1);
        if (e.key === 'ArrowRight') showPhoto(lbIndex + 1);
      }
    });

    update();