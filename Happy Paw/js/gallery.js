const galleryImages = document.querySelectorAll('.gallery-item img');
const popup = document.getElementById('popup');
const popupImg = document.getElementById('popupImg');
const creditText = document.getElementById('credit');
const closeBtn = document.getElementById('closeBtn');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');

let currentIndex = 0;

galleryImages.forEach((img, index) => {
  img.addEventListener('click', () => {
    popup.classList.remove('hidden');
    popupImg.src = img.src;
    creditText.textContent = img.dataset.credit;
    currentIndex = index;
  });
});

closeBtn.addEventListener('click', () => {
  popup.classList.add('hidden');
});

nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % galleryImages.length;
  updatePopup();
});

prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
  updatePopup();
});

function updatePopup() {
  popupImg.src = galleryImages[currentIndex].src;
  creditText.textContent = galleryImages[currentIndex].dataset.credit;
}

window.addEventListener('keydown', (e) => {
  if (popup.classList.contains('hidden')) return;
  if (e.key === 'ArrowRight') nextBtn.click();
  if (e.key === 'ArrowLeft') prevBtn.click();
  if (e.key === 'Escape') closeBtn.click();
});