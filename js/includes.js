// ============================================
// INTERVISIONS — Include Loader
// Loads shared nav and footer into pages
// ============================================

async function loadIncludes() {
  // Detect if we're in a subpage
  const isSubpage = window.location.pathname.includes('/pages/');
  const base = isSubpage ? '../' : './';

  // Load nav
  const navEl = document.getElementById('site-nav-placeholder');
  if (navEl) {
    try {
      const res = await fetch(base + 'pages/nav.html');
      const html = await res.text();
      navEl.innerHTML = html.replaceAll('{{base}}', base);
      // Fix links for subpages
      if (isSubpage) {
        navEl.querySelectorAll('a[href^="/"]').forEach(a => {
          a.href = '..' + a.getAttribute('href');
        });
      }
      // Init menu after loading
      initMenu();
    } catch(e) { console.warn('Nav load failed', e); }
  }

  // Load footer
  const footerEl = document.getElementById('site-footer-placeholder');
  if (footerEl) {
    try {
      const res = await fetch(base + 'pages/footer.html');
      const html = await res.text();
      footerEl.innerHTML = html.replaceAll('{{base}}', base);
      if (isSubpage) {
        footerEl.querySelectorAll('a[href^="/"]').forEach(a => {
          a.href = '..' + a.getAttribute('href');
        });
      }
    } catch(e) { console.warn('Footer load failed', e); }
  }

  // Apply translations to newly injected nav/footer elements
  if (window.applyI18n) window.applyI18n();
}

function initMenu() {
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

  // Close when clicking outside the overlay (desktop backdrop)
  document.addEventListener('click', (e) => {
    if (menuOverlay && menuOverlay.classList.contains('open') &&
        !menuOverlay.contains(e.target) &&
        !menuBtn.contains(e.target)) {
      menuOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

function initAccordions() {
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      trigger.closest('.accordion-item').classList.toggle('open');
    });
  });
}

function openHashAccordion() {
  const hash = window.location.hash.slice(1); // strip the #
  if (!hash) return;
  const target = document.getElementById(hash);
  if (!target || !target.classList.contains('accordion-item')) return;

  // Open the target (leave others as-is)
  target.classList.add('open');

  // Scroll into view offset by the fixed nav height
  setTimeout(() => {
    const navHeight = document.querySelector('.site-nav')?.offsetHeight || 0;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  }, 100);
}

function initContactForm() {
  const form = document.querySelector('.community-form');
  const thankYou = document.getElementById('formThankYou');
  if (!form || !thankYou) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    btn.disabled = true;
    btn.textContent = 'Sending…';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        form.style.display = 'none';
        thankYou.style.display = 'flex';
      } else {
        btn.disabled = false;
        btn.textContent = 'Send';
        alert('Something went wrong. Please try again.');
      }
    } catch {
      btn.disabled = false;
      btn.textContent = 'Send';
      alert('Something went wrong. Please try again.');
    }
  });
}

function initVideo() {
  const videoEl = document.querySelector('.video-player');
  const playBtn = document.getElementById('videoPlayBtn');
  const overlay = document.getElementById('videoOverlay');
  if (videoEl && playBtn && overlay) {
    playBtn.addEventListener('click', () => {
      videoEl.play();
      overlay.style.display = 'none';
    });
    videoEl.addEventListener('ended', () => {
      overlay.style.display = 'flex';
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Try to load nav/footer dynamically (works on a server).
  // If placeholders aren't present the nav/footer are already inlined — skip fetch.
  if (document.getElementById('site-nav-placeholder') || document.getElementById('site-footer-placeholder')) {
    loadIncludes();
  } else {
    // Nav/footer are inlined — just init the interactive bits
    initMenu();
  }
  initAccordions();
  openHashAccordion();
  window.addEventListener('hashchange', openHashAccordion);
  initVideo();
  initContactForm();
});