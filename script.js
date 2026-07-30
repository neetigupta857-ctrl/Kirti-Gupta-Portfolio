/* ==========================================================================
   KIRTI GUPTA — PREMIUM INTERACTIVE PORTFOLIO ENGINE
   GSAP 3 + ScrollTrigger + Lenis Smooth Scroll + Custom Cursor
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  /* ------------------------------------------------------------------------
     1. Lenis Smooth Scroll Setup & GSAP ScrollTrigger Sync
     ------------------------------------------------------------------------ */
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenis.on('scroll', () => {
      if (window.ScrollTrigger) ScrollTrigger.update();
    });

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }

  /* ------------------------------------------------------------------------
     2. Custom Dual Cursor System & Magnetic Physics
     ------------------------------------------------------------------------ */
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (cursorDot) {
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    }
  });

  function renderCursorRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;

    if (cursorRing) {
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
    }

    requestAnimationFrame(renderCursorRing);
  }
  renderCursorRing();

  // Hover detection for Cursor scaling & label changes
  const hoverElements = document.querySelectorAll('a, button, .service-row, .info-card, .process-step');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (cursorRing) cursorRing.classList.add('active-hover');
    });
    el.addEventListener('mouseleave', () => {
      if (cursorRing) {
        cursorRing.classList.remove('active-hover');
        cursorRing.classList.remove('active-card');
        cursorRing.innerText = '';
      }
    });
  });

  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      if (cursorRing) {
        cursorRing.classList.add('active-card');
        cursorRing.innerText = 'VIEW';
      }
    });
    card.addEventListener('mouseleave', () => {
      if (cursorRing) {
        cursorRing.classList.remove('active-card');
        cursorRing.innerText = '';
      }
    });
  });

  // Magnetic Button Effect
  const magneticBtns = document.querySelectorAll('.menu-trigger, .submit-btn, .menu-close, .modal-close');
  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, { duration: 0.3, x: x * 0.35, y: y * 0.35, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { duration: 0.5, x: 0, y: 0, ease: 'elastic.out(1, 0.3)' });
    });
  });

  /* ------------------------------------------------------------------------
     3. Sticky Navbar & Fullscreen Navigation Drawer
     ------------------------------------------------------------------------ */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  const menuOpenBtn = document.getElementById('menu-open-btn');
  const menuCloseBtn = document.getElementById('menu-close-btn');
  const menuModal = document.getElementById('menu-modal');
  const menuLinks = document.querySelectorAll('.nav-item-link');

  function openMenu() {
    menuModal.classList.add('open');
    if (lenis) lenis.stop();
    gsap.fromTo('.menu-link', 
      { y: 60, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out', delay: 0.1 }
    );
  }

  function closeMenu() {
    menuModal.classList.remove('open');
    if (lenis) lenis.start();
  }

  if (menuOpenBtn) menuOpenBtn.addEventListener('click', openMenu);
  if (menuCloseBtn) menuCloseBtn.addEventListener('click', closeMenu);

  menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      closeMenu();
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetEl = document.querySelector(targetId);
        if (targetEl && lenis) {
          lenis.scrollTo(targetEl, { offset: -40 });
        }
      }
    });
  });

  /* ------------------------------------------------------------------------
     4. Hero Page Load & Interactive Mouse Parallax Animations
     ------------------------------------------------------------------------ */
  if (typeof gsap !== 'undefined') {
    const heroTl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.2 } });

    heroTl
      .from('.hero-sub-badge', { y: -30, opacity: 0, delay: 0.2 })
      .from('.hero-title .line-1', { y: 100, opacity: 0 }, '-=0.8')
      .from('.hero-title .line-2', { y: 100, opacity: 0 }, '-=1.0')
      .from('.hero-title-wrap h2', { y: 60, opacity: 0 }, '-=0.9')
      .from('.hero-subtitle', { y: 40, opacity: 0 }, '-=0.8')
      .from('.geo-item', { scale: 0, opacity: 0, stagger: 0.15, ease: 'back.out(1.7)' }, '-=1.0')
      .from('.hero-scroll-indicator', { opacity: 0, y: 20 }, '-=0.6');

    // Hero Mouse Parallax
    const geoItems = document.querySelectorAll('.geo-item');
    window.addEventListener('mousemove', (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;

      geoItems.forEach(item => {
        const speed = parseFloat(item.getAttribute('data-speed')) || 0.2;
        gsap.to(item, {
          duration: 0.8,
          x: dx * 40 * speed,
          y: dy * 40 * speed,
          ease: 'power1.out'
        });
      });
    });
  }

  /* ------------------------------------------------------------------------
     5. GSAP ScrollTrigger Animations for Sections
     ------------------------------------------------------------------------ */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Section Labels & Headings Reveal
    document.querySelectorAll('.section-label, .section-heading').forEach(el => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out'
      });
    });

    // Divider Line Expansion
    document.querySelectorAll('.animated-divider').forEach(line => {
      gsap.from(line, {
        scrollTrigger: {
          trigger: line,
          start: 'top 90%'
        },
        scaleX: 0,
        duration: 1.2,
        ease: 'power3.out'
      });
    });

    // About Manifesto
    gsap.from('.about-manifesto', {
      scrollTrigger: {
        trigger: '.about-manifesto',
        start: 'top 80%'
      },
      y: 50,
      opacity: 0,
      duration: 1.0,
      ease: 'power3.out'
    });

    // About Info Cards Stagger
    gsap.from('.info-card', {
      scrollTrigger: {
        trigger: '.about-info-right',
        start: 'top 80%'
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out'
    });

    // Services Rows Reveal
    gsap.from('.service-row', {
      scrollTrigger: {
        trigger: '.services-list',
        start: 'top 75%'
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out'
    });

    // Portfolio Cards Reveal & Scale
    gsap.from('.project-card', {
      scrollTrigger: {
        trigger: '.portfolio-grid',
        start: 'top 75%'
      },
      y: 60,
      opacity: 0,
      duration: 1.0,
      stagger: 0.2,
      ease: 'power3.out'
    });

    // Process Timeline Steps Reveal
    gsap.from('.process-step', {
      scrollTrigger: {
        trigger: '.process-timeline',
        start: 'top 80%'
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out'
    });

    // Stats Number Counter Animation
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
      const targetVal = parseInt(stat.getAttribute('data-target')) || 0;
      const isPercent = stat.innerText.includes('%');
      
      ScrollTrigger.create({
        trigger: stat,
        start: 'top 85%',
        onEnter: () => {
          gsap.to({ val: 0 }, {
            val: targetVal,
            duration: 2.0,
            ease: 'power2.out',
            onUpdate: function() {
              const current = Math.floor(this.targets()[0].val);
              stat.innerText = current + (isPercent ? '%' : '+');
            }
          });
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     6. Services Accordion Interaction
     ------------------------------------------------------------------------ */
  const serviceRows = document.querySelectorAll('.service-row');
  serviceRows.forEach(row => {
    row.addEventListener('click', () => {
      const isExpanded = row.classList.contains('expanded');
      // Close other rows
      serviceRows.forEach(r => r.classList.remove('expanded'));
      if (!isExpanded) {
        row.classList.add('expanded');
      }
    });
  });

  /* ------------------------------------------------------------------------
     7. Portfolio Case Study Lightbox Modal System
     ------------------------------------------------------------------------ */
  const projectsData = {
    aura: {
      title: 'AURA HAUTE COUTURE',
      category: 'Brand Identity & Digital Experience • 2025',
      image: 'assets/project_aura.png',
      description: 'A comprehensive luxury brand identity and bespoke digital flagship store design for Aura Haute Couture. Built around minimalist typography, textured cream palette, and editorial layout systems.',
      deliverables: ['✓ Brand Strategy & Positioning', '✓ Bespoke Wordmark & Monogram', '✓ Luxury E-Commerce UI/UX', '✓ Print & Packaging Collateral']
    },
    neura: {
      title: 'NEURA AI SUITE',
      category: 'UI/UX Design System & Product Web App • 2025',
      image: 'assets/project_neura.png',
      description: 'A futuristic glassmorphic dashboard interface and multi-platform design system for an enterprise AI analytics company. Designed to make complex machine learning data effortlessly actionable.',
      deliverables: ['✓ Design System & Figma Token Kit', '✓ High-Fidelity UI Dashboard', '✓ Data Visualization Components', '✓ Micro-Interactions & Motion Guidelines']
    },
    verve: {
      title: 'VERVE MAGAZINE',
      category: 'Editorial Layout & Typography Art Direction • 2024',
      image: 'assets/project_aura.png',
      description: 'A physical high-fashion magazine layout and digital publication site inspired by Swiss international visual design. Featuring bold Space Grotesk headline grids and experimental typography.',
      deliverables: ['✓ Editorial Layout & Grid System', '✓ Custom Typography Cover Series', '✓ Print Production Art Direction', '✓ Digital Web Article Template']
    },
    kroma: {
      title: 'KROMA ENERGY',
      category: '3D Packaging & Performance AD Creatives • 2024',
      image: 'assets/project_neura.png',
      description: 'Bold beverage packaging redesign and performance marketing campaign assets for Kroma Energy. Engineered for maximum visual pop across digital ad feeds and retail shelves.',
      deliverables: ['✓ 3D Can Packaging Renders', '✓ High-Converting Motion Ads', '✓ Retail Billboard Graphics', '✓ Social Media Campaign Strategy']
    }
  };

  const projectModal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalImage = document.getElementById('modal-image');
  const modalDesc = document.getElementById('modal-description');
  const modalDeliverables = document.getElementById('modal-deliverables');

  function openProjectModal(projectId) {
    const data = projectsData[projectId];
    if (!data) return;

    modalTitle.innerText = data.title;
    modalCategory.innerText = data.category;
    modalImage.src = data.image;
    modalDesc.innerText = data.description;
    
    modalDeliverables.innerHTML = data.deliverables.map(item => `<li>${item}</li>`).join('');

    projectModal.classList.add('open');
    if (lenis) lenis.stop();

    gsap.fromTo('#modal-content', 
      { scale: 0.9, opacity: 0 }, 
      { scale: 1, opacity: 1, duration: 0.4, ease: 'power3.out' }
    );
  }

  function closeProjectModal() {
    projectModal.classList.remove('open');
    if (lenis) lenis.start();
  }

  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const projId = card.getAttribute('data-project');
      openProjectModal(projId);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProjectModal();
      closeMenu();
    }
  });

  /* ------------------------------------------------------------------------
     8. Contact Form Handler & Micro-Feedback
     ------------------------------------------------------------------------ */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = contactForm.querySelector('.email-input');
      const submitBtn = contactForm.querySelector('.submit-btn');

      if (input && input.value) {
        submitBtn.innerHTML = '✓';
        submitBtn.style.backgroundColor = '#22C55E';
        submitBtn.style.color = '#FFFFFF';
        input.value = '';
        input.placeholder = 'Thank you! Kirti will get back to you shortly.';

        setTimeout(() => {
          submitBtn.innerHTML = '→';
          submitBtn.style.backgroundColor = 'var(--bg-cream)';
          submitBtn.style.color = 'var(--text-black)';
          input.placeholder = 'Enter your email address...';
        }, 4000);
      }
    });
  }

});
