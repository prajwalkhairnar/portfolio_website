"use strict";

// ── Nav: blur + border on scroll ──────────────────────────────────────────────

const nav = document.getElementById('nav');

function handleNavScroll() {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}

window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();

// ── Active section tracking ────────────────────────────────────────────────────

const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function updateActiveLink() {
  const scrollY = window.scrollY;
  let current   = '';

  sections.forEach(section => {
    if (scrollY >= section.offsetTop - 120) {
      current = section.id;
    }
  });

  navLinks.forEach(link => {
    const matches = link.dataset.section === current;
    link.classList.toggle('active', matches);
  });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();

// ── Scroll reveal via IntersectionObserver ─────────────────────────────────────

const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealEls.forEach(el => revealObserver.observe(el));

// ── Dark mode toggle ───────────────────────────────────────────────────────────

const themeToggle = document.getElementById('theme-toggle');
const html        = document.documentElement;

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  themeToggle.setAttribute(
    'aria-label',
    theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
  );
}

const saved = localStorage.getItem('theme');
if (saved) {
  setTheme(saved);
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  setTheme('dark');
}

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

// ── Mobile menu ────────────────────────────────────────────────────────────────

const hamburger   = document.getElementById('nav-hamburger');
const mobileMenu  = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-nav-link');

function openMenu(open) {
  hamburger.setAttribute('aria-expanded', String(open));
  mobileMenu.classList.toggle('open', open);
  mobileMenu.setAttribute('aria-hidden', String(!open));
  document.body.style.overflow = open ? 'hidden' : '';

  if (open) {
    const first = mobileMenu.querySelector('a');
    if (first) first.focus();
  }
}

hamburger.addEventListener('click', () => {
  openMenu(hamburger.getAttribute('aria-expanded') !== 'true');
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => openMenu(false));
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && hamburger.getAttribute('aria-expanded') === 'true') {
    openMenu(false);
    hamburger.focus();
  }
});
