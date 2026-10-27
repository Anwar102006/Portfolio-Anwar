/**
 * Shaik Anwar Basha — Portfolio Interactivity Engine
 * Vanilla JavaScript (ES6+) • Zero Bloat • WCAG Accessible
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    initProjectFilter();
    initCaseStudyModal();
    initContactForm();
    initCurrentYear();
});

/* ==========================================================================
   NAVIGATION & SCROLL MANAGEMENT
   ========================================================================== */

function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-links .nav-link');
    const sections = document.querySelectorAll('section[id], main > section[id]');

    // Sticky Navbar Background on Scroll
    const handleScroll = () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // IntersectionObserver for Highlighting Active Nav Link
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '-25% 0px -65% 0px',
            threshold: 0
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentId = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        const href = link.getAttribute('href');
                        if (href === `#${currentId}`) {
                            link.classList.add('active');
                            link.setAttribute('aria-current', 'page');
                        } else {
                            link.classList.remove('active');
                            link.removeAttribute('aria-current');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => sectionObserver.observe(section));
    }

    // Smooth Scrolling with Offset Compensation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    e.preventDefault();
                    const headerOffset = 75;
                    const elementPosition = targetEl.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile drawer if open
                    closeMobileMenu();
                }
            }
        });
    });
}

/* ==========================================================================
   MOBILE MENU DRAWER
   ========================================================================== */

function initMobileMenu() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navLinks = document.querySelector('.nav-links');

    if (!hamburgerBtn || !navLinks) return;

    hamburgerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = hamburgerBtn.classList.contains('active');
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !hamburgerBtn.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMobileMenu();
            hamburgerBtn.focus();
        }
    });
}

function openMobileMenu() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navLinks = document.querySelector('.nav-links');
    if (hamburgerBtn && navLinks) {
        hamburgerBtn.classList.add('active');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
        navLinks.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeMobileMenu() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navLinks = document.querySelector('.nav-links');
    if (hamburgerBtn && navLinks) {
        hamburgerBtn.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/* ==========================================================================
   PROJECT CATEGORY FILTER
   ========================================================================== */

function initProjectFilter() {
    const filterButtons = document.querySelectorAll('.filter-tab, .filter-btn');
    const projectCards = document.querySelectorAll('.project-item, .project-card');

    if (!filterButtons.length || !projectCards.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterValue = button.getAttribute('data-filter');

            // Update button states
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');

            // Filter project cards
            projectCards.forEach(card => {
                const categories = (card.getAttribute('data-category') || '').split(' ');
                
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.style.display = 'flex';
                    requestAnimationFrame(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    });
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(8px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 150);
                }
            });
        });
    });
}

/* ==========================================================================
   PROJECT CASE STUDY MODAL ENGINE
   ========================================================================== */

