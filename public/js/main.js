// Loading Screen Logic
window.addEventListener('load', () => {
    const loader = document.getElementById('loader-wrapper');
    
    // Add a tiny extra delay so the animation feels intentional
    setTimeout(() => {
        loader.classList.add('fade-out');
        document.body.classList.remove('loading');
        
        // Trigger Hero Section animations after loader disappears
        setTimeout(() => {
            const heroEls = document.querySelectorAll('.hero-reveal, .hero-reveal-img');
            heroEls.forEach((el, i) => {
                // Stagger small delays for each hero element
                el.style.transitionDelay = `${0.12 + i * 0.08}s`;
                el.classList.add('show');

                // If this element is the main H1, split visible text into animated word spans
                if (el.tagName === 'H1' || (el.querySelector && el.querySelector('h1'))) {
                    const h1 = el.tagName === 'H1' ? el : el.querySelector('h1');
                    if (h1 && !h1.classList.contains('text-animated')) {
                        // Create a document fragment and recursively process child nodes
                        let wordIndex = 0;
                        const frag = document.createDocumentFragment();

                            function processNode(node, parent) {
                                if (node.nodeType === Node.TEXT_NODE) {
                                // Preserve whitespace tokens so spacing remains correct
                                const tokens = node.textContent.split(/(\s+)/);
                                tokens.forEach(tok => {
                                    if (/^\s+$/.test(tok)) {
                                        parent.appendChild(document.createTextNode(tok));
                                    } else if (tok.length) {
                                        const span = document.createElement('span');
                                        span.className = 'headline-word';
                                        span.textContent = tok;
                                        span.style.transitionDelay = `${wordIndex * 80}ms`;
                                        parent.appendChild(span);
                                        wordIndex++;
                                    }
                                });
                            } else if (node.nodeType === Node.ELEMENT_NODE) {
                                // If this is a gradient-text element, keep it intact and animate as one unit
                                if (node.classList && node.classList.contains('gradient-text')) {
                                    const clone = node.cloneNode(true);
                                    clone.classList.add('headline-word');
                                    clone.style.transitionDelay = `${wordIndex * 80}ms`;
                                    parent.appendChild(clone);
                                    wordIndex++;
                                } else {
                                    const clone = node.cloneNode(false);
                                    parent.appendChild(clone);
                                    node.childNodes.forEach(child => processNode(child, clone));
                                }
                            }
                        }

                        h1.childNodes.forEach(child => processNode(child, frag));

                        // Replace H1 contents with the processed fragment
                        h1.innerHTML = '';
                        h1.appendChild(frag);
                        h1.classList.add('text-animated');

                        // Trigger the word animations shortly after replacing
                        setTimeout(() => {
                            h1.querySelectorAll('.headline-word').forEach(s => s.classList.add('show'));
                        }, 80);
                    }
                }
            });
        }, 120);
    }, 800); 
});

// Immediately add the loading class to body on script execution
document.body.classList.add('loading');


