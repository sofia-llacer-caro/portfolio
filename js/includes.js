async function loadIncludes() {
  const slots = Array.from(document.querySelectorAll('[data-include]'));
  await Promise.all(slots.map(async slot => {
    try {
      const res = await fetch(slot.dataset.include);
      if (!res.ok) return;
      const html = await res.text();
      const tmp = document.createElement('div');
      tmp.innerHTML = html;
      slot.replaceWith(...tmp.childNodes);
    } catch (e) {
      console.warn('[includes] could not load', slot.dataset.include, e);
    }
  }));
}

function setActiveNavLink() {
  const path = window.location.pathname;
  const file = path.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    const page = link.dataset.page;
    const isActive =
      (page === 'home' && (file === '' || file === 'index.html')) ||
      (page !== 'home' && file.startsWith(page));
    link.classList.toggle('active', isActive);
    if (isActive) link.setAttribute('aria-current', 'page');
  });
}

function wireMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (!toggle || !navLinks) return;
  toggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', e => {
    if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

function wireLangSwitcher() {
  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.addEventListener('click', () => i18n.setLanguage(btn.dataset.lang));
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadIncludes();
  setActiveNavLink();
  wireMobileMenu();
  wireLangSwitcher();
  await i18n.init();
  document.dispatchEvent(new Event('app:ready'));
});