const PROJECT_DATABASE = {
    careerpulse: {
        title: "CareerPulse — Enterprise Job Tracking & Recruitment Intelligence Platform",
        badge: "Enterprise Full-Stack • ACID Transactions",
        subtitle: "React 19 • Node.js • Express • MongoDB Replica Set • Zod • Recharts • Docker",
        media: '<img src="assets/careerpulse.png" alt="CareerPulse Recruitment Intelligence & Job Application Tracking Dashboard" loading="lazy">',
        problem: "Job seekers managing hundreds of applications across various portals suffer from disorganized spreadsheets, missed interview rounds, double-booking calendar conflicts, lack of visibility into recruitment funnel conversion rates, and insecure platforms vulnerable to Broken Object Level Authorization (BOLA/IDOR) and token theft.",
        stack: ["React 19", "Node.js (ESM)", "Express.js", "MongoDB 7.0 (Replica Set)", "Mongoose", "Zod", "Recharts", "Docker & Compose", "Jest & Vitest", "Swagger (OpenAPI 3.0)"],
        architecture: "Engineered a Clean Layered Architecture with 25 RESTful endpoints, separating transport, domain services, and replica-set persistence. Leverages multi-document ACID transactions (session.startTransaction()) for atomic cascade deletions across parent applications and child interview schedules. Implemented a dual-token authentication model with short-lived in-memory JWTs (100% XSS immune) and opaque rotating refresh tokens (SHA-256 digests in MongoDB with 7-day TTL). Client includes a single-flight mutex refresh coordinator eliminating race conditions on token expiration.",
        highlights: [
            "<strong>Multi-Document ACID Consistency:</strong> Configured MongoDB 7.0 Replica Set transactions to guarantee atomic cascade deletions across applications and nested interview rounds, eliminating orphaned database records.",
            "<strong>In-Memory Token Closure & Anti-Replay Rotation:</strong> Zero storage of JWT access tokens in browser cookies/localStorage (100% XSS immune); opaque 64-byte refresh tokens cycle atomically with server-side SHA-256 hash tracking.",
            "<strong>Double-Booking Prevention Engine:</strong> Formulated MongoDB $expr date arithmetic queries calculating dynamic interview durations to prevent overlapping candidate interviews with sub-millisecond conflict detection.",
            "<strong>$facet Real-Time Funnel Analytics:</strong> Consolidated 4 distinct analytical queries into a single aggregation pipeline, delivering 4x query efficiency for recruitment funnels and zero-backfilled 6-month trendlines.",
            "<strong>Hardened API Security & IDOR Defense:</strong> Built custom recursive NoSQL injection shields that preserve valid currency strings ($120k), paired with strict Zod validation, dual-tier rate limiters, and anti-enumeration 404 responses."
        ],
        disclaimer: "Status: Production-grade enterprise reference architecture with 25 REST endpoints, OpenAPI 3.0.3 Swagger documentation, and automated CI/CD container orchestration.",
        actions: [
            { text: "View GitHub Repository", class: "btn-primary", url: "https://github.com/Anwar102006/job-application-tracker-api", icon: "fab fa-github" },
            { text: "Close Details", class: "btn-secondary", action: "close" }
        ]
    },
    truthlens: {
        title: "TruthLens — AI-Powered Misinformation Detection System",
        badge: "Matrix Hackathon 1st Place Winner",
        subtitle: "Natural Language Processing • Fact Verification • Web Intelligence",
        media: '<img src="assets/TruthLens.jpg" alt="TruthLens AI Misinformation Detection Dashboard" loading="lazy">',
        problem: "Online information ecosystems suffer from high volumes of unverified claims, fabricated narratives, and synthetic content. Users lack accessible, rapid-turnaround tools to verify claim authenticity before recirculating digital content.",
        stack: ["Python", "Natural Language Processing (NLP)", "RESTful APIs", "JavaScript", "Information Retrieval"],
        architecture: "Engineered a modular pipeline that accepts textual claims, preprocesses linguistic tokens, evaluates source reliability indices, and generates a composite truthfulness confidence score with explanatory notes.",
        highlights: [
            "<strong>1st Place Award:</strong> Selected as the winning project at the Matrix Hackathon out of multi-institutional developer teams.",
            "<strong>Rapid Assessment Logic:</strong> Designed claim validation heuristic algorithms capable of parsing text claims and identifying synthetic indicators.",
            "<strong>Recruiter Review Note:</strong> Pitched and demonstrated live before hackathon judges; architecture designed for future scaling with transformer LLM verification nodes."
        ],
        disclaimer: "Status: Hackathon award-winning prototype. Codebase demonstrated live during Matrix Hackathon 2024–2025.",
        actions: [
            { text: "View GitHub Repository", class: "btn-primary", url: "https://github.com/Anwar102006/HACKATHON_MATRIX", icon: "fab fa-github" },
            { text: "Close Details", class: "btn-secondary", action: "close" }
        ]
    },
    urbanguard: {
        title: "UrbanGuard — Real-Time Localized Edge AI Violence Detection System",
        badge: "Edge AI & Multimodal Computer Vision",
        subtitle: "Node.js • Express • Ollama (LLaVA) • Edge Computing • Sub-Second Analytics",
        media: '<img src="assets/urbangaurd.png" alt="UrbanGuard Real-Time Local AI Violence Detection Dashboard" loading="lazy">',
        problem: "Traditional municipal surveillance relies on manual monitoring of CCTV feeds, resulting in delayed emergency response. Sending continuous high-definition video feeds to cloud vision APIs causes severe privacy violations, bandwidth congestion, and high operational subscription costs.",
        stack: ["Node.js", "Express.js", "Ollama (LLaVA)", "Multimodal Computer Vision", "Multer", "PowerShell Automation", "JavaScript (ES6+)", "REST APIs"],
        architecture: "Engineered an air-gapped, on-premise surveillance architecture coupling an asynchronous Node.js/Express API gateway with a locally hosted LLaVA multimodal vision model via Ollama. Built a dual-pipeline processing workflow with multipart file streaming, strict MIME validation, low-temperature prompt tuning (0.2), and a resilient regex/keyword heuristic fallback parser to ensure 100% availability during unexpected AI outputs.",
        highlights: [
            "<strong>100% On-Premise Privacy & $0 API Cost:</strong> Deployed multimodal vision models locally on edge hardware via Ollama, preventing surveillance video leaks and completely eliminating recurring cloud vision API fees.",
            "<strong>Sub-Second Threat Recognition:</strong> Continuously evaluates visual feeds to detect combative body postures, physical altercations, and weapons, assigning threat levels (None/Low/Medium/High) and confidence metrics in sub-second response times.",
            "<strong>Two-Stage Fault-Tolerant Fallback:</strong> Designed an intelligent regex and keyword-matching parser that intercepts conversational LLM tokens and standardizes outputs into strict JSON schemas, alongside a simulation mode guaranteeing zero downtime during demos.",
            "<strong>Defensive Edge Engineering:</strong> Implemented secure Multer file ingestion with regex type filters and 50MB payload limits, paired with custom PowerShell scripts to route 4.1GB model weights to secondary storage partitions."
        ],
        disclaimer: "Status: Production-grade edge AI prototype and developer sandbox. Fully functional with local Ollama LLaVA runtime.",
        actions: [
            { text: "View GitHub Repository", class: "btn-primary", url: "https://github.com/Anwar102006/UrbanGuard", icon: "fab fa-github" },
            { text: "Close Details", class: "btn-secondary", action: "close" }
        ]
    },
    smartmeal: {
        title: "SmartMeal — Interactive Meal Planning Web App",
        badge: "Virtunexa Internship Flagship",
        subtitle: "Vite.js • Client Persistence • Algorithm-Driven Grocery List Generation",
        media: '<img src="assets/Meal_Planner.jpg" alt="SmartMeal Interface" loading="lazy">',
        problem: "Students and professionals face recurring friction organizing weekly meals, balancing dietary restrictions, and manually compiling fragmented grocery checklists.",
        stack: ["JavaScript (ES6+)", "Vite.js", "LocalStorage API", "HTML5", "CSS3 Grid"],
        architecture: "Engineered during Anwar's Web Developer Internship at Virtunexa. Built with a decoupled component design, reactive state handling for recipe selection, persistent client storage via LocalStorage, and a consolidated shopping list compiler.",
        highlights: [
            "<strong>Served 150+ Weekly Users:</strong> Deployed in production testing, supporting over 150 active weekly user planning sessions.",
            "<strong>40% Planning Time Reduction:</strong> Automated grocery checklist derivation directly from chosen recipes, cutting manual planning effort by ~40%.",
            "<strong>Zero-Latency Persistence:</strong> Implemented robust LocalStorage schema with error handling for offline continuity."
        ],
        actions: [
            { text: "View GitHub Repository", class: "btn-primary", url: "https://github.com/Anwar102006/Meal_Planner", icon: "fab fa-github" },
            { text: "Close", class: "btn-secondary", action: "close" }
        ]
    },
    beatbox: {
        title: "BeatBox — High-Performance Music Streaming Web App",
        badge: "CodeAlpha Internship Flagship",
        subtitle: "Web Audio API • Streaming Optimization • Cross-Browser Engineering",
        media: '<img src="assets/MUSIC.jpg" alt="BeatBox Music Player Interface" loading="lazy">',
        problem: "Web-based media players frequently encounter audio streaming lag, inconsistent cross-browser codec rendering, and cumbersome playback state management on mobile devices.",
        stack: ["JavaScript (ES6+)", "HTML5 Audio API", "Spotify & Pandora APIs", "CSS3 Glassmorphism", "Performance Profiling"],
        architecture: "Engineered during Anwar's Frontend Developer Internship at CodeAlpha. Implemented custom audio buffer management, dynamic track metadata extraction, interactive seek controls, and resilient API fallback handling.",
        highlights: [
            "<strong>Sub-75ms Latency:</strong> Integrated streaming endpoints from Spotify and Pandora APIs, achieving average audio initiation latency under 75ms.",
            "<strong>20% Load Time Optimization:</strong> Refactored DOM layout trees and optimized script execution sequences, cutting initial asset load time by 20%.",
            "<strong>500+ Daily Active User Simulation:</strong> Validated UI responsiveness and memory consumption across sustained multi-track playback cycles."
        ],
        actions: [
            { text: "View GitHub Repository", class: "btn-primary", url: "https://github.com/Anwar102006/Music_Player_UI", icon: "fab fa-github" },
            { text: "Close", class: "btn-secondary", action: "close" }
        ]
    },
    fooddash: {
        title: "FoodDash — Food Delivery Web App Prototype",
        badge: "Frontend Architecture Prototype",
        subtitle: "React.js • Dynamic Cart State • Modern Delivery Interface",
        media: '<img src="assets/FoodDash.jpg" alt="FoodDash Prototype" loading="lazy">',
        problem: "Delivery applications require clear visual hierarchy, frictionless item customization, and predictable cart calculations across diverse viewport sizes.",
        stack: ["React.js", "JavaScript (ES6+)", "HTML5", "CSS3 Flexbox/Grid", "Node.js Architecture Readiness"],
        architecture: "Component-driven frontend prototype featuring categorized food catalogs, interactive modal order customization, real-time total calculations, and an interactive tracking timeline.",
        highlights: [
            "<strong>Modular Component Architecture:</strong> Structured for drop-in REST API integration with Node.js/Express backends.",
            "<strong>Fluid Mobile Ergonomics:</strong> Tuned touch targets and thumb-zone navigation for seamless food ordering."
        ],
        actions: [
            { text: "View GitHub Repository", class: "btn-primary", url: "https://github.com/Anwar102006/Food_Dash", icon: "fab fa-github" },
            { text: "Close", class: "btn-secondary", action: "close" }
        ]
    },
    ecomstore: {
        title: "EcomStore — Modular E-Commerce Web App",
        badge: "E-Commerce Architecture",
        subtitle: "Django Architecture Readiness • Tailwind CSS • Responsive Storefront",
        media: '<img src="assets/EcomStore.jpg" alt="EcomStore Interface" loading="lazy">',
        problem: "Designing clean product browsing, search filtering, and shopping cart flows that gracefully scale from frontend prototypes into full-stack backend integrations.",
        stack: ["Django", "HTML5", "Tailwind CSS", "JavaScript"],
        architecture: "Multi-page e-commerce template demonstrating structured product catalog cards, responsive filter sidebars, shopping cart badges, and checkout form layouts.",
        highlights: [
            "<strong>Scalable Data Models:</strong> Structured to map seamlessly to Django ORM product and order models.",
            "<strong>Tailwind Utility Design:</strong> Clean utility styling ensuring rapid rendering and minimal CSS footprint."
        ],
        actions: [
            { text: "View GitHub Repository", class: "btn-primary", url: "https://github.com/Anwar102006/EcomStore", icon: "fab fa-github" },
            { text: "Close", class: "btn-secondary", action: "close" }
        ]
    },
    powerbi: {
        title: "Enterprise Power BI Business Intelligence Dashboards",
        badge: "Data Visualization & Analytics",
        subtitle: "DAX Expressions • Multi-Dimensional Data Modeling • Business Insights",
        media: '<img src="assets/POWERBI.jpg" alt="Power BI Dashboards" loading="lazy">',
        problem: "Raw transactional business data is often siloed, making it difficult for stakeholders to evaluate regional performance, sales shifts, and demand bottlenecks.",
        stack: ["Power BI", "DAX Formulas", "Data Modeling", "Business Intelligence"],
        architecture: "Built interactive reporting dashboards aggregating multi-region business datasets. Configured relational data tables, calculated columns via DAX, and dynamic cross-filtering visuals.",
        highlights: [
            "<strong>Geographical Revenue Mapping:</strong> Interactive map charts displaying territory-by-territory earnings and sales density.",
            "<strong>KPI Variance Tracking:</strong> Automated calculation of monthly target fulfillment, regional margins, and product demand trends."
        ],
        actions: [
            { text: "View Dashboard Repository", class: "btn-primary", url: "https://github.com/Anwar102006/PowerBI_Dashboards", icon: "fab fa-github" },
            { text: "Close", class: "btn-secondary", action: "close" }
        ]
    },
    clitask: {
        title: "Python CLI Task Management Engine",
        badge: "Systems & Python CLI",
        subtitle: "Persistent File I/O • Terminal User Experience • Defensive Programming",
        media: '<img src="assets/CLI_TASK_MANAGER.jpg" alt="CLI Task Manager" loading="lazy">',
        problem: "Developers and terminal power-users often prefer lightweight, keyboard-driven productivity tools that operate without browser overhead or heavy dependencies.",
        stack: ["Python 3", "File I/O Handling", "CLI Menu Architecture", "Defensive Validation"],
        architecture: "Console-based CRUD engine implementing modular functions for task creation, status updates, priority sorting, and persistent serialized text/JSON storage.",
        highlights: [
            "<strong>Zero Third-Party Dependency:</strong> Built purely with Python standard libraries for maximum portability.",
            "<strong>Defensive Error Trapping:</strong> Gracefully catches malformed user inputs and missing data files without crash states."
        ],
        actions: [
            { text: "View Python Code", class: "btn-primary", url: "https://github.com/Anwar102006/Task_Manager", icon: "fab fa-github" },
            { text: "Close", class: "btn-secondary", action: "close" }
        ]
    },
    arvr: {
        title: "AR/VR Spatial Product Showcase Landing Page",
        badge: "Modern UI/UX Showcase",
        subtitle: "React.js • Tailwind CSS • Vite • Spatial Visual Aesthetics",
        media: '<img src="assets/AR_VR_LANDING_PAGE.jpg" alt="AR VR Landing Page" loading="lazy">',
        problem: "Emerging spatial hardware and immersive technologies require forward-looking visual design that conveys high technology and depth.",
        stack: ["React.js", "Tailwind CSS", "Vite", "Modern Glassmorphism"],
        architecture: "Responsive product landing page featuring dark mode glassmorphism panels, futuristic typography, and reactive interactive cards.",
        highlights: [
            "<strong>Vite Build Optimization:</strong> Rapid sub-second HMR and lightweight bundle delivery.",
            "<strong>Modern Visual Polish:</strong> Subtle glowing gradients, modern badges, and responsive layouts."
        ],
        actions: [
            { text: "View GitHub Repository", class: "btn-primary", url: "https://github.com/Anwar102006/AR_VR_LANDING_PAGE", icon: "fab fa-github" },
            { text: "Close", class: "btn-secondary", action: "close" }
        ]
    }
};

