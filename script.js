// Email Placeholder Typing Animation
const emailNames = [
    'jan.kowalski',
    'anna.nowak',
    'piotr.wisniewski',
    'maria.wojcik',
    'tomasz.kaminski',
    'katarzyna.lewandowska',
    'michal.zielinski',
    'agnieszka.szymanska'
];

function typeEmail(element, name, callback) {
    const email = name + '@gmail.com';
    let currentIndex = 0;
    
    function typeCharacter() {
        if (currentIndex < email.length) {
            element.placeholder = email.substring(0, currentIndex + 1);
            currentIndex++;
            setTimeout(typeCharacter, 80);
        } else {
            setTimeout(() => {
                deleteEmail(element, callback);
            }, 2000);
        }
    }
    
    typeCharacter();
}

function deleteEmail(element, callback) {
    let currentText = element.placeholder;
    
    function deleteCharacter() {
        if (currentText.length > 0) {
            currentText = currentText.substring(0, currentText.length - 1);
            element.placeholder = currentText;
            setTimeout(deleteCharacter, 40);
        } else {
            callback();
        }
    }
    
    deleteCharacter();
}

function startEmailAnimation() {
    const emailInputs = ['heroEmail', 'ctaEmail'];
    
    emailInputs.forEach(inputId => {
        const emailInput = document.getElementById(inputId);
        if (!emailInput) return;
        
        let currentNameIndex = 0;
        
        function animateNextEmail() {
            if (document.activeElement !== emailInput && !emailInput.value) {
                const name = emailNames[currentNameIndex];
                typeEmail(emailInput, name, () => {
                    currentNameIndex = (currentNameIndex + 1) % emailNames.length;
                    animateNextEmail();
                });
            } else {
                setTimeout(animateNextEmail, 1000);
            }
        }
        
        // Start animation after a short delay
        setTimeout(animateNextEmail, 500);
        
        // Stop animation when user focuses on input
        emailInput.addEventListener('focus', () => {
            if (!emailInput.value) {
                emailInput.placeholder = 'Wpisz swój email';
            }
        });
        
        // Resume animation when user leaves input empty
        emailInput.addEventListener('blur', () => {
            if (!emailInput.value) {
                setTimeout(animateNextEmail, 500);
            }
        });
    });
}

// Waitlist submission handling
document.addEventListener('DOMContentLoaded', () => {
    startEmailAnimation();

    const waitlistForms = document.querySelectorAll('.waitlist-form');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    waitlistForms.forEach(form => {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const emailInput = form.querySelector('input[type="email"]');
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            const email = emailInput.value.trim();
            if (!email) {
                showNotification('Proszę wpisać adres e-mail.', 'error');
                emailInput.focus();
                return;
            }

            if (!emailRegex.test(email)) {
                showNotification('Podaj poprawny adres e-mail.', 'error');
                emailInput.focus();
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Wysyłanie...';

            try {
                const formData = new FormData(form);
                if (!formData.get('source')) {
                    formData.set('source', form.dataset.source || 'Formularz Aufix');
                }

                const response = await fetch(form.getAttribute('action'), {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json().catch(() => ({}));

                if (response.ok && result.status === 'success') {
                    showNotification(result.message || 'Dziękujemy! Zapisaliśmy Cię na listę oczekujących.', 'success');
                    emailInput.value = '';
                } else {
                    showNotification(result.message || 'Nie udało się wysłać formularza. Spróbuj ponownie.', 'error');
                }
            } catch (error) {
                showNotification('Wystąpił błąd sieci. Spróbuj ponownie.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    });
});

// Feature Tabs Auto-Switching
let currentTab = 0;
let tabInterval;

function switchTab(index) {
    const tabs = document.querySelectorAll('.feature-tab');
    const screens = document.querySelectorAll('.app-preview-screens .screen');
    
    if (!tabs.length || !screens.length) return;
    
    // Remove active class from all
    tabs.forEach(tab => tab.classList.remove('active'));
    screens.forEach((screen, screenIndex) => {
        screen.classList.remove('active');
        
        // Calculate distance from active screen
        const distance = Math.abs(screenIndex - index);
        
        // Scale down by 10% per step (0.9 for distance 1, 0.8 for distance 2, etc.)
        const scale = 1 - (distance * 0.1);
        
        // Calculate z-index: active screen = 10, others based on distance (closer = higher)
        let zIndex;
        if (screenIndex === index) {
            zIndex = 10; // Active screen on top
        } else {
            // Inactive screens: lower z-index for screens further from active
            zIndex = 5 - distance;
        }
        
        // Apply scale and z-index based on distance
        screen.style.zIndex = zIndex;
        
        if (screenIndex === index) {
            // Active screen
            screen.style.transform = 'translateY(-50%) scale(1)';
            screen.style.opacity = '1';
        } else {
            // Inactive screens scale down based on distance
            screen.style.transform = `translateY(-50%) scale(${scale})`;
            screen.style.opacity = '1';
        }
    });
    
    // Add active class to current
    tabs[index].classList.add('active');
    screens[index].classList.add('active');
}

function startTabRotation() {
    const tabs = document.querySelectorAll('.feature-tab');
    if (!tabs.length) return;

    clearInterval(tabInterval);

    switchTab(currentTab);

    tabInterval = setInterval(() => {
        currentTab = (currentTab + 1) % tabs.length;
        switchTab(currentTab);
    }, 7000);
}

// Manual tab click
document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.feature-tab');
    
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            if (tabInterval) {
                clearInterval(tabInterval);
                tabInterval = null;
            }
            currentTab = index;
            switchTab(currentTab);
            
            // Restart auto-rotation after manual click
            setTimeout(() => {
                startTabRotation();
            }, 7000);
        });
    });
    
    // Start auto-rotation
    startTabRotation();

    const tabRotationMedia = window.matchMedia('(max-width: 768px)');
    tabRotationMedia.addEventListener('change', () => {
        currentTab = 0;
        startTabRotation();
    });
});

// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');

mobileMenuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    });
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
const themeTriggerSection = document.querySelector('.crm-preview') || document.querySelector('.features');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    if (themeTriggerSection) {
        const triggerTop = themeTriggerSection.offsetTop;
        if (currentScroll + 80 >= triggerTop) {
            navbar.classList.add('over-features');
        } else {
            navbar.classList.remove('over-features');
        }
    }
    
    lastScroll = currentScroll;
});

