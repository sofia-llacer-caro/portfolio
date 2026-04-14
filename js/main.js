// ============================================
// INTERVISIONS — Main JS
// ============================================

// Menu overlay
const menuBtn = document.getElementById('menuBtn');
const menuOverlay = document.getElementById('menuOverlay');
const menuClose = document.getElementById('menuClose');

if (menuBtn && menuOverlay) {
  menuBtn.addEventListener('click', () => {
    menuOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
}
if (menuClose && menuOverlay) {
  menuClose.addEventListener('click', () => {
    menuOverlay.classList.remove('open');
    document.body.style.overflow = '';
  });
}

// Accordion
document.querySelectorAll('.accordion-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const item = trigger.closest('.accordion-item');
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.accordion-item.open').forEach(el => el.classList.remove('open'));
    // Toggle clicked
    if (!isOpen) item.classList.add('open');
  });
});