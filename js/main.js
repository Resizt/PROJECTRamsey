const scrollCta = document.getElementById('scroll-cta');
const contactSection = document.getElementById('contact');

// Sequential targets array ordered strictly as requested
const targetSections = ['about', 'showreel', 'modeling', 'press', 'contact'];

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
        const recipient = 'christina.andrea.rams@gmail.com'; // Replace with your actual email address

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

// --- SHOWREEL CAROUSEL + INLINE PLAYER ---
const showreelTrackContainer = document.querySelector('.showreel-track-container');
const showreelTrack = document.querySelector('.showreel-track');
const showreelSlides = Array.from(document.querySelectorAll('.showreel-slide'));
const showreelDotsContainer = document.querySelector('.showreel-dots');
const showreelPrevButton = document.querySelector('.showreel-nav--prev');
const showreelNextButton = document.querySelector('.showreel-nav--next');
const showreelVideo = document.getElementById('showreel-video');
const showreelVideoTitle = document.getElementById('showreel-video-title');
const showreelVideoDescription = document.getElementById('showreel-video-description');

if (showreelDotsContainer && showreelSlides.length) {
    showreelDotsContainer.innerHTML = '';
    showreelSlides.forEach((slide, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'showreel-dot';
        dot.dataset.index = String(index);
        dot.setAttribute('aria-label', `Show ${slide.dataset.title || 'Clip'}`);
        showreelDotsContainer.appendChild(dot);
    });
}

const showreelDots = Array.from(document.querySelectorAll('.showreel-dot'));

let activeShowreelIndex = 0;

function updateShowreelSelection(index) {
    if (!showreelSlides.length || !showreelVideo) {
        return;
    }

    activeShowreelIndex = (index + showreelSlides.length) % showreelSlides.length;
    const activeSlide = showreelSlides[activeShowreelIndex];

    showreelSlides.forEach((slide, slideIndex) => {
        slide.classList.toggle('is-active', slideIndex === activeShowreelIndex);
    });

    showreelDots.forEach((dot, dotIndex) => {
        dot.classList.toggle('is-active', dotIndex === activeShowreelIndex);
    });

    if (showreelTrack && showreelSlides.length) {
        const trackGap = parseFloat(getComputedStyle(showreelTrack).gap) || 18;
        const slideWidth = showreelSlides[0].offsetWidth;
        const offset = activeShowreelIndex * (slideWidth + trackGap);
        showreelTrack.style.transform = `translateX(-${offset}px)`;
    }

    if (activeSlide) {
        const overlayText = activeSlide.querySelector('.play-overlay__text');
        const overlayTitle = overlayText?.querySelector('h3')?.textContent?.trim();
        const overlayDescription = overlayText?.querySelector('p')?.textContent?.trim();

        showreelVideoTitle.textContent = overlayTitle || activeSlide.dataset.title || 'Showreel Clip';
        showreelVideoDescription.textContent = overlayDescription || activeSlide.dataset.description || 'Featured performance';
        showreelVideo.poster = activeSlide.dataset.poster || '';
        showreelVideo.src = activeSlide.dataset.video || '';
        showreelVideo.load();
        showreelVideo.play().catch(() => {
            // Ignore autoplay restrictions on some browsers.
        });
    }
}

showreelSlides.forEach((slide, index) => {
    slide.addEventListener('click', () => {
        updateShowreelSelection(index);
    });
});

showreelDots.forEach((dot) => {
    dot.addEventListener('click', () => {
        updateShowreelSelection(Number(dot.dataset.index));
    });
});

if (showreelPrevButton) {
    showreelPrevButton.addEventListener('click', () => {
        updateShowreelSelection(activeShowreelIndex - 1);
    });
}

if (showreelNextButton) {
    showreelNextButton.addEventListener('click', () => {
        updateShowreelSelection(activeShowreelIndex + 1);
    });
}

updateShowreelSelection(0);

// --- MODELING / RUNWAY GALLERY LIGHTBOX ---
const modelingThumbs = Array.from(document.querySelectorAll('.modeling-thumb'));
const modelingModal = document.getElementById('modeling-modal');
const modelingModalImage = document.getElementById('modeling-modal-image');
const modelingModalTitle = document.getElementById('modeling-modal-title');
const modelingModalDescription = document.getElementById('modeling-modal-description');
const modelingModalClose = document.querySelector('.modeling-modal__close');

function openModelingModal(thumb) {
    const imageUrl = thumb.dataset.full;
    const titleText = thumb.dataset.title || 'Modeling Image';
    const captionText = thumb.dataset.caption || '';

    modelingModalImage.src = imageUrl;
    modelingModalImage.alt = titleText;
    modelingModalTitle.textContent = titleText;
    modelingModalDescription.textContent = captionText;
    modelingModal.classList.add('is-open');
    modelingModal.setAttribute('aria-hidden', 'false');
}

function closeModelingModal() {
    modelingModal.classList.remove('is-open');
    modelingModal.setAttribute('aria-hidden', 'true');
    modelingModalImage.src = '';
}

modelingThumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => openModelingModal(thumb));
});

if (modelingModalClose) {
    modelingModalClose.addEventListener('click', closeModelingModal);
}

if (modelingModal) {
    modelingModal.addEventListener('click', (event) => {
        if (event.target === modelingModal) {
            closeModelingModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modelingModal.classList.contains('is-open')) {
            closeModelingModal();
        }
    });
}