// Stille Farbe — Global JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Feather icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }

    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements with fade potential
    document.querySelectorAll('section > div, article, .group').forEach(el => {
        el.style.opacity = '0';
        fadeObserver.observe(el);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('flex');
        });
    }

    // Language toggle
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        langToggle.addEventListener('click', toggleLanguage);
    }

    // Form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });

    // Initialize lazy loading for images
    initLazyLoading();
});

// Language state
let currentLang = 'de';

function toggleLanguage() {
    currentLang = currentLang === 'de' ? 'en' : 'de';
    const toggle = document.getElementById('lang-toggle');
    if (toggle) {
        toggle.textContent = currentLang === 'de' ? 'DE' : 'EN';
    }
    // In a real implementation, this would trigger translation
    document.documentElement.lang = currentLang;
}

// Form handling
function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Basic validation
    const required = form.querySelectorAll('[required]');
    let valid = true;
    
    required.forEach(field => {
        if (!field.value.trim()) {
            valid = false;
            field.classList.add('border-red-500');
        } else {
            field.classList.remove('border-red-500');
        }
    });
    
    if (!valid) return;
    
    // Simulate send
    submitBtn.disabled = true;
    submitBtn.textContent = currentLang === 'de' ? 'Wird gesendet...' : 'Sending...';
    
    setTimeout(() => {
        submitBtn.textContent = currentLang === 'de' ? 'Gesendet ✓' : 'Sent ✓';
        submitBtn.classList.add('bg-green-600');
        form.reset();
        
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            submitBtn.classList.remove('bg-green-600');
        }, 3000);
    }, 1500);
}

// Lazy loading with blur-up effect
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('opacity-0');
                
                img.onload = () => {
                    img.classList.remove('opacity-0');
                    img.classList.add('transition-opacity', 'duration-500');
                };
                
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Lightbox functionality
function openLightbox(src, title, details) {
    const lightbox = document.createElement('div');
    lightbox.className = 'fixed inset-0 z-50 bg-deep-charcoal/95 flex items-center justify-center p-4 md:p-8';
    lightbox.innerHTML = `
        <button class="absolute top-6 right-6 text-white/80 hover:text-white p-2" onclick="this.parentElement.remove()">
            <i data-feather="x" class="w-8 h-8"></i>
        </button>
        <div class="max-w-6xl w-full flex flex-col md:flex-row gap-8 items-center">
            <img src="${src}" alt="${title}" class="max-h-[70vh] md:max-h-[85vh] object-contain">
            <div class="text-white md:w-80">
                <p class="text-xs tracking-[0.2em] uppercase text-white/60 mb-2">${details.year}</p>
                <h3 class="font-founders text-2xl font-light mb-4">${title}</h3>
                <p class="text-white/70 font-light text-sm leading-relaxed mb-6">${details.medium}</p>
                <p class="text-white/50 text-sm">${details.dimensions}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(lightbox);
    
    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) lightbox.remove();
    });
    
    // Close on escape
    const closeOnEscape = (e) => {
        if (e.key === 'Escape') {
            lightbox.remove();
            document.removeEventListener('keydown', closeOnEscape);
        }
    };
    document.addEventListener('keydown', closeOnEscape);
    
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
}

// Filter functionality for works page
function initFilters() {
    const filterButtons = document.querySelectorAll('[data-filter]');
    const workItems = document.querySelectorAll('[data-category]');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            
            // Update active state
            filterButtons.forEach(b => b.classList.remove('bg-german-blue', 'text-white'));
            btn.classList.add('bg-german-blue', 'text-white');
            
            // Filter items
            workItems.forEach(item => {
                const categories = item.dataset.category.split(' ');
                if (filter === 'all' || categories.includes(filter)) {
                    item.style.display = '';
                    setTimeout(() => item.classList.remove('opacity-0'), 10);
                } else {
                    item.classList.add('opacity-0');
                    setTimeout(() => item.style.display = 'none', 300);
                }
            });
        });
    });
}

// Exhibition timeline
function initTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('timeline-visible');
            }
        });
    }, { threshold: 0.2 });
    
    timelineItems.forEach(item => timelineObserver.observe(item));
}

// Export for use in components
window.StilleFarbe = {
    openLightbox,
    toggleLanguage,
    currentLang: () => currentLang
};