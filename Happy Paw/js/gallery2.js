
    const photos = [
      { src: "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=600&h=800&fit=crop", alt: "Cute Groomed Dog", credit: "Photo by Jamie Street on Unsplash" },
      { src: "https://images.unsplash.com/photo-1647806422508-0322f33e270b?w=600&h=800&fit=crop", alt: "Cat portrait", credit: "Photo by Shabnam Rahman on Unsplash" },
      { src: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600&h=800&fit=crop", alt: "Smiling Puppy", credit: "Photo by Alvan Nee on Unsplash" },
      { src: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=600&h=800&fit=crop", alt: "Cat looking back", credit: "Photo by Nick Karvounis on Unsplash" },
      { src: "https://images.unsplash.com/photo-1557246565-8a3d3ab5d7f6?w=600&h=800&fit=crop", alt: "Brown tabby cat", credit: "Photo by someone on Unsplash" },
      { src: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=600&h=800&fit=crop", alt: "Cat sitting indoor", credit: "Photo by Tran Mau Tri Tam on Unsplash" },
      { src: "https://images.unsplash.com/photo-1600804340584-c7db2eacf0bf?w=600&h=800&fit=crop", alt: "Cute Groomed Dog", credit: "Photo by Jamie Street on Unsplash" },
      { src: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=800&fit=crop", alt: "Running dogs", credit: "Photo by someone on Unsplash" }
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

    function rotate(dir) {
      rotation -= dir * step;
      carousel.style.transform = `rotateY(${rotation}deg)`;
      update();
      checkClick();
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