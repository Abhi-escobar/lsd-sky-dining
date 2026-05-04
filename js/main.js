// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 60);
  lastScroll = y;
}, { passive: true });

// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
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
const tabBtns   = document.querySelectorAll('.tab-btn');
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

// ===== SCROLL REVEAL (staggered per-element) =====
const revealEls = document.querySelectorAll('[data-reveal]');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // stagger siblings within the same parent
      const siblings = [...entry.target.parentElement.querySelectorAll('[data-reveal]')];
      const idx = siblings.indexOf(entry.target);
      const delay = idx * 90;
      entry.target.style.transitionDelay = `${delay}ms`;
      entry.target.classList.add('revealed');
      // clean up delay after animation completes
      entry.target.addEventListener('transitionend', () => {
        entry.target.style.transitionDelay = '';
      }, { once: true });
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

// ===== HERO PARALLAX (RAF-throttled) =====
const heroImg = document.querySelector('.hero-img');
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      if (window.scrollY < window.innerHeight) {
        heroImg.style.transform = `translateY(${window.scrollY * 0.25}px)`;
      }
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

// ===== GALLERY LIGHTBOX =====
const galleryItems = document.querySelectorAll('.gallery-item');
let lightbox = null;

function createLightbox(src, alt) {
  if (lightbox) return;

  lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  Object.assign(lightbox.style, {
    position: 'fixed', inset: '0', zIndex: '1000',
    background: 'rgba(10,8,6,0)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'zoom-out', padding: '2rem',
    transition: 'background 0.35s ease',
    backdropFilter: 'blur(0px)',
    WebkitBackdropFilter: 'blur(0px)',
  });

  const img = document.createElement('img');
  img.src = src; img.alt = alt;
  Object.assign(img.style, {
    maxWidth: '90vw', maxHeight: '88vh', objectFit: 'contain',
    borderRadius: '10px',
    boxShadow: '0 30px 80px rgba(0,0,0,0.75)',
    border: '1px solid rgba(201,168,76,0.25)',
    transform: 'scale(0.92)',
    opacity: '0',
    transition: 'transform 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease',
  });

  const close = document.createElement('button');
  close.innerHTML = '✕';
  Object.assign(close.style, {
    position: 'absolute', top: '1.5rem', right: '1.5rem',
    fontSize: '1.4rem', color: '#C9A84C', background: 'none',
    border: '1px solid rgba(201,168,76,0.35)',
    width: '44px', height: '44px', borderRadius: '50%', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'background 0.25s ease, transform 0.25s ease',
    opacity: '0',
  });
  close.addEventListener('mouseenter', () => { close.style.background = 'rgba(201,168,76,0.15)'; close.style.transform = 'scale(1.1)'; });
  close.addEventListener('mouseleave', () => { close.style.background = 'none'; close.style.transform = 'scale(1)'; });

  lightbox.appendChild(img);
  lightbox.appendChild(close);
  document.body.appendChild(lightbox);
  document.body.style.overflow = 'hidden';

  // animate in
  requestAnimationFrame(() => {
    lightbox.style.background = 'rgba(10,8,6,0.95)';
    lightbox.style.backdropFilter = 'blur(8px)';
    lightbox.style.WebkitBackdropFilter = 'blur(8px)';
    requestAnimationFrame(() => {
      img.style.transform = 'scale(1)';
      img.style.opacity = '1';
      close.style.opacity = '1';
    });
  });

  const closeFn = () => {
    img.style.transform = 'scale(0.92)';
    img.style.opacity = '0';
    close.style.opacity = '0';
    lightbox.style.background = 'rgba(10,8,6,0)';
    lightbox.style.backdropFilter = 'blur(0px)';
    lightbox.style.WebkitBackdropFilter = 'blur(0px)';
    setTimeout(() => {
      lightbox.remove();
      lightbox = null;
      document.body.style.overflow = '';
    }, 380);
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
});

// ===== ACTIVE NAV HIGHLIGHT =====
const sections   = document.querySelectorAll('section[id]');
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
