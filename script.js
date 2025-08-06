/**
 * MNL-AI Premium Website JavaScript
 * Enhanced animations and interactions for premium feel
 */

class PremiumMNLAI {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.setupRevealAnimations();
        this.setupNavigation();
        this.setupTheme();
        this.setupContactForm();
        this.setupSmoothScrolling();
        this.setupPremiumEffects();
    }

    /* Premium Reveal Animations */
    setupRevealAnimations() {
        // Intersection Observer for reveal animations
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.15
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, parseFloat(delay) * 1000);
                    
                    // Unobserve after animation to improve performance
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all reveal elements
        document.querySelectorAll('[data-reveal]').forEach(element => {
            observer.observe(element);
        });

        // Fallback: Show content after 2 seconds if animations fail
        setTimeout(() => {
            document.querySelectorAll('[data-reveal]:not(.revealed)').forEach(element => {
                element.classList.add('revealed');
            });
        }, 2000);
    }

    /* Navigation */
    setupNavigation() {
        const navbar = document.getElementById('navbar');
        const mobileToggle = document.getElementById('mobile-toggle');
        const navMenu = document.getElementById('nav-menu');

        // Mobile menu toggle
        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                mobileToggle.classList.toggle('active');
                document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
            });

            // Close menu on link click
            navMenu.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    mobileToggle.classList.remove('active');
                    document.body.style.overflow = 'auto';
                });
            });
        }

        // Smart navbar hide/show
        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', this.throttle(() => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY < 100) {
                navbar.style.transform = 'translateY(0)';
            } else if (currentScrollY > lastScrollY && currentScrollY > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else if (currentScrollY < lastScrollY) {
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        }, 100));
    }

    /* Enhanced Theme Toggle */
    setupTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;

        // Detect system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Get saved theme or use system preference
        const savedTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
        
        // Apply saved theme immediately
        this.applyTheme(savedTheme, themeToggle);

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            // Only auto-switch if user hasn't manually set a preference
            if (!localStorage.getItem('theme')) {
                this.applyTheme(e.matches ? 'dark' : 'light', themeToggle);
            }
        });

        // Theme toggle click handler
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.hasAttribute('data-theme') ? 'dark' : 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            // Add switching animation
            themeToggle.classList.add('animate-switch');
            
            // Haptic feedback for mobile devices
            if ('vibrate' in navigator) {
                navigator.vibrate(50);
            }
            
            // Apply new theme after short delay for animation
            setTimeout(() => {
                this.applyTheme(newTheme, themeToggle);
                localStorage.setItem('theme', newTheme);
                themeToggle.classList.remove('animate-switch');
            }, 300);
        });

        // Double-click to clear preference (use system default)
        themeToggle.addEventListener('dblclick', () => {
            localStorage.removeItem('theme');
            const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            this.applyTheme(systemPreference, themeToggle);
            this.showNotification('Theme preference reset to system default', 'info');
        });
    }

    /* Apply Theme Function */
    applyTheme(theme, toggleButton) {
        const html = document.documentElement;
        const themeIcon = toggleButton.querySelector('.theme-icon');
        
        if (theme === 'dark') {
            html.setAttribute('data-theme', 'dark');
            themeIcon.textContent = '☀️';
            toggleButton.setAttribute('data-theme', 'dark');
            toggleButton.setAttribute('aria-label', 'Switch to light mode');
            
            // Add smooth transition class
            document.body.classList.add('theme-transitioning');
            setTimeout(() => document.body.classList.remove('theme-transitioning'), 300);
        } else {
            html.removeAttribute('data-theme');
            themeIcon.textContent = '🌙';
            toggleButton.setAttribute('data-theme', 'light');
            toggleButton.setAttribute('aria-label', 'Switch to dark mode');
            
            // Add smooth transition class
            document.body.classList.add('theme-transitioning');
            setTimeout(() => document.body.classList.remove('theme-transitioning'), 300);
        }

        // Dispatch custom event for other components that might need to know
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme } 
        }));
    }

    /* Contact Form */
    setupContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitButton = form.querySelector('button[type="submit"]');
            const originalHTML = submitButton.innerHTML;
            
            // Show loading state
            submitButton.innerHTML = '<span>Sending...</span>';
            submitButton.disabled = true;

            try {
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);

                const response = await fetch('/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (result.success) {
                    this.showNotification('Thank you! We\'ll get back to you within 24 hours.', 'success');
                    form.reset();
                } else {
                    throw new Error(result.error || 'Something went wrong');
                }
            } catch (error) {
                this.showNotification('Sorry, there was an error. Please try again.', 'error');
            } finally {
                submitButton.innerHTML = originalHTML;
                submitButton.disabled = false;
            }
        });
    }

    /* Smooth Scrolling */
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const navbarHeight = 80;
                    const targetPosition = target.offsetTop - navbarHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /* Premium Effects */
    setupPremiumEffects() {
        // Service card animations
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                const icon = card.querySelector('.service-icon');
                if (icon) {
                    icon.style.transform = 'rotate(5deg) scale(1.1)';
                }
            });

            card.addEventListener('mouseleave', () => {
                const icon = card.querySelector('.service-icon');
                if (icon) {
                    icon.style.transform = 'rotate(0deg) scale(1)';
                }
            });
        });

        // Button ripple effect
        document.querySelectorAll('.btn-primary, .btn-outline').forEach(button => {
            button.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;

                // Add ripple styles
                if (!document.querySelector('#ripple-styles')) {
                    const styles = document.createElement('style');
                    styles.id = 'ripple-styles';
                    styles.textContent = `
                        @keyframes ripple {
                            to { transform: scale(4); opacity: 0; }
                        }
                    `;
                    document.head.appendChild(styles);
                }

                button.style.position = 'relative';
                button.style.overflow = 'hidden';
                button.appendChild(ripple);

                setTimeout(() => ripple.remove(), 600);
            });
        });

        // Floating animations
        document.querySelectorAll('.floating-badge').forEach((badge, index) => {
            badge.style.animationDelay = `${index * 0.5}s`;
        });

        // Trust indicators counter animation
        this.setupCounterAnimation();
    }

    /* Counter Animation */
    setupCounterAnimation() {
        const trustNumbers = document.querySelectorAll('.trust-number');
        let hasAnimated = false;

        const animateCounters = () => {
            if (hasAnimated) return;
            hasAnimated = true;

            trustNumbers.forEach(number => {
                const finalValue = number.textContent;
                const numValue = parseInt(finalValue.replace(/[^\d]/g, ''));
                const increment = numValue / 30;
                let current = 0;

                const updateCounter = () => {
                    if (current < numValue) {
                        current += increment;
                        if (finalValue.includes('%')) {
                            number.textContent = Math.ceil(current) + '%';
                        } else if (finalValue.includes('+')) {
                            number.textContent = Math.ceil(current) + '+';
                        } else {
                            number.textContent = Math.ceil(current);
                        }
                        requestAnimationFrame(updateCounter);
                    } else {
                        number.textContent = finalValue;
                    }
                };

                updateCounter();
            });
        };

        // Trigger when trust indicators come into view
        const trustSection = document.querySelector('.trust-indicators');
        if (trustSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(animateCounters, 500);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(trustSection);
        }
    }

    /* Notification System */
    showNotification(message, type = 'info') {
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">
                    ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
                </span>
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add styles if not present
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: var(--color-background);
                    border: 1px solid var(--color-border);
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-xl);
                    padding: var(--space-4);
                    max-width: 400px;
                    z-index: 1000;
                    transform: translateX(100%);
                    transition: transform 0.3s ease;
                }
                .notification.show { transform: translateX(0); }
                .notification-success { border-left: 4px solid var(--color-primary); }
                .notification-error { border-left: 4px solid #ef4444; }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: var(--space-3);
                }
                .notification-message {
                    flex: 1;
                    font-size: var(--font-size-sm);
                }
                .notification-close {
                    background: none;
                    border: none;
                    font-size: var(--font-size-lg);
                    cursor: pointer;
                    opacity: 0.6;
                }
                .notification-close:hover { opacity: 1; }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        // Show notification
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // Close functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });

        // Auto-hide after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    /* Utility Functions */
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize the premium website
new PremiumMNLAI();

// Additional premium enhancements
document.addEventListener('DOMContentLoaded', () => {
    // Add loading class to body
    document.body.classList.add('loaded');

    // Smooth reveal for hero section
    setTimeout(() => {
        document.querySelectorAll('.hero [data-reveal]').forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('revealed');
            }, index * 200);
        });
    }, 300);

            // Add theme transition styles
        if (!document.querySelector('#theme-transition-styles')) {
            const themeStyles = document.createElement('style');
            themeStyles.id = 'theme-transition-styles';
            themeStyles.textContent = `
                /* Enhanced theme transitions */
                .theme-transitioning * {
                    transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                                color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                                border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                                box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                }
                
                /* Theme toggle tooltip */
                .theme-toggle {
                    position: relative;
                }
                
                .theme-toggle::after {
                    content: attr(aria-label);
                    position: absolute;
                    bottom: -35px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: var(--color-text-primary);
                    color: var(--color-background);
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    white-space: nowrap;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.2s ease;
                    z-index: 1000;
                }
                
                .theme-toggle:hover::after {
                    opacity: 1;
                }
                
                /* Mobile hide tooltip */
                @media (max-width: 768px) {
                    .theme-toggle::after {
                        display: none;
                    }
                }
            `;
            document.head.appendChild(themeStyles);
        }
    document.querySelectorAll('.service-card').forEach(card => {
        const icon = card.querySelector('.service-icon img');
        const price = card.querySelector('.price');

        card.addEventListener('mouseenter', () => {
            if (price) {
                price.style.transform = 'scale(1.05)';
                price.style.transition = 'transform 0.3s ease';
            }
        });

        card.addEventListener('mouseleave', () => {
            if (price) {
                price.style.transform = 'scale(1)';
            }
        });
    });

    // Add premium loading styles
    const loadingStyles = document.createElement('style');
    loadingStyles.textContent = `
        body:not(.loaded) [data-reveal] {
            opacity: 0;
            transform: translateY(30px);
        }
        body.loaded [data-reveal] {
            transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
    `;
    document.head.appendChild(loadingStyles);
});

// Performance optimization
window.addEventListener('load', () => {
    // Remove loading states
    document.querySelectorAll('.service-card').forEach(card => {
        card.style.willChange = 'auto';
    });
});

// Handle visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.body.classList.add('page-hidden');
    } else {
        document.body.classList.remove('page-hidden');
    }
});

// Add visibility optimization styles
const visibilityStyles = document.createElement('style');
visibilityStyles.textContent = `
    .page-hidden * {
        animation-play-state: paused !important;
    }
`;
document.head.appendChild(visibilityStyles);
