// SpaOase — interactions & animations
document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('siteHeader');
  const progressBar = document.getElementById('progressBar');
  const floatCta = document.querySelector('.float-cta');
  const heroBg = document.getElementById('heroBg');
  const ambienceBg = document.getElementById('ambienceBg');
  const burger = document.getElementById('burger');
  const mobileNav = document.getElementById('mobileNav');
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll-driven header, progress bar, float CTA, parallax
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 40);
    floatCta && floatCta.classList.toggle('show', y > 700);

    const docH = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (docH > 0 ? (y / docH) * 100 : 0) + '%';

    if (reducedMotion) return;

    if (heroBg) {
      const heroH = document.querySelector('.hero').offsetHeight;
      if (y < heroH) heroBg.style.transform = `scale(1.15) translateY(${y * 0.35}px)`;
    }
    if (ambienceBg) {
      const rect = ambienceBg.parentElement.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const offset = (window.innerHeight - rect.top) * 0.12;
        ambienceBg.style.transform = `scale(1.15) translateY(${offset - 60}px)`;
      }
    }
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile nav
  if (burger) {
    burger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      burger.classList.toggle('active', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
    });
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }));
  }

  // Reveal on scroll
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-scale, .reveal-line');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => io.observe(el));

  // Animated counters
  const counters = document.querySelectorAll('.stat-num[data-count]');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      if (reducedMotion) {
        el.textContent = target;
        counterIO.unobserve(el);
        return;
      }
      const duration = 1400;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased);
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      counterIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterIO.observe(el));

  // Custom cursor (desktop only)
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!reducedMotion && window.matchMedia('(hover:hover)').matches && dot && ring) {
    let rx = 0, ry = 0, mx = 0, my = 0;
    document.addEventListener('mousemove', (e) => {
      dot.style.left = e.clientX + 'px';
      dot.style.top = e.clientY + 'px';
      mx = e.clientX; my = e.clientY;
    });
    const animateRing = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(animateRing);
    };
    animateRing();
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => { ring.style.width = '54px'; ring.style.height = '54px'; ring.style.opacity = '0.6'; });
      el.addEventListener('mouseleave', () => { ring.style.width = '34px'; ring.style.height = '34px'; ring.style.opacity = '1'; });
    });
  }
});
