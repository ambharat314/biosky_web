/* ========================================
   BioSky — Interactive JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroCanvas();
  initRevealAnimations();
  initTypewriterHeadings();
  initCounterAnimations();
  initMetricBars();
  initSmoothScroll();
  initContactForm();
});

/* === NAVBAR === */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  // Scroll behavior
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  });

  // Mobile toggle
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* === HERO CANVAS — Constellation/Grid Animation === */
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height, particles, mouse;

  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  }

  mouse = { x: -1000, y: -1000 };

  canvas.parentElement.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.parentElement.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  function createParticles() {
    particles = [];
    const count = Math.min(80, Math.floor(width * height / 15000));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Update and draw particles
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Mouse interaction
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        p.x -= dx * 0.01;
        p.y -= dy * 0.01;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(156, 163, 175, ${p.opacity})`;
      ctx.fill();
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const opacity = (1 - dist / 120) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(156, 163, 175, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });
}

/* === REVEAL ON SCROLL === */
function initRevealAnimations() {
  const items = document.querySelectorAll('.reveal-item');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger delay based on sibling position
          const siblings = entry.target.parentElement.querySelectorAll('.reveal-item');
          const index = Array.from(siblings).indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, index * 120);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  items.forEach(item => observer.observe(item));
}

/* === TYPEWRITER HEADINGS === */
function initTypewriterHeadings() {
  const titles = document.querySelectorAll('.section-title');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('typed')) {
          entry.target.classList.add('typed');
          typeWriterEffect(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
  );

  titles.forEach(title => {
    // Save original HTML and clear for typing
    const html = title.innerHTML.trim();
    title.setAttribute('data-original-html', html);
    title.innerHTML = '&nbsp;'; 
    observer.observe(title);
  });
}

function typeWriterEffect(element) {
  const html = element.getAttribute('data-original-html');
  element.innerHTML = '';
  
  let i = 0;
  let isTag = false;
  let text = '';
  const cursorHTML = '<span class="typewriter-cursor"></span>';
  
  function type() {
    if (i < html.length) {
      if (html.charAt(i) === '<') isTag = true;
      text += html.charAt(i);
      if (html.charAt(i) === '>') isTag = false;
      
      element.innerHTML = text + cursorHTML;
      i++;
      
      const speed = isTag ? 0 : Math.random() * 30 + 15;
      setTimeout(type, speed);
    } else {
      element.innerHTML = text + cursorHTML;
    }
  }
  type();
}

/* === COUNTER ANIMATION === */
function initCounterAnimations() {
  const counters = document.querySelectorAll('.metric-value[data-target]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const easeOut = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * easeOut);
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/* === METRIC BARS === */
function initMetricBars() {
  const fills = document.querySelectorAll('.metric-fill');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('animate');
          }, 500);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  fills.forEach(fill => observer.observe(fill));
}

/* === SMOOTH SCROLL === */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offsetTop = target.offsetTop - 72; // nav height
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* === CONTACT FORM === */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = document.getElementById('submitBtn');
    const originalText = btn.innerHTML;

    // Simulate submission
    btn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" class="spin">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-dasharray="32" stroke-dashoffset="32" stroke-linecap="round">
          <animate attributeName="stroke-dashoffset" from="32" to="0" dur="0.8s" fill="freeze"/>
        </circle>
      </svg>
      Sending...
    `;
    btn.disabled = true;
    btn.style.opacity = '0.7';

    setTimeout(() => {
      btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 8L7 12L13 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Message Sent!
      `;
      btn.style.opacity = '1';
      btn.style.background = '#374151';

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        btn.style.background = '';
        form.reset();
      }, 3000);
    }, 1500);
  });

  // Input focus animations
  form.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });
    input.addEventListener('blur', () => {
      input.parentElement.classList.remove('focused');
    });
  });
}

/* === ACTIVE SECTION HIGHLIGHT ON NAV === */
(function() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 150;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });
})();