function initCaseStudyModal() {
    const modal = document.getElementById('case-study-modal');
    const closeBtn = document.getElementById('modal-close-btn');
    const openButtons = document.querySelectorAll('.open-case-study');

    if (!modal) return;

    const modalBadge = document.getElementById('modal-badge');
    const modalTitle = document.getElementById('modal-title');
    const modalSubtitle = document.getElementById('modal-subtitle');
    const modalMedia = document.getElementById('modal-media-preview');
    const modalProblem = document.getElementById('modal-problem');
    const modalTechStack = document.getElementById('modal-tech-stack');
    const modalArchitecture = document.getElementById('modal-architecture');
    const modalHighlights = document.getElementById('modal-highlights');
    const modalDisclaimerBlock = document.getElementById('modal-disclaimer-block');
    const modalDisclaimer = document.getElementById('modal-disclaimer');
    const modalFooterActions = document.getElementById('modal-footer-actions');

    const openModal = (projectId) => {
        const data = PROJECT_DATABASE[projectId];
        if (!data) return;

        modalBadge.textContent = data.badge || "Project Case Study";
        modalTitle.textContent = data.title;
        modalSubtitle.textContent = data.subtitle;
        modalMedia.innerHTML = data.media;
        modalProblem.textContent = data.problem;
        modalArchitecture.textContent = data.architecture;

        // Render Tech Stack
        modalTechStack.innerHTML = data.stack.map(tech => `<span>${tech}</span>`).join('');

        // Render Highlights
        modalHighlights.innerHTML = data.highlights.map(item => `<li>${item}</li>`).join('');

        // Render Disclaimer if exists
        if (data.disclaimer) {
            modalDisclaimerBlock.style.display = 'block';
            modalDisclaimer.textContent = data.disclaimer;
        } else {
            modalDisclaimerBlock.style.display = 'none';
        }

        // Render Actions
        modalFooterActions.innerHTML = '';
        data.actions.forEach(act => {
            if (act.action === 'close') {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = `btn btn-sm ${act.class || 'btn-secondary'}`;
                btn.textContent = act.text;
                btn.addEventListener('click', closeModal);
                modalFooterActions.appendChild(btn);
            } else if (act.url) {
                const link = document.createElement('a');
                link.href = act.url;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.className = `btn btn-sm ${act.class || 'btn-primary'}`;
                link.innerHTML = `${act.icon ? `<i class="${act.icon}"></i>` : ''} <span>${act.text}</span>`;
                modalFooterActions.appendChild(link);
            }
        });

        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // Focus close button for keyboard accessibility
        closeBtn.focus();
    };

    const closeModal = () => {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    openButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const projectId = btn.getAttribute('data-project');
            openModal(projectId);
        });
    });

    closeBtn.addEventListener('click', closeModal);

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });
}