// Scroll animations
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight - 100 && elementBottom > 0) {
            element.classList.add('animated');
        }
    });
};

// Initial check for animations
animateOnScroll();

// Check on scroll
window.addEventListener('scroll', animateOnScroll);

// Scroll to top button
const scrollToTopBtn = document.getElementById('scrollToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

const pricingEarlyBirdBtn = document.getElementById('pricingEarlyBirdBtn');

if (pricingEarlyBirdBtn) {
    pricingEarlyBirdBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Contact form handling
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(contactForm);
        const name = (formData.get('name') || '').trim();
        const email = (formData.get('email') || '').trim();
        const message = (formData.get('message') || '').trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name) {
            showNotification('Podaj swoje imię lub nazwę firmy.', 'error');
            return;
        }

        if (!emailRegex.test(email)) {
            showNotification('Podaj poprawny adres e-mail.', 'error');
            return;
        }

        if (!message) {
            showNotification('Napisz krótką wiadomość.', 'error');
            return;
        }

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Wysyłanie...';
        submitBtn.disabled = true;

        try {
            const response = await fetch(contactForm.getAttribute('action'), {
                method: 'POST',
                body: formData
            });

            const result = await response.json().catch(() => ({}));

            if (response.ok && result.status === 'success') {
                showNotification(result.message || 'Dziękujemy! Skontaktujemy się wkrótce.', 'success');
                contactForm.reset();
            } else {
                showNotification(result.message || 'Nie udało się wysłać wiadomości. Spróbuj ponownie.', 'error');
            }
        } catch (error) {
            showNotification('Wystąpił błąd sieci. Spróbuj ponownie.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Workshop form handling
const workshopForm = document.getElementById('workshopForm');

if (workshopForm) {
    workshopForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(workshopForm);
        const company = (formData.get('company') || '').trim();
        const phone = (formData.get('phone') || '').trim();

        if (!company) {
            showNotification('Podaj nazwę firmy.', 'error');
            return;
        }

        const digitsOnly = phone.replace(/\D/g, '');
        if (digitsOnly.length < 9) {
            showNotification('Podaj poprawny numer telefonu.', 'error');
            return;
        }

        const submitBtn = workshopForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Wysyłanie...';
        submitBtn.disabled = true;

        try {
            const response = await fetch(workshopForm.getAttribute('action'), {
                method: 'POST',
                body: formData
            });

            const result = await response.json().catch(() => ({}));

            if (response.ok && result.status === 'success') {
                showNotification(result.message || 'Dziękujemy! Skontaktujemy się w sprawie współpracy.', 'success');
                workshopForm.reset();
            } else {
                showNotification(result.message || 'Nie udało się wysłać formularza. Spróbuj ponownie.', 'error');
            }
        } catch (error) {
            showNotification('Wystąpił błąd sieci. Spróbuj ponownie.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Notification system
const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#48bb78' : '#f56565'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
};

// Add animation styles for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.hero-image-placeholder');
    
    if (heroImage && scrolled < window.innerHeight) {
        heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// Phone number formatting for workshop form
const workshopPhoneInput = document.getElementById('workshopPhone');

if (workshopPhoneInput) {
    workshopPhoneInput.addEventListener('input', (event) => {
        let digits = event.target.value.replace(/\D/g, '');

        // Remove leading country code or zero
        if (digits.startsWith('48')) {
            digits = digits.substring(2);
        }
        if (digits.startsWith('0')) {
            digits = digits.substring(1);
        }

        digits = digits.substring(0, 9);

        if (!digits.length) {
            event.target.value = '';
            return;
        }

        let formatted = '+48 ';
        if (digits.length <= 3) {
            formatted += digits;
        } else if (digits.length <= 6) {
            formatted += `${digits.substring(0, 3)} ${digits.substring(3)}`;
        } else {
            formatted += `${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6)}`;
        }

        event.target.value = formatted.trim();
    });
}

// Lazy loading for images (if you add images later)
const lazyLoadImages = () => {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
};

// Initialize lazy loading
lazyLoadImages();

// Add hover effect to cards
const cards = document.querySelectorAll('.product-card, .pricing-card');
cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

