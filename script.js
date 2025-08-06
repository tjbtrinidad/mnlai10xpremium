/**
 * MNL-AI Premium Website JavaScript
 * Enhanced interactions, animations, and user experience
 * Built by Tristan Trinidad
 */

class MNLAIWebsite {
  constructor() {
    this.init();
  }

  init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.setupTheme();
    this.setupNavigation();
    this.setupScrollEffects();
    this.setupRevealAnimations();
    this.setupMagneticEffects();
    this.setupCursorGlow();
    this.setupContactForm();
    this.setupSmoothScrolling();
    this.setupPerformanceOptimizations();
  }

  /* ==========================================================================
     Theme Management
     ========================================================================== */

  setupTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Apply saved theme
    if (currentTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      this.updateThemeIcon(themeToggle, 'dark');
    }

    // Theme toggle event
    themeToggle?.addEventListener('click', () => {
      const isDark = document.documentElement.hasAttribute('data-theme');
      
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        this.updateThemeIcon(themeToggle, 'light');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        this.updateThemeIcon(themeToggle, 'dark');
      }

      // Animate theme change
      document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
      setTimeout(() => {
        document.body.style.transition = '';
      }, 300);
    });
  }

  updateThemeIcon(toggle, theme) {
    const icon = toggle?.querySelector('.theme-icon');
    if (icon) {
      icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  /* ==========================================================================
     Navigation
     ========================================================================== */

  setupNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    let lastScrollY = window.scrollY;

    // Mobile menu toggle
    mobileToggle?.addEventListener('click', () => {
      const isActive = navMenu.classList.contains('active');
      
      navMenu.classList.toggle('active');
      mobileToggle.classList.toggle('active');
      
      // Prevent body scroll when menu is open
      document.body.style.overflow = isActive ? 'auto' : 'hidden';
    });

    // Close mobile menu when clicking nav links
    navMenu?.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        document.body.style.overflow = 'auto';
      });
    });

    // Smart navbar hide/show on scroll
    window.addEventListener('scroll', this.throttle(() => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 100) {
        navbar.style.transform = 'translateY(0)';
      } else if (currentScrollY > lastScrollY && currentScrollY > 200) {
        // Scrolling down - hide navbar
        navbar.style.transform = 'translateY(-100%)';
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show navbar
        navbar.style.transform = 'translateY(0)';
      }
      
      lastScrollY = currentScrollY;
    }, 100));

    // Add navbar background blur on scroll
    window.addEventListener('scroll', this.throttle(() => {
      const scrolled = window.scrollY > 50;
      navbar.classList.toggle('scrolled', scrolled);
    }, 100));
  }

  /* ==========================================================================
     Scroll Effects
     ========================================================================== */

  setupScrollEffects() {
    this.setupScrollProgress();
    this.setupParallaxEffects();
  }

  setupScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) return;

    window.addEventListener('scroll', this.throttle(() => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollTop / docHeight;
      
      progressBar.style.transform = `scaleX(${scrollPercent})`;
    }, 16)); // ~60fps
  }

  setupParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.hero-visual');
    
    if (parallaxElements.length === 0) return;

    window.addEventListener('scroll', this.throttle(() => {
      const scrolled = window.scrollY;
      
      parallaxElements.forEach(element => {
        const rate = scrolled * -0.5;
        element.style.transform = `translateY(${rate}px)`;
      });
    }, 16));
  }

  /* ==========================================================================
     Reveal Animations
     ========================================================================== */

  setupRevealAnimations() {
    // Use Intersection Observer for better performance
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Stagger animations for child elements
          this.staggerChildAnimations(entry.target);
        }
      });
    }, observerOptions);

    // Observe all reveal elements
    document.querySelectorAll('[data-reveal]').forEach(element => {
      observer.observe(element);
    });
  }

  staggerChildAnimations(parent) {
    const children = parent.querySelectorAll('[data-reveal]');
    children.forEach((child, index) => {
      setTimeout(() => {
        child.classList.add('revealed');
      }, index * 100);
    });
  }

  /* ==========================================================================
     Magnetic Effects
     ========================================================================== */

  setupMagneticEffects() {
    const magneticElements = document.querySelectorAll('[data-magnetic]');
    
    magneticElements.forEach(element => {
      let isHovering = false;
      
      element.addEventListener('mouseenter', () => {
        isHovering = true;
      });
      
      element.addEventListener('mouseleave', () => {
        isHovering = false;
        element.style.transform = 'translate(0, 0)';
      });
      
      element.addEventListener('mousemove', (e) => {
        if (!isHovering) return;
        
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (e.clientX - centerX) * 0.1;
        const deltaY = (e.clientY - centerY) * 0.1;
        
        element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      });
    });
  }

  /* ==========================================================================
     Cursor Glow Effect
     ========================================================================== */

  setupCursorGlow() {
    const cursorGlow = document.querySelector('.cursor-glow');
    if (!cursorGlow) return;

    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;

    // Smooth cursor following with easing
    const updateGlowPosition = () => {
      glowX += (mouseX - glowX) * 0.1;
      glowY += (mouseY - glowY) * 0.1;
      
      cursorGlow.style.left = `${glowX}px`;
      cursorGlow.style.top = `${glowY}px`;
      
      requestAnimationFrame(updateGlowPosition);
    };

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Hide cursor glow on mobile
    if (!this.isMobile()) {
      updateGlowPosition();
    } else {
      cursorGlow.style.display = 'none';
    }
  }

  /* ==========================================================================
     Contact Form
     ========================================================================== */

  setupContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitButton = form.querySelector('button[type="submit"]');
      const originalText = submitButton.innerHTML;
      
      // Show loading state
      submitButton.innerHTML = `
        <svg class="animate-spin" width="20" height="20" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25"/>
          <path fill="currentColor" opacity="0.75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
        </svg>
        <span>Sending...</span>
      