/* ==========================================================================
   CONTACT FORM (ASYNCHRONOUS FORMSPREE SUBMISSION)
   ========================================================================== */

function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const statusAlert = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');

    if (!contactForm) return;

    const fields = {
        name: {
            input: document.getElementById('name'),
            error: document.getElementById('name-error'),
            validate: (val) => val.trim().length >= 2 ? '' : 'Please enter your name (minimum 2 characters).'
        },
        email: {
            input: document.getElementById('email'),
            error: document.getElementById('email-error'),
            validate: (val) => {
                if (!val.trim()) return 'Email address is required.';
                const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return regex.test(val) ? '' : 'Please enter a valid email address.';
            }
        },
        subject: {
            input: document.getElementById('subject'),
            error: document.getElementById('subject-error'),
            validate: (val) => val.trim().length >= 3 ? '' : 'Subject is required (minimum 3 characters).'
        },
        message: {
            input: document.getElementById('message'),
            error: document.getElementById('message-error'),
            validate: (val) => val.trim().length >= 10 ? '' : 'Please write a message of at least 10 characters.'
        }
    };

    // Clear field error on input
    Object.values(fields).forEach(field => {
        field.input.addEventListener('input', () => {
            field.input.classList.remove('is-invalid');
            field.error.textContent = '';
        });
    });

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validate all fields
        let hasErrors = false;
        Object.values(fields).forEach(field => {
            const errorMsg = field.validate(field.input.value);
            if (errorMsg) {
                field.input.classList.add('is-invalid');
                field.error.textContent = errorMsg;
                if (!hasErrors) {
                    field.input.focus(); // Focus first invalid field
                }
                hasErrors = true;
            } else {
                field.input.classList.remove('is-invalid');
                field.error.textContent = '';
            }
        });

        if (hasErrors) {
            statusAlert.style.display = 'block';
            statusAlert.className = 'form-status-alert error';
            statusAlert.innerHTML = '<i class="fas fa-triangle-exclamation"></i> Please review and correct the highlighted fields.';
            return;
        }

        // Submitting State
        submitBtn.disabled = true;
        const originalBtnHtml = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> <span>Sending message...</span>';
        statusAlert.style.display = 'none';

        try {
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Success: display in-page confirmation banner
                statusAlert.style.display = 'block';
                statusAlert.className = 'form-status-alert success';
                statusAlert.innerHTML = '<i class="fas fa-circle-check"></i> <strong>Message sent successfully!</strong> Thank you for reaching out, Anwar will review your message and reply promptly.';
                
                contactForm.reset();
                submitBtn.innerHTML = '<i class="fas fa-check"></i> <span>Sent!</span>';
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnHtml;
                }, 4000);
            } else {
                const data = await response.json();
                throw new Error(data.error || 'Server rejected submission');
            }
        } catch (err) {
            console.error('Contact Form Submission Error:', err);
            // Show graceful fallback error message
            statusAlert.style.display = 'block';
            statusAlert.className = 'form-status-alert error';
            statusAlert.innerHTML = '<i class="fas fa-circle-exclamation"></i> We could not submit your message asynchronously. You can email directly at <a href="mailto:shaikanwar6306@gmail.com" style="text-decoration:underline;">shaikanwar6306@gmail.com</a>, or click here to <a href="#" id="native-submit-fallback" style="text-decoration:underline;">send via standard delivery</a>.';
            
            document.getElementById('native-submit-fallback')?.addEventListener('click', (fallbackEvent) => {
                fallbackEvent.preventDefault();
                contactForm.submit(); // Standard form submission fallback
            });

            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHtml;
        }
    });
}

/* ==========================================================================
   DYNAMIC YEAR IN FOOTER
   ========================================================================== */

function initCurrentYear() {
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}