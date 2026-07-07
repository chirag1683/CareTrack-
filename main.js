/* ==========================================================================
   HealthTech / CareTrack Landing Page — Functional Layer
   Vanilla JS, no build step. Organized into small, reusable modules.
   ========================================================================== */

/* --------------------------------------------------------------------------
   0. CONFIG — replace these placeholders with your real EmailJS credentials
      and contact details. Get them from https://dashboard.emailjs.com
   -------------------------------------------------------------------------- */
const CONFIG = {
    emailjs: {
        publicKey: '09oDtmUwrkLypwByZ',
        serviceId: 'service_adimolc',
        templateId: 'template_jlrwpc9',
    },
    // The destination inbox is set inside the EmailJS template itself
    // ("To Email" field on dashboard.emailjs.com), not here.
    contact: {
        phone: '+919351403674',          // used for tel: and Call Us links
        email: 'workwithchirag09@email.com',         // used for mailto: links
        whatsappNumber: '919351403674',  // used for wa.me (no + or spaces)
    }
};

/* --------------------------------------------------------------------------
   1. EmailJS init (safe no-op if the SDK failed to load, e.g. offline)
   -------------------------------------------------------------------------- */
if (window.emailjs && CONFIG.emailjs.publicKey !== 'YOUR_PUBLIC_KEY') {
    emailjs.init({ publicKey: CONFIG.emailjs.publicKey });
}

/* --------------------------------------------------------------------------
   2. Reveal-on-scroll animations (existing behavior, preserved)
   -------------------------------------------------------------------------- */
const reveal = () => {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
};

window.addEventListener('scroll', reveal);
window.addEventListener('load', reveal);

/* --------------------------------------------------------------------------
   3. Animated stat counters (existing behavior, preserved)
   -------------------------------------------------------------------------- */
const counters = document.querySelectorAll('.counter');
const speed = 200;

const startCounter = () => {
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 10);
            } else {
                counter.innerText = target + (target === 100 || target === 50 ? '+' : '');
            }
        };
        updateCount();
    });
};

const statsSection = document.querySelector('.stats-container');
const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            startCounter();
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (statsSection) {
    statsObserver.observe(statsSection);
}

/* --------------------------------------------------------------------------
   4. Mouse-follow glow effect on cards (existing behavior, preserved)
   -------------------------------------------------------------------------- */
document.querySelectorAll('.card, .cta-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

/* --------------------------------------------------------------------------
   5. Smooth scroll for in-page anchors (Home/Solutions/Industries/About)
   -------------------------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return; // handled elsewhere (modal triggers etc.)
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

/* --------------------------------------------------------------------------
   6. Active navbar link on scroll (scroll-spy)
   -------------------------------------------------------------------------- */
const navLinks = document.querySelectorAll('.nav-link[data-section]');
const sections = Array.from(navLinks)
    .map(link => document.getElementById(link.dataset.section))
    .filter(Boolean);

const updateActiveNavLink = () => {
    let currentId = sections[0]?.id;
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
        if (section.offsetTop <= scrollPos) {
            currentId = section.id;
        }
    });

    navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.section === currentId);
    });
};

window.addEventListener('scroll', updateActiveNavLink);
window.addEventListener('load', updateActiveNavLink);

/* --------------------------------------------------------------------------
   7. Back to top button
   -------------------------------------------------------------------------- */
const backToTopBtn = document.getElementById('backToTopBtn');

if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        backToTopBtn.classList.toggle('visible', window.scrollY > 500);
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* --------------------------------------------------------------------------
   8. WhatsApp floating button
   -------------------------------------------------------------------------- */
const whatsappBtn = document.getElementById('whatsappBtn');

if (whatsappBtn) {
    const message = encodeURIComponent('Hello,\nI want a live demo of CareTrack.');
    whatsappBtn.href = `https://wa.me/${CONFIG.contact.whatsappNumber}?text=${message}`;
}

/* --------------------------------------------------------------------------
   9. Ripple effect for buttons with the .ripple class
   -------------------------------------------------------------------------- */
document.querySelectorAll('.ripple').forEach(btn => {
    btn.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const circle = document.createElement('span');
        const size = Math.max(rect.width, rect.height);

        circle.className = 'ripple-circle';
        circle.style.width = circle.style.height = `${size}px`;
        circle.style.left = `${e.clientX - rect.left - size / 2}px`;
        circle.style.top = `${e.clientY - rect.top - size / 2}px`;

        this.appendChild(circle);
        setTimeout(() => circle.remove(), 650);
    });
});

/* --------------------------------------------------------------------------
   10. Toast notification system
   -------------------------------------------------------------------------- */