// Mobile Navigation Toggle Logic
document.addEventListener('DOMContentLoaded', () => {
    // Corrected IDs to match the simplified HTML above
    const toggleBtn = document.getElementById('mobile-nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    // Initialize Lucide icons first so the generated SVGs exist in the DOM
    if (window.lucide) {
        lucide.createIcons();
    }

    // Query icons AFTER Lucide has created them (use data-lucide selector as a fallback)
    const menuIcon = document.querySelector('[data-lucide="menu"]') || document.getElementById('menu-icon');
    const closeIcon = document.querySelector('[data-lucide="x"]') || document.getElementById('close-icon');

    // Explicitly enforce the visible/hidden state on the generated SVGs (handles Lucide replacement)
    if (menuIcon) {
        menuIcon.classList.remove('hidden');
        menuIcon.style.display = '';
    }
    if (closeIcon) {
        closeIcon.classList.add('hidden');
        // also set inline style to be certain the element is not visible
        closeIcon.style.display = 'none';
    }

    // Enforce initial closed state to avoid showing the 'close' icon by default
    if (toggleBtn && mobileMenu) {
        mobileMenu.classList.add('hidden');
        toggleBtn.setAttribute('aria-expanded', 'false');

        toggleBtn.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.contains('hidden');

            if (isHidden) {
                // Open Menu
                mobileMenu.classList.remove('hidden');
                if (menuIcon) { menuIcon.classList.add('hidden'); menuIcon.style.display = 'none'; }
                if (closeIcon) { closeIcon.classList.remove('hidden'); closeIcon.style.display = ''; }
                toggleBtn.setAttribute('aria-expanded', 'true');
            } else {
                // Close Menu
                mobileMenu.classList.add('hidden');
                if (menuIcon) { menuIcon.classList.remove('hidden'); menuIcon.style.display = ''; }
                if (closeIcon) { closeIcon.classList.add('hidden'); closeIcon.style.display = 'none'; }
                toggleBtn.setAttribute('aria-expanded', 'false');
            }
        });

        // Close menu when clicking a link
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                if (menuIcon) { menuIcon.classList.remove('hidden'); menuIcon.style.display = ''; }
                if (closeIcon) { closeIcon.classList.add('hidden'); closeIcon.style.display = 'none'; }
                toggleBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }


// Project Filtering Logic with Scroll Reset and Active Button State

    function filterProjects(category, btn) {
    const cards = document.querySelectorAll('.project-card');
    const buttons = document.querySelectorAll('.filter-btn');
    const track = document.getElementById('project-track'); // Get the track

    // 1. Reset scroll position to the start
    track.scrollTo({ left: 0, behavior: 'smooth' });

    // 2. Update active button UI
    buttons.forEach(b => b.classList.remove('active', 'bg-blue-600', 'text-white'));
    btn.classList.add('active', 'bg-blue-600', 'text-white');

    // 3. Filter the cards
    cards.forEach(card => {
        if (category === 'all' || card.classList.contains(category)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}




    // ... rest of your contact form and portfolio code ...

            // Contact form handling
            const contactForm = document.getElementById('contact-form');
            const statusMessage = document.getElementById('form-status');
            const submitBtn = document.getElementById('submit-btn');

            if (contactForm && submitBtn && statusMessage) {
                contactForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    submitBtn.disabled = true;
                    submitBtn.innerText = 'Sending...';

                    const data = new FormData(contactForm);
                    const jsonData = Object.fromEntries(data);

                    try {
                        const response = await fetch(contactForm.action, {
                            method: 'POST',
                            body: JSON.stringify(jsonData),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        });

                        if (response.ok) {
                            // Confetti
                            if (typeof confetti === 'function') {
                                confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#2563eb', '#ffffff', '#64748b'] });
                            }

                            statusMessage.textContent = 'Success! Your message has been sent.';
                            statusMessage.classList.remove('hidden', 'opacity-0');
                            statusMessage.classList.add('text-emerald-400', 'opacity-100');
                            contactForm.reset();

                            setTimeout(() => {
                                statusMessage.classList.add('opacity-0');
                                setTimeout(() => statusMessage.classList.add('hidden'), 500);
                            }, 10000);
                        } else {
                            throw new Error('Network response not ok');
                        }
                    } catch (err) {
                        statusMessage.textContent = 'Oops! Something went wrong. Please try again.';
                        statusMessage.classList.remove('hidden', 'opacity-0');
                        statusMessage.classList.add('text-red-500', 'opacity-100');
                    } finally {
                        submitBtn.disabled = false;
                        submitBtn.innerText = 'Send Message';
                    }
                });
            }
});

// Scroll Logic
function scrollTrack(direction) {
    const track = document.getElementById('project-track');
    if (!track) return;

    // Measure a single card (including gap) for consistent scrolling
    const card = track.querySelector('.project-card');
    const gap = (() => {
        const cs = getComputedStyle(track);
        return parseInt(cs.gap || cs.columnGap || 16, 10) || 16;
    })();

    const cardWidth = card ? (card.offsetWidth + gap) : Math.min(320, track.clientWidth * 0.8);

    // Calculate target and clamp within bounds so white space at edges can't appear
    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    let target = track.scrollLeft + direction * cardWidth;
    target = Math.max(0, Math.min(target, maxScroll));

    track.scrollTo({ left: target, behavior: 'smooth' });
}

// Function to Open the Project Modal with Dynamic Content

