// script.js
// JavaScript behavior for portfolio site
// - Uses DOMContentLoaded, querySelector/querySelectorAll
// - IntersectionObserver for reveals and active nav highlighting
// - Accessible mobile menu, smooth scrolling, back-to-top, hero subtle animation
// - Safe no-op fallbacks when selectors are missing

document.addEventListener('DOMContentLoaded', () => {
  /* ------------------------------
     Helpers
  -------------------------------*/
  const q = (sel, ctx = document) => ctx.querySelector(sel);
  const qAll = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const noop = () => {};
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // Throttle for scroll handlers (runs at most once per `wait` ms)
  function throttle(fn, wait = 100) {
    let last = 0;
    let scheduled = null;
    return function (...args) {
      const now = Date.now();
      const remaining = wait - (now - last);
      if (remaining <= 0) {
        if (scheduled) {
          clearTimeout(scheduled);
          scheduled = null;
        }
        last = now;
        fn.apply(this, args);
      } else if (!scheduled) {
        scheduled = setTimeout(() => {
          scheduled = null;
          last = Date.now();
          fn.apply(this, args);
        }, remaining);
      }
    };
  }

  /* ------------------------------
     Element references (safe)
  -------------------------------*/
  const menuToggle = q('.menu-toggle') || q('#menuToggle');
  const navLinks = q('.nav-links') || q('#navLinks');
  const header = q('header') || q('.navbar') || null;
  const navAnchors = qAll('nav a') .length ? qAll('nav a') : qAll('.nav-links a');
  const backToTop = q('.to-top') || q('#toTop') || q('.back-to-top');
  const revealEls = qAll('.reveal') || qAll('.section');
  const sections = qAll('main section[id]') .length ? qAll('main section[id]') : qAll('section[id]');
  const heroLead = q('.lead');

  /* ------------------------------
     1) Mobile navigation toggle (accessible)
  -------------------------------*/
  if (menuToggle && navLinks) {
    // Initialize state
    menuToggle.setAttribute('aria-controls', navLinks.id || 'navLinks');
    menuToggle.setAttribute('aria-expanded', 'false');

    const openMenu = () => {
      navLinks.style.display = 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.background = 'rgba(2,6,10,0.6)';
      navLinks.style.padding = '10px';
      menuToggle.setAttribute('aria-expanded', 'true');
      menuToggle.classList.add('open');
    };

    const closeMenu = () => {
      // hide only if small viewport — keep desktop unaffected
      if (window.innerWidth <= 640) {
        navLinks.style.display = 'none';
      } else {
        navLinks.style.display = '';
        navLinks.style.flexDirection = '';
        navLinks.style.background = '';
        navLinks.style.padding = '';
      }
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.classList.remove('open');
    };

    // Toggle on click
    menuToggle.addEventListener('click', (e) => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      if (expanded) closeMenu(); else openMenu();
    });

    // Close on Escape for accessibility
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        menuToggle.focus();
      }
    });

    // Ensure layout resets on resize
    window.addEventListener('resize', throttle(() => {
      if (window.innerWidth > 640) {
        navLinks.style.display = ''; // let CSS handle it
        navLinks.style.flexDirection = '';
        navLinks.style.background = '';
        navLinks.style.padding = '';
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('open');
      } else {
        // keep mobile menu closed by default
        navLinks.style.display = 'none';
      }
    }, 120));

    // initial mobile state
    if (window.innerWidth <= 640) navLinks.style.display = 'none';
  }

  /* ------------------------------
     2) Smooth scrolling for anchor links
     8) Close mobile menu after clicking a nav link
  -------------------------------*/
  if (navAnchors && navAnchors.length) {
    navAnchors.forEach((a) => {
      // Only process internal anchors
      const href = a.getAttribute('href') || '';
      if (!href.startsWith('#')) return;

      a.addEventListener('click', (e) => {
        const targetId = href.slice(1);
        const target = targetId ? document.getElementById(targetId) : document.documentElement;
        if (target) {
          e.preventDefault();
          // Smooth scroll; allow browser default smooth as a fallback
          try {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } catch (err) {
            // fallback
            window.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
          }
          // update history without adding extra entry
          if (history && history.replaceState) {
            history.replaceState(null, '', '#' + targetId);
          }

          // Close mobile menu if open and on small viewports
          if (menuToggle && navLinks && window.innerWidth <= 640) {
            navLinks.style.display = 'none';
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.classList.remove('open');
          }
        }
      });
    });
  }

  /* ------------------------------
     3) Active nav link highlight while scrolling
     4) Sticky navbar behavior (add small 'scrolled' class)
  -------------------------------*/
  if (sections && sections.length && navAnchors.length) {
    const navMap = new Map();
    navAnchors.forEach((a) => {
      const href = a.getAttribute('href') || '';
      if (href.startsWith('#')) navMap.set(href.slice(1), a);
    });

    const obsOptions = { root: null, rootMargin: '-20% 0px -40% 0px', threshold: 0 };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        const link = navMap.get(id);
        if (entry.isIntersecting) {
          // remove active from all nav anchors and set current
          navAnchors.forEach((n) => n.classList.remove('active'));
          if (link) link.classList.add('active');
          // update document title or other live region if needed (kept minimal)
        }
      });
    }, obsOptions);

    sections.forEach((s) => sectionObserver.observe(s));
  }

  // Sticky class (visual affordance) — not required for functionality but helps UI
  if (header) {
    const scrolledClass = 'scrolled';
    const handleSticky = throttle(() => {
      if (window.scrollY > 8) header.classList.add(scrolledClass);
      else header.classList.remove(scrolledClass);
    }, 100);
    // run once
    handleSticky();
    window.addEventListener('scroll', handleSticky);
  }

  /* ------------------------------
     5) Back-to-top button show/hide on scroll
  -------------------------------*/
  if (backToTop) {
    const SHOW_AT = 400;
    const onScroll = throttle(() => {
      if (window.scrollY > SHOW_AT) {
        backToTop.style.display = 'flex';
        backToTop.setAttribute('aria-hidden', 'false');
      } else {
        backToTop.style.display = 'none';
        backToTop.setAttribute('aria-hidden', 'true');
      }
    }, 120);

    // init and attach
    onScroll();
    window.addEventListener('scroll', onScroll);

    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // move focus for accessibility
      const firstHeading = q('main h1') || q('body');
      if (firstHeading && firstHeading.focus) {
        firstHeading.setAttribute('tabindex', '-1');
        firstHeading.focus({ preventScroll: true });
        // remove tabindex after a short delay
        setTimeout(() => firstHeading.removeAttribute('tabindex'), 1000);
      }
    });
  }

  /* ------------------------------
     6) Reveal / fade / slide-up animation using IntersectionObserver
  -------------------------------*/
  if (revealEls && revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ------------------------------
     7) Optional subtle hero text animation
     - Gentle staggered fade-in of the `.lead` text characters
     - Safe fallback: only run if `.lead` exists and viewport is wide enough
  -------------------------------*/
  (function heroTextAnimation() {
    if (!heroLead) return;
    if (window.matchMedia && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Split text into spans for subtle stagger
      const text = heroLead.textContent.trim();
      if (!text) return;
      heroLead.textContent = '';
      const frag = document.createDocumentFragment();
      const maxChars = clamp(text.length, 1, 120);
      for (let i = 0; i < maxChars; i++) {
        const ch = text[i];
        const span = document.createElement('span');
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        span.style.opacity = '0';
        span.style.display = 'inline-block';
        span.style.transform = 'translateY(6px)';
        span.style.transition = 'opacity 420ms ease, transform 420ms cubic-bezier(.2,.9,.3,1)';
        frag.appendChild(span);
      }
      heroLead.appendChild(frag);

      // Stagger reveal
      Array.from(heroLead.children).forEach((span, idx) => {
        setTimeout(() => {
          span.style.opacity = '1';
          span.style.transform = 'none';
        }, 40 + idx * 18); // subtle and quick
      });

      // After animation, remove inline styles for cleanliness
      setTimeout(() => {
        Array.from(heroLead.children).forEach((span) => {
          span.style.opacity = '';
          span.style.transform = '';
          span.style.transition = '';
          span.style.display = '';
        });
      }, 3000);
    }
  })();

  /* ------------------------------
     9) Safe fallbacks / finishing touches
  -------------------------------*/
  // If navAnchors exist but no active class is set by observation (e.g. very short pages),
  // ensure the first anchor is active on load
  if (navAnchors && navAnchors.length) {
    const anyActive = navAnchors.some((a) => a.classList.contains('active'));
    if (!anyActive) navAnchors[0].classList.add('active');
  }

  // Improve performance: lazy attach a small passive scroll listener for certain touch devices
  try {
    window.addEventListener(
      'touchstart',
      () => {},
      { passive: true }
    );
  } catch (e) {
    // no-op
  }

  // All done
});
