/* ── script.js ── Abhay's Portfolio ── */

/* ─────────────────────────────────────────────
   CUSTOM CURSOR
───────────────────────────────────────────── */
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mouseX = -100, mouseY = -100;
let ringX  = -100, ringY  = -100;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top  = mouseY + 'px';
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .project-card, .skill-category, .tech-icon-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    ring.style.width  = '52px';
    ring.style.height = '52px';
    ring.style.borderColor = 'rgba(0, 212, 255, 0.8)';
  });
  el.addEventListener('mouseleave', () => {
    ring.style.width  = '32px';
    ring.style.height = '32px';
    ring.style.borderColor = 'rgba(0, 212, 255, 0.5)';
  });
});


/* ─────────────────────────────────────────────
   NAVBAR: scroll effect + active link highlight
───────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Sticky background
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active link tracking
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) {
      current = sec.id;
    }
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
});


/* ─────────────────────────────────────────────
   MOBILE MENU TOGGLE
───────────────────────────────────────────── */
const navToggle  = document.getElementById('navToggle');
const navLinksEl = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinksEl.classList.toggle('open');
});

// Close menu on link click
navLinksEl.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinksEl.classList.remove('open');
  });
});


/* ─────────────────────────────────────────────
   TYPING ANIMATION
───────────────────────────────────────────── */
const typingEl = document.getElementById('typingText');
const phrases  = [
  'Data Pipelines',
  'Power BI Dashboards',
  'ML Models',
  'SQL Queries',
  'AI Solutions',
  'Business Intelligence',
];
let phraseIndex = 0;
let charIndex   = 0;
let isDeleting  = false;
const TYPING_SPEED   = 90;
const DELETING_SPEED = 45;
const PAUSE_AFTER    = 2000;

function typeLoop() {
  const currentPhrase = phrases[phraseIndex];

  if (isDeleting) {
    typingEl.textContent = currentPhrase.slice(0, charIndex - 1);
    charIndex--;
  } else {
    typingEl.textContent = currentPhrase.slice(0, charIndex + 1);
    charIndex++;
  }

  if (!isDeleting && charIndex === currentPhrase.length) {
    isDeleting = true;
    setTimeout(typeLoop, PAUSE_AFTER);
    return;
  }

  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
  }

  setTimeout(typeLoop, isDeleting ? DELETING_SPEED : TYPING_SPEED);
}
typeLoop();


/* ─────────────────────────────────────────────
   SCROLL REVEAL (IntersectionObserver)
───────────────────────────────────────────── */
const revealEls = document.querySelectorAll(
  '.about-grid, .stat-card, .skill-category, .project-card, .contact-grid, .tech-icon-item, .about-tags, .section-title, .section-label'
);

revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Staggered delay based on sibling index
      const siblings = [...entry.target.parentElement.children].filter(c => c.classList.contains('reveal'));
      const delay    = siblings.indexOf(entry.target) * 80;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));


/* ─────────────────────────────────────────────
   SKILL BARS ANIMATION (on viewport enter)
───────────────────────────────────────────── */
const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = entry.target.dataset.width;
      entry.target.style.width = target + '%';
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

skillFills.forEach(fill => skillObserver.observe(fill));


/* ─────────────────────────────────────────────
   COUNTER ANIMATION
───────────────────────────────────────────── */
const counters = document.querySelectorAll('.stat-num');

function animateCounter(el) {
  const target    = parseInt(el.dataset.target);
  const duration  = 1600;
  const step      = 16;
  const increment = target / (duration / step);
  let current = 0;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current);
    }
  }, step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));


/* ─────────────────────────────────────────────
   CONTACT FORM (mailto fallback)
───────────────────────────────────────────── */
const contactForm    = document.getElementById('contactForm');
const formSuccess    = document.getElementById('formSuccess');

contactForm.addEventListener('submit', e => {
  e.preventDefault();

  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  const mailtoLink = `mailto:abhayverma2811@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Hi Abhay,\n\nMy name is ${name} (${email}).\n\n${message}`)}`;

  // Open mailto
  window.location.href = mailtoLink;

  // Show success
  formSuccess.classList.add('show');
  contactForm.reset();
  setTimeout(() => formSuccess.classList.remove('show'), 5000);
});


/* ─────────────────────────────────────────────
   SMOOTH SCROLL for anchor links
───────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});


/* ─────────────────────────────────────────────
   PROJECT CARDS – tilt on mousemove
───────────────────────────────────────────── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect   = card.getBoundingClientRect();
    const x      = e.clientX - rect.left;
    const y      = e.clientY - rect.top;
    const cx     = rect.width  / 2;
    const cy     = rect.height / 2;
    const rotateX = (y - cy) / cy * -5;
    const rotateY = (x - cx) / cx * 5;
    card.style.transform = `translateY(-6px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease';
    setTimeout(() => card.style.transition = '', 500);
  });
});