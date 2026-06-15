const i18n = (() => {
  const SUPPORTED = ['ca', 'es', 'en', 'fr'];
  let translations = {};
  let currentLang = 'en';

  function detectLang() {
    const saved = localStorage.getItem('lang');
    if (saved && SUPPORTED.includes(saved)) return saved;
    const browser = (navigator.language || 'en').slice(0, 2).toLowerCase();
    return SUPPORTED.includes(browser) ? browser : 'en';
  }

  function get(key) {
    return key.split('.').reduce((obj, k) => obj?.[k], translations) ?? '';
  }

  function apply() {
    document.documentElement.lang = currentLang;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const val = get(el.dataset.i18n);
      if (val) el.textContent = val;
    });

    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      const [attr, key] = el.dataset.i18nAttr.split(':');
      const val = get(key);
      if (val && attr) el.setAttribute(attr, val);
    });

    document.querySelectorAll('[data-lang]').forEach(btn => {
      const active = btn.dataset.lang === currentLang;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active);
    });

    const langDisplay = document.getElementById('hero-lang-display');
    if (langDisplay) langDisplay.textContent = currentLang.toUpperCase();
  }

  async function load(lang) {
    const base = document.querySelector('base')?.href || window.location.href;
    const url = new URL(`texts/${lang}.json`, base).href;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status}`);
    translations = await res.json();
    currentLang = lang;
  }

  async function setLanguage(lang) {
    if (!SUPPORTED.includes(lang)) return;
    try {
      await load(lang);
      localStorage.setItem('lang', lang);
      apply();
    } catch (e) {
      console.warn('[i18n] failed to load', lang, e);
    }
  }

  async function init() {
    const lang = detectLang();
    try {
      await load(lang);
    } catch {
      if (lang !== 'en') await load('en');
    }
    apply();
  }

  return { init, setLanguage, get, lang: () => currentLang };
})();