function openProjectModal(img, title, category, desc, tools, link) {
    const modal = document.getElementById('project-modal');
    const backdrop = document.getElementById('modal-backdrop');
    const card = document.getElementById('modal-card');
    
    // Inject Data
    document.getElementById('modal-img').src = img;
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-category').innerText = category;
    document.getElementById('modal-desc').innerText = desc;
    document.getElementById('modal-link').href = link;
    
    // Inject Tools chips
    const toolsContainer = document.getElementById('modal-tools');
    toolsContainer.innerHTML = ''; 
    tools.forEach(tool => {
        const span = document.createElement('span');
        span.className = 'text-[10px] font-bold px-3 py-1 bg-slate-100 text-slate-600 rounded-lg';
        span.innerText = tool;
        toolsContainer.appendChild(span);
    });

    // Animate In
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => {
        backdrop.classList.replace('opacity-0', 'opacity-100');
        card.classList.replace('opacity-0', 'opacity-100');
        card.classList.replace('scale-95', 'scale-100');
    }, 10);
    
    // Refresh Lucide icons in modal
    lucide.createIcons();
}

function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    const backdrop = document.getElementById('modal-backdrop');
    const card = document.getElementById('modal-card');

    backdrop.classList.replace('opacity-100', 'opacity-0');
    card.classList.replace('opacity-100', 'opacity-0');
    card.classList.replace('scale-100', 'scale-95');

    setTimeout(() => {
        modal.classList.replace('flex', 'hidden');
    }, 500);
}

// Close modal if user clicks outside the card
document.getElementById('modal-backdrop').addEventListener('click', closeProjectModal);
        // Scroll Logic
        function scrollTrack(direction) {
            const track = document.getElementById('project-track');
            if (!track) return;

            const card = track.querySelector('.project-card');
            const gap = (() => {
                const cs = getComputedStyle(track);
                return parseInt(cs.gap || cs.columnGap || 16, 10) || 16;
            })();

            const cardWidth = card ? (card.offsetWidth + gap) : Math.min(320, track.clientWidth * 0.8);
            const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
            let target = track.scrollLeft + direction * cardWidth;
            target = Math.max(0, Math.min(target, maxScroll));

            track.scrollTo({ left: target, behavior: 'smooth' });
        }

        // Filter Logic with Flex Fix
        function filterProjects(category, btn) {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const track = document.getElementById('project-track');
            const cards = document.querySelectorAll('.project-card');
            
            cards.forEach(card => {
                if (category === 'all' || card.classList.contains(category)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });

            // Toggle centering based on visible cards
            const visibleCards = Array.from(cards).filter(c => c.style.display !== 'none');
            if (visibleCards.length < 3) {
                track.classList.add('md:justify-center');
            } else {
                track.classList.remove('md:justify-center');
            }
        }





// Project Filtering Logic  

        function filterProjects(category, buttonElement) {
    // 1. Handle Button UI: Remove 'active' from all, add to current
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    buttonElement.classList.add('active');

    // 2. Handle Project Cards Logic
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        if (category === 'all' || card.classList.contains(category)) {
            card.style.display = 'block';
            // Optional: Re-trigger entrance animation
            setTimeout(() => card.style.opacity = '1', 10);
        } else {
            card.style.display = 'none';
            card.style.opacity = '0';
        }
    });
}


/// CV Generation Logic
 function generateCV() {
    // Replace this with the actual path to your professional CV
    const cvUrl = 'resume/Digital Marketing.pdf'; // Ensure this file is in the public directory
    window.open(cvUrl, '_blank');
}      


// Timeline Reveal Logic

document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, observerOptions);

    const timelineElements = document.querySelectorAll('.timeline-item, .timeline-line');
    timelineElements.forEach(el => observer.observe(el));
});

// Service Cards Reveal Logic
const observerOptions = {
    threshold: 0.1
};
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, observerOptions);

// Add this line inside your existing script where you select targets:
const serviceTargets = document.querySelectorAll('.reveal-card');
serviceTargets.forEach(target => observer.observe(target));


// About Section Reveal Logic

// Add this inside your existing script
const aboutTargets = document.querySelectorAll('.reveal-left, .reveal-right');
aboutTargets.forEach(target => observer.observe(target));

// Experience Section Reveal Logic
const experienceItems = document.querySelectorAll('.timeline-item, .timeline-line, .reveal-card');
experienceItems.forEach(item => observer.observe(item));

// Contact Section Reveal Logic
const contactElements = document.querySelectorAll('.reveal-left, .reveal-right');
contactElements.forEach(el => observer.observe(el));

