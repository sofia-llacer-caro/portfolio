// ============================================
// INTERVISIONS — i18n Engine
// Loads texts/{lang}.json and applies to DOM
// ============================================

(function () {
  const DEFAULT_LANG = 'en';
  const SUPPORTED = ['en', 'cat', 'es'];
  let currentTexts = {};
  let currentLang = DEFAULT_LANG;

  function getBase() {
    return window.location.pathname.includes('/pages/') ? '../' : './';
  }

  async function loadTexts(lang) {
    try {
      const res = await fetch(getBase() + 'texts/' + lang + '.json');
      if (!res.ok) throw new Error('Not found');
      return await res.json();
    } catch {
      if (lang !== DEFAULT_LANG) return loadTexts(DEFAULT_LANG);
      return {};
    }
  }

  function applyTexts(texts) {
    // Plain text
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (texts[key] !== undefined) el.textContent = texts[key];
    });
    // HTML content (elements with inline tags like <strong>)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (texts[key] !== undefined) el.innerHTML = texts[key];
    });
    // Form placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (texts[key] !== undefined) el.placeholder = texts[key];
    });
  }

  function updateLangLinks(lang) {
    document.querySelectorAll('[data-lang]').forEach(a => {
      a.classList.toggle('active', a.getAttribute('data-lang') === lang);
    });
    document.documentElement.lang = lang;
  }

  // Only wire elements that haven't been wired yet (safe to call multiple times)
  function wireLangLinks() {
    document.querySelectorAll('[data-lang]:not([data-i18n-wired])').forEach(a => {
      a.setAttribute('data-i18n-wired', '1');
      a.addEventListener('click', e => {
        e.preventDefault();
        setLanguage(a.getAttribute('data-lang'));
      });
    });
  }

  async function setLanguage(lang) {
    if (!SUPPORTED.includes(lang)) lang = DEFAULT_LANG;
    currentLang = lang;
    localStorage.setItem('lang', lang);
    currentTexts = await loadTexts(lang);
    applyTexts(currentTexts);
    updateLangLinks(lang);
    wireLangLinks();
  }

  // Called by includes.js after injecting dynamic nav/footer so those
  // elements get translated without re-fetching the JSON.
  window.applyI18n = function () {
    applyTexts(currentTexts);
    updateLangLinks(currentLang);
    wireLangLinks();
  };

  async function initI18n() {
    const lang = localStorage.getItem('lang') || DEFAULT_LANG;
    await setLanguage(lang);
  }

  // Auto-init on DOM ready
  document.addEventListener('DOMContentLoaded', initI18n);

})();