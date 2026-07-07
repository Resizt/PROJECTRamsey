const scrollCta = document.getElementById('scroll-cta');
const contactSection = document.getElementById('contact');

// Sequential targets array ordered strictly as requested
const targetSections = ['about', 'showreel', 'press', 'contact'];

// Core visibility evaluation handler
function monitorArrowVisibility() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const contactTop = contactSection.getBoundingClientRect().top + scrollY;

    // Instantly hide the element if inside or matching the boundary line of #contact
    if (scrollY + windowHeight >= contactTop + 60) {
        scrollCta.classList.add('hidden');
    } else {
        scrollCta.classList.remove('hidden');
    }
}

// Stepped execution logic triggered on click
scrollCta.addEventListener('click', () => {
    const currentScroll = window.scrollY;
    let targetId = targetSections[0]; // Fallback baseline default

    // Search ahead to match the current viewport frame location
    for (let i = 0; i < targetSections.length; i++) {
        const element = document.getElementById(targetSections[i]);
        if (element) {
            const elementTop = element.getBoundingClientRect().top + currentScroll;

            // If the current viewport top is higher than a section's position (with a tiny threshold padding)
            if (currentScroll < elementTop - 20) {
                targetId = targetSections[i];
                break;
            }
        }
    }

    // Route execution down to the target location coordinates smoothly
    const destinationElement = document.getElementById(targetId);
    if (destinationElement) {
        destinationElement.scrollIntoView({
            behavior: 'smooth'
        });
    }
});

// --- NEW: DYNAMIC NAV TRACKING VIA INTERSECTION OBSERVER ---
const navLinks = document.querySelectorAll('nav a');
const scrollSections = document.querySelectorAll('.hero-video-container, section');

const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px', // Evaluates items entering upper-middle viewport threshold
    threshold: 0
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const currentId = entry.target.getAttribute('id');

            navLinks.forEach(link => {
                if (link.getAttribute('href') === `#${currentId}`) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
    });
}, observerOptions);

scrollSections.forEach(section => sectionObserver.observe(section));

// Initialize event observers across interactions
window.addEventListener('scroll', monitorArrowVisibility);
window.addEventListener('resize', monitorArrowVisibility);
monitorArrowVisibility();

// --- CONTACT FORM MAILTO HANDLER ---
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.getElementById('name')?.value?.trim() || '';
        const email = document.getElementById('email')?.value?.trim() || '';
        const subject = document.getElementById('subject')?.value?.trim() || 'New contact form submission';
        const message = document.getElementById('message')?.value?.trim() || '';
        const recipient = '???'; // Replace with your actual email address

        const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;

        window.location.href = mailtoLink;
        contactForm.reset();
    });
}

// --- VIDEO AUTOPLAY RESUMPTION ON PAGE VISIBILITY ---
// Handle mobile browser behavior where videos pause when tab loses focus
const heroVideo = document.querySelector('.hero-video-bg');

if (heroVideo) {
    // Resume video when page becomes visible again
    document.addEventListener('visibilitychange', () => {
        if (document.hidden === false) {
            // Page is now visible, resume video playback
            heroVideo.play().catch(error => {
                console.log('Video autoplay resumed:', error);
            });
        }
    });

    // Also handle when user returns to the tab
    window.addEventListener('focus', () => {
        heroVideo.play().catch(error => {
            console.log('Video autoplay on focus:', error);
        });
    });
}