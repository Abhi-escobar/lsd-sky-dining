// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ===== MENU TABS =====
const tabBtns = document.querySelectorAll('.tab-btn');
const menuGrids = document.querySelectorAll('.menu-grid');
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
    menuGrids.forEach(g => g.classList.remove('active'));
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    const target = document.getElementById('menu-' + btn.dataset.tab);
    if (target) target.classList.add('active');
  });
});

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll('[data-reveal]');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('revealed'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => observer.observe(el));

// ===== HERO PARALLAX =====
const heroImg = document.querySelector('.hero-img');
window.addEventListener('scroll', () => {
  if (window.scrollY < window.innerHeight) {
    heroImg.style.transform = `translateY(${window.scrollY * 0.28}px)`;
  }
}, { passive: true });

// ===== GALLERY LIGHTBOX =====
const galleryItems = document.querySelectorAll('.gallery-item');
let lightbox = null;

function createLightbox(src, alt) {
  if (lightbox) return;
  lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.style.cssText = `
    position:fixed;inset:0;z-index:1000;
    background:rgba(10,8,6,0.95);
    display:flex;align-items:center;justify-content:center;
    cursor:zoom-out;padding:2rem;
    animation:fadeIn 0.3s ease;
  `;
  const img = document.createElement('img');
  img.src = src; img.alt = alt;
  img.style.cssText = `
    max-width:90vw;max-height:88vh;object-fit:contain;
    border-radius:8px;box-shadow:0 30px 80px rgba(0,0,0,0.7);
    border:1px solid rgba(201,168,76,0.2);
  `;
  const close = document.createElement('button');
  close.innerHTML = '✕';
  close.style.cssText = `
    position:absolute;top:1.5rem;right:1.5rem;
    font-size:1.5rem;color:#C9A84C;background:none;
    border:1px solid rgba(201,168,76,0.3);
    width:44px;height:44px;border-radius:50%;cursor:pointer;
    display:flex;align-items:center;justify-content:center;
    transition:background 0.3s;
  `;
  close.addEventListener('mouseenter', () => close.style.background = 'rgba(201,168,76,0.15)');
  close.addEventListener('mouseleave', () => close.style.background = 'none');
  lightbox.appendChild(img);
  lightbox.appendChild(close);
  document.body.appendChild(lightbox);
  document.body.style.overflow = 'hidden';

  const closeFn = () => {
    lightbox.style.opacity = '0';
    lightbox.style.transition = 'opacity 0.25s';
    setTimeout(() => { lightbox.remove(); lightbox = null; document.body.style.overflow = ''; }, 250);
  };
  close.addEventListener('click', closeFn);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeFn(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeFn(); }, { once: true });
}

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    createLightbox(img.src, img.alt);
  });
  item.style.cursor = 'pointer';
});

// ===== SMOOTH ACTIVE NAV HIGHLIGHT =====
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.style.color = '');
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active && !active.classList.contains('nav-cta')) active.style.color = 'var(--gold)';
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => sectionObserver.observe(s));
