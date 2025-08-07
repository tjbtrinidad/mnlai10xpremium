/**
 * MNL-AI Premium Website - Bulletproof JavaScript
 * Guaranteed to work on all devices and browsers
 */

// Ensure everything runs after DOM is loaded
(function() {
    'use strict';
    
    // Wait for DOM to be ready
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    ready(function() {
        console.log('MNL-AI Premium Script Loaded');
        initializeWebsite();
    });

    function initializeWebsite() {
        // Initialize all features
        setupThemeToggle();
        setupMobileMenu();
        setupRevealAnimations();
        setupContactForm();
        setupSmoothScrolling();
        setupPremiumEffects();
    }

    /* Theme Toggle - Bulletproof Version */
    function setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        console.log('Theme toggle element:', themeToggle);
        
        if (!themeToggle) {
            console.warn('Theme toggle not found');
            return;
        }

        // Get current theme
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

        // Apply initial theme
        applyTheme(initialTheme);

        // Add click handler
        themeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Theme toggle clicked');
            
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });

        function applyTheme(theme) {
            console.log('Applying theme:', theme);
            const html = document.documentElement;
            const icon = themeToggle.querySelector('.theme-icon');
            
            if (theme === 'dark') {
                html.setAttribute('data-theme', 'dark');
                if (icon) icon.textContent = '☀️';
                themeToggle.setAttribute('aria-label', 'Switch to light mode');
            } else {
                html.removeAttribute('data-theme');
                if (icon) icon.textContent = '🌙';
                themeToggle.setAttribute('aria-label', 'Switch to dark mode');
            }
        }
    }

    /* Mobile Menu - Bulletproof Version */
    function setupMobileMenu() {
        const mobileToggle = document.getElementById('mobile-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        console.log('Mobile toggle:', mobileToggle);
        console.log('Nav menu:', navMenu);

        if (!mobileToggle || !navMenu) {
            console.warn('Mobile menu elements not found');
            return;
        }

        // Toggle menu
        mobileToggle.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Mobile menu toggled');
            
            const isActive = navMenu.classList.contains('active');
            
            if (isActive) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.style.overflow = 'auto';
                mobileToggle.setAttribute('aria-label', 'Open menu');
            } else {
                navMenu.classList.add('active');
                mobileToggle.classList.add('active');
                document.body.style.overflow = 'hidden';
                mobileToggle.setAttribute('aria-label', 'Close menu');
            }
        });

        // Close menu when clicking nav links
        const navLinks = navMenu.querySelectorAll('.nav-link, .cta-btn');
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileToggle.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            }
        });
    }

    /* Reveal Animations */
    function setupRevealAnimations() {
        // Simple fallback for older browsers
        const revealElements = document.querySelectorAll('[data-reveal]');
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const delay = entry.target.getAttribute('data-delay') || 0;
                        setTimeout(function() {
                            entry.target.classList.add('revealed');
                        }, parseFloat(delay) * 1000);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '0px 0px -50px 0px',
                threshold: 0.1
            });

            revealElements.forEach(function(element) {
                observer.observe(element);
            });
        } else {
            // Fallback for older browsers
            revealElements.forEach(function(element) {
                element.classList.add('revealed');
            });
        }

        // Ensure content is visible after 2 seconds regardless
        setTimeout(function() {
            revealElements.forEach(function(element) {
                if (!element.classList.contains('revealed')) {
                    element.classList.add('revealed');
                }
            });
        }, 2000);
    }

    /* Contact Form */
    function setupContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            // Show loading state
            submitButton.innerHTML = '<span>Sending...</span>';
            submitButton.disabled = true;

            // Get form data
            const formData = new FormData(form);
            const data = {};
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }

            // Basic validation
            if (!data.name || !data.email || !data.message) {
                showNotification('Please fill in all required fields.', 'error');
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                return;
            }

            // Send to server
            fetch('/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(result) {
                if (result.success) {
                    showNotification('Thank you! We\'ll get back to you within 24 hours.', 'success');
                    form.reset();
                } else {
                    throw new Error(result.error || 'Something went wrong');
                }
            })
            .catch(function(error) {
                console.error('Form submission error:', error);
                showNotification('Sorry, there was an error. Please try again.', 'error');
            })
            .finally(function() {
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            });
        });
    }

    /* Smooth Scrolling */
    function setupSmoothScrolling() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const navbarHeight = 80;
                    const targetPosition = targetElement.offsetTop - navbarHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /* Premium Effects */
    function setupPremiumEffects() {
        // Service card hover effects
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(function(card) {
            const icon = card.querySelector('.service-icon');
            
            card.addEventListener('mouseenter', function() {
                if (icon) {
                    icon.style.transform = 'rotate(5deg) scale(1.1)';
                    icon.style.transition = 'transform 0.3s ease';
                }
            });

            card.addEventListener('mouseleave', function() {
                if (icon) {
                    icon.style.transform = 'rotate(0deg) scale(1)';
                }
            });
        });

        // Trust indicator counter animation
        setupCounters();
    }

    /* Counter Animation */
    function setupCounters() {
        const trustNumbers = document.querySelectorAll('.trust-number');
        const trustSection = document.querySelector('.trust-indicators');
        
        if (!trustSection || trustNumbers.length === 0) return;

        let hasAnimated = false;

        function animateCounters() {
            if (hasAnimated) return;
            hasAnimated = true;

            trustNumbers.forEach(function(number) {
                const finalText = number.textContent;
                const numValue = parseInt(finalText.replace(/[^\d]/g, ''));
                const isPercentage = finalText.includes('%');
                const isPlus = finalText.includes('+');
                
                let current = 0;
                const increment = numValue / 50;

                function updateCounter() {
                    if (current < numValue) {
                        current += increment;
                        let displayValue = Math.ceil(current);
                        
                        if (isPercentage) {
                            number.textContent = displayValue + '%';
                        } else if (isPlus) {
                            number.textContent = displayValue + '+';
                        } else {
                            number.textContent = displayValue;
                        }
                        
                        requestAnimationFrame(updateCounter);
                    } else {
                        number.textContent = finalText;
                    }
                }

                updateCounter();
            });
        }

        // Trigger animation when visible
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        setTimeout(animateCounters, 500);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(trustSection);
        } else {
            // Fallback
            setTimeout(animateCounters, 1000);
        }
    }

    /* Notification System */
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = 'notification notification-' + type;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--color-background, #fff);
            border: 1px solid var(--color-border, #e5e7eb);
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            padding: 16px;
            max-width: 400px;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        if (type === 'success') {
            notification.style.borderLeft = '4px solid #00E0C6';
        } else if (type === 'error') {
            notification.style.borderLeft = '4px solid #ef4444';
        }

        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <span>${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
                <span style="flex: 1; font-size: 14px;">${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; font-size: 18px; cursor: pointer; opacity: 0.6;">&times;</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Show notification
        setTimeout(function() {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto-hide after 5 seconds
        setTimeout(function() {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(function() {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }

    // Make showNotification available globally
    window.showNotification = showNotification;

})();