const toastContainer = document.getElementById('toastContainer');

/**
 * Show a toast notification.
 * @param {string} message
 * @param {'success'|'error'|'warning'} type
 * @param {number} duration - milliseconds before auto-dismiss
 */
function showToast(message, type = 'success', duration = 4000) {
    if (!toastContainer) return;

    const icons = {
        success: 'check-circle',
        error: 'x-circle',
        warning: 'alert-triangle',
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.style.setProperty('--toast-life', `${duration / 1000}s`);
    toast.innerHTML = `<i data-lucide="${icons[type] || 'info'}" style="width:18px;height:18px;flex-shrink:0;"></i><span>${message}</span>`;

    toastContainer.appendChild(toast);
    if (window.lucide) lucide.createIcons();

    setTimeout(() => toast.remove(), duration + 500);
}

/* --------------------------------------------------------------------------
   11. Login button (no auth backend yet — friendly placeholder)
   -------------------------------------------------------------------------- */
document.querySelectorAll('[data-action="login"]').forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault();
        showToast('Login portal is coming soon. Please request a demo in the meantime.', 'warning');
    });
});

/* --------------------------------------------------------------------------
   12. Contact / Demo Request Modal
   -------------------------------------------------------------------------- */
const contactModalOverlay = document.getElementById('contactModalOverlay');
const successModalOverlay = document.getElementById('successModalOverlay');
const demoForm = document.getElementById('demoForm');
const submitBtn = document.getElementById('submitDemoBtn');

function openModal(overlay) {
    if (!overlay) return;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal(overlay) {
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
}

// Any element with data-action="open-modal" opens the contact modal
document.querySelectorAll('[data-action="open-modal"]').forEach(el => {
    el.addEventListener('click', e => {
        e.preventDefault();
        openModal(contactModalOverlay);
    });
});

document.getElementById('modalCloseBtn')?.addEventListener('click', () => closeModal(contactModalOverlay));
document.getElementById('modalCancelBtn')?.addEventListener('click', () => closeModal(contactModalOverlay));

// Click on the dark overlay (outside the card) also closes it
[contactModalOverlay, successModalOverlay].forEach(overlay => {
    overlay?.addEventListener('click', e => {
        if (e.target === overlay) closeModal(overlay);
    });
});

// Escape key closes whichever modal is open
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        closeModal(contactModalOverlay);
        closeModal(successModalOverlay);
    }
});

/* --------------------------------------------------------------------------
   13. Form validation
   -------------------------------------------------------------------------- */
const fields = {
    fullName: { el: document.getElementById('fullName'), validate: v => v.trim().length >= 2 || 'Please enter your full name.' },
    hospitalName: { el: document.getElementById('hospitalName'), validate: v => v.trim().length >= 2 || 'Please enter your hospital or organization name.' },
    workEmail: {
        el: document.getElementById('workEmail'),
        validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Please enter a valid email address.'
    },
    phone: {
        el: document.getElementById('phone'),
        validate: v => /^[+\d][\d\s-]{7,15}$/.test(v.trim()) || 'Please enter a valid phone number.'
    },
    city: { el: document.getElementById('city'), validate: v => v.trim().length >= 2 || 'Please enter your city.' },
    agreeToContact: {
        el: document.getElementById('agreeToContact'),
        validate: v => v === true || 'Please agree to be contacted to proceed.',
        isCheckbox: true
    },
};

function validateField(key) {
    const field = fields[key];
    const errEl = document.getElementById(`err-${key}`);
    const value = field.isCheckbox ? field.el.checked : field.el.value;
    const result = field.validate(value);

    if (result === true) {
        field.el.classList.remove('invalid');
        if (errEl) errEl.textContent = '';
        return true;
    } else {
        field.el.classList.add('invalid');
        if (errEl) errEl.textContent = result;
        return false;
    }
}

function validateAll(silent = false) {
    let allValid = true;
    Object.keys(fields).forEach(key => {
        const field = fields[key];
        const value = field.isCheckbox ? field.el.checked : field.el.value;
        const result = field.validate(value);
        const valid = result === true;
        if (!valid) allValid = false;

        if (!silent) {
            const errEl = document.getElementById(`err-${key}`);
            field.el.classList.toggle('invalid', !valid);
            if (errEl) errEl.textContent = valid ? '' : result;
        }
    });
    return allValid;
}

function refreshSubmitState() {
    if (submitBtn) submitBtn.disabled = !validateAll(true);
}

Object.keys(fields).forEach(key => {
    const field = fields[key];
    const evt = field.isCheckbox ? 'change' : 'input';
    field.el?.addEventListener(evt, () => {
        validateField(key);
        refreshSubmitState();
    });
    field.el?.addEventListener('blur', () => {
        validateField(key);
    });
});

