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

// Waitlist submission function
function submitWaitlist(inputId) {
    const emailInput = document.getElementById(inputId);
    const email = emailInput.value.trim();
    
    if (!email) {
        alert('Proszę wpisać adres email');
        emailInput.focus();
        return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Proszę wpisać poprawny adres email');
        emailInput.focus();
        return;
    }
    
    // Here you would normally send the email to your backend
    console.log('Email submitted:', email);
    alert('Dziękujemy! Zapisaliśmy Cię na listę oczekiwań.');
    emailInput.value = '';
}

// Start email animation when page loads
document.addEventListener('DOMContentLoaded', startEmailAnimation);

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
            clearInterval(tabInterval);
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
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
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

// Contact form handling
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        company: document.getElementById('company').value,
        message: document.getElementById('message').value
    };
    
    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    try {
        // Here you would send the data to your backend
        // const response = await fetch('/api/contact', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(formData)
        // });
        
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show success message
        showNotification('Спасибо! Мы свяжемся с вами в ближайшее время.', 'success');
        
        // Reset form
        contactForm.reset();
    } catch (error) {
        showNotification('Произошла ошибка. Пожалуйста, попробуйте позже.', 'error');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

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

// Phone number formatting
const phoneInput = document.getElementById('phone');
phoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 0) {
        if (value.length <= 1) {
            value = '+7 (' + value;
        } else if (value.length <= 4) {
            value = '+7 (' + value.substring(1);
        } else if (value.length <= 7) {
            value = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4);
        } else if (value.length <= 9) {
            value = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4, 7) + '-' + value.substring(7);
        } else {
            value = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4, 7) + '-' + value.substring(7, 9) + '-' + value.substring(9, 11);
        }
    }
    
    e.target.value = value;
});

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

// Log page load
console.log('%c🔧 Aufix Landing Page loaded successfully!', 'color: #667eea; font-size: 16px; font-weight: bold;');
console.log('%cFor any issues, contact: info@aufix.kz', 'color: #718096;');
