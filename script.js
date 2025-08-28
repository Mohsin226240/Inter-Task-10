// Theme toggle with persistence
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
const savedTheme = localStorage.getItem('theme');
function applyTheme(mode) {
  if (mode === 'light') {
    root.classList.add('light');
  } else {
    root.classList.remove('light');
  }
}
applyTheme(savedTheme || (prefersLight ? 'light' : 'dark'));
themeToggle?.addEventListener('click', () => {
  const isLight = root.classList.toggle('light');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger?.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', String(open));
});

// Smooth scroll for nav links
document.addEventListener('click', (e) => {
  const target = e.target;
  if (!(target instanceof Element)) return;
  if (target.matches('a.nav-link[href^="#"]')) {
    e.preventDefault();
    const href = target.getAttribute('href');
    const section = href ? document.querySelector(href) : null;
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      mobileMenu?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
    }
  }
});

// Category filtering (chips and sidebar list)
const postGrid = document.getElementById('postGrid');
const cards = Array.from(document.querySelectorAll('.post-card'));
function setActiveChip(filter) {
  document.querySelectorAll('.chip').forEach((c) => c.classList.toggle('active', c.getAttribute('data-filter') === filter));
}
function filterCards(filter) {
  cards.forEach((card) => {
    const cat = card.getAttribute('data-category');
    const show = filter === 'all' || cat === filter;
    card.style.display = show ? '' : 'none';
  });
}
document.addEventListener('click', (e) => {
  const el = e.target;
  if (!(el instanceof Element)) return;
  if (el.matches('[data-filter]')) {
    const filter = el.getAttribute('data-filter');
    if (!filter) return;
    setActiveChip(filter);
    filterCards(filter);
  }
});

// Header search and sidebar search (simple client filter by title/excerpt)
function normalize(text) { return text.toLowerCase().trim(); }
function cardText(card) { return normalize(card.textContent || ''); }
function searchPosts(query) {
  const q = normalize(query);
  if (!q) { cards.forEach((c) => (c.style.display = '')); return; }
  cards.forEach((card) => {
    const match = cardText(card).includes(q);
    card.style.display = match ? '' : 'none';
  });
}
document.getElementById('headerSearchForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const v = /** @type {HTMLInputElement} */(document.getElementById('headerSearch')).value;
  searchPosts(v);
});
document.getElementById('sidebarSearchForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const v = /** @type {HTMLInputElement} */(document.getElementById('sidebarSearch')).value;
  searchPosts(v);
});

// Newsletter form validation
const emailInput = document.getElementById('email');
const newsletterForm = document.getElementById('newsletterForm');
const newsletterMsg = document.getElementById('newsletterMsg');
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}
newsletterForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const value = /** @type {HTMLInputElement} */(emailInput).value.trim();
  if (!value || !isValidEmail(value)) {
    newsletterMsg.textContent = 'Please enter a valid email address.';
    newsletterMsg.classList.remove('success');
    newsletterMsg.classList.add('error');
    /** @type {HTMLInputElement} */(emailInput).focus();
    return;
  }
  newsletterMsg.textContent = 'Thanks for subscribing!';
  newsletterMsg.classList.remove('error');
  newsletterMsg.classList.add('success');
  newsletterForm.reset();
});

// Scroll reveal animations using IntersectionObserver
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// Back-to-top button
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  const y = window.scrollY || window.pageYOffset;
  if (y > 600) {
    backToTop?.classList.add('show');
  } else {
    backToTop?.classList.remove('show');
  }
});
backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


