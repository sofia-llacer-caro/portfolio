function initScrollReveal() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.fade-up').forEach(el => el.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

function wireFlipCards() {
  if (!window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('.pub-card').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('a')) return;
      document.querySelectorAll('.pub-card.flipped').forEach(c => {
        if (c !== card) c.classList.remove('flipped');
      });
      card.classList.toggle('flipped');
    });
  });
}

document.addEventListener('app:ready', () => {
  initScrollReveal();
  wireFlipCards();
});