refreshSubmitState();

/* --------------------------------------------------------------------------
   14. Lead management (localStorage) — will later sync with a real backend
   -------------------------------------------------------------------------- */
const LEADS_KEY = 'caretrack_leads';

function generateReferenceId() {
    const year = new Date().getFullYear();
    const random = Math.floor(10000 + Math.random() * 90000);
    return `CT-${year}-${random}`;
}

function saveLead(data, referenceId) {
    try {
        const existing = JSON.parse(localStorage.getItem(LEADS_KEY) || '[]');
        const now = new Date();
        existing.push({
            leadId: referenceId,
            date: now.toLocaleDateString(),
            time: now.toLocaleTimeString(),
            name: data.fullName,
            hospital: data.hospitalName,
            email: data.workEmail,
            phone: data.phone,
            status: 'New',
        });
        localStorage.setItem(LEADS_KEY, JSON.stringify(existing));
    } catch (err) {
        // localStorage may be unavailable (private browsing, quota, etc.) —
        // fail silently since the email submission is the source of truth.
        console.warn('Could not save lead locally:', err);
    }
}

/* --------------------------------------------------------------------------
   15. Form submission — spam guard, loading state, EmailJS, success modal
   -------------------------------------------------------------------------- */
let isSubmitting = false;
let lastSubmitTime = 0;
const SUBMIT_COOLDOWN_MS = 15000; // basic spam guard between submissions

demoForm?.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (isSubmitting) return;

    if (!validateAll()) {
        showToast('Please fix the highlighted fields before submitting.', 'error');
        return;
    }

    const now = Date.now();
    if (now - lastSubmitTime < SUBMIT_COOLDOWN_MS) {
        showToast("You're submitting too quickly. Please wait a few seconds and try again.", 'warning');
        return;
    }

    const formData = Object.fromEntries(new FormData(demoForm).entries());
    formData.agreeToContact = fields.agreeToContact.el.checked;

    const referenceId = generateReferenceId();

    // --- Loading state ---
    isSubmitting = true;
    submitBtn.disabled = true;
    const btnLabel = submitBtn.querySelector('.btn-label');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');
    const originalLabel = btnLabel.textContent;
    btnLabel.textContent = 'Sending request...';
    btnSpinner.hidden = false;

    const templateParams = {
        name: formData.fullName,
        hospital: formData.hospitalName,
        designation: formData.designation || 'N/A',
        email: formData.workEmail,
        phone: formData.phone,
        city: formData.city,
        country: formData.country || 'N/A',
        hospital_type: formData.hospitalType || 'N/A',
        beds: formData.beds || 'N/A',
        current_software: formData.currentSoftware || 'N/A',
        demo_date: formData.demoDate || 'N/A',
        demo_time: formData.demoTime || 'N/A',
        message: formData.message || 'N/A',
        submission_time: new Date().toString(),
        browser: navigator.userAgent,
        reference_id: referenceId,
        subject: 'New CareTrack Demo Request',
    };

    try {
        if (window.emailjs && CONFIG.emailjs.publicKey !== 'YOUR_PUBLIC_KEY') {
            await emailjs.send(CONFIG.emailjs.serviceId, CONFIG.emailjs.templateId, templateParams);
        } else {
            // EmailJS isn't configured yet — simulate the network delay so the
            // UI/UX (loading state, success modal, etc.) can still be tested.
            await new Promise(resolve => setTimeout(resolve, 1200));
            console.info('EmailJS is not configured yet. Would have sent:', templateParams);
        }

        saveLead(formData, referenceId);
        lastSubmitTime = Date.now();

        document.getElementById('referenceId').textContent = referenceId;
        closeModal(contactModalOverlay);
        openModal(successModalOverlay);
        showToast('Demo request sent successfully!', 'success');

        demoForm.reset();
        Object.values(fields).forEach(f => f.el.classList.remove('invalid'));
    } catch (err) {
        console.error('EmailJS submission failed:', err);
        showToast('Network error — could not send your request. Please try again.', 'error');
    } finally {
        isSubmitting = false;
        btnLabel.textContent = originalLabel;
        btnSpinner.hidden = true;
        refreshSubmitState();
    }
});

/* --------------------------------------------------------------------------
   16. Success modal actions
   -------------------------------------------------------------------------- */
document.getElementById('successCloseBtn')?.addEventListener('click', () => {
    closeModal(successModalOverlay);
});

document.getElementById('bookAnotherBtn')?.addEventListener('click', () => {
    closeModal(successModalOverlay);
    openModal(contactModalOverlay);
});
