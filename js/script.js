// ============================================================
// LIVINKEY FRONTEND - BACKEND API CONNECTION
// ============================================================

const API_BASE = 'https://livinkey-backend-e15s.onrender.com/api';

// ============================================================
// API HELPER FUNCTIONS
// ============================================================

async function apiFetch(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `API Error: ${response.status}`);
        }

        return data;
    } catch (error) {
        // Keep this for production error tracking
        console.error(`API Fetch Error [${endpoint}]:`, error);
        throw error;
    }
}

// ============================================================
// CACHE MANAGEMENT
// ============================================================

const CACHE = {
    pgs: null,
    pgDetails: {},
    stats: null,
    welcome: null,
    lastFetch: {},
    TTL: 60000,
};

function isCacheValid(key) {
    if (!CACHE.lastFetch[key]) return false;
    return Date.now() - CACHE.lastFetch[key] < CACHE.TTL;
}

function getCached(key) {
    if (isCacheValid(key)) {
        return CACHE[key];
    }
    return null;
}

function setCache(key, data) {
    CACHE[key] = data;
    CACHE.lastFetch[key] = Date.now();
}

// ============================================================
// API FUNCTIONS
// ============================================================

async function fetchWelcomeMessage() {
    const cached = getCached('welcome');
    if (cached) return cached;

    const result = await apiFetch('/public/welcome');
    const data = result.data || result;
    setCache('welcome', data);
    return data;
}

async function fetchPGStats() {
    const cached = getCached('stats');
    if (cached) return cached;

    const result = await apiFetch('/public/pgs/stats');
    const data = result.data || result;
    setCache('stats', data);
    return data;
}

async function fetchAllPGs(filters = {}) {
    const cacheKey = 'pgs';
    const cached = getCached(cacheKey);
    if (cached && Object.keys(filters).length === 0) {
        return cached;
    }

    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.min_rent) params.append('min_rent', filters.min_rent);
    if (filters.max_rent) params.append('max_rent', filters.max_rent);
    if (filters.amenities) params.append('amenities', filters.amenities);
    if (filters.status) params.append('status', filters.status);
    if (filters.min_rating) params.append('min_rating', filters.min_rating);

    const queryString = params.toString();
    const endpoint = `/public/pgs${queryString ? '?' + queryString : ''}`;

    const result = await apiFetch(endpoint);
    const data = result.data || result || [];

    const pgsArray = Array.isArray(data) ? data : [];

    if (Object.keys(filters).length === 0) {
        setCache(cacheKey, pgsArray);
    }

    return pgsArray;
}

async function fetchPGDetails(pgId) {
    const cacheKey = `pg_${pgId}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    const result = await apiFetch(`/public/pgs/${pgId}`);
    const data = result.data || result;
    setCache(cacheKey, data);
    return data;
}

// ============================================================
// HELPER: Extract Amenities as Strings
// ============================================================

function extractAmenities(pg) {
    let amenities = [];
    
    if (Array.isArray(pg.amenities)) {
        amenities = pg.amenities.map(a => {
            if (typeof a === 'string') return a;
            if (a && typeof a === 'object') {
                return a.amenity_name || a.name || a.label || Object.values(a)[0] || '';
            }
            return String(a);
        }).filter(a => a && a.length > 0);
    }
    
    if (amenities.length === 0 && Array.isArray(pg.amenity_names)) {
        amenities = pg.amenity_names.filter(a => a && a.length > 0);
    }
    
    if (amenities.length === 0 && typeof pg.amenities === 'string') {
        amenities = pg.amenities.split(',').map(a => a.trim()).filter(a => a.length > 0);
    }
    
    if (amenities.length === 0 && typeof pg.amenity_names === 'string') {
        amenities = pg.amenity_names.split(',').map(a => a.trim()).filter(a => a.length > 0);
    }
    
    return amenities;
}

// ============================================================
// RENDER FUNCTIONS
// ============================================================

function getStatusClass(status) {
    const statusMap = {
        'Vacant': 'status-vacant',
        'vacant': 'status-vacant',
        'Partially Occupied': 'status-partial',
        'partial_occupied': 'status-partial',
        'partially': 'status-partial',
        'Full Occupied': 'status-full',
        'full_occupied': 'status-full',
        'full': 'status-full',
    };
    return statusMap[status] || 'status-vacant';
}

function getStatusText(status) {
    const statusMap = {
        'Vacant': 'Vacant',
        'vacant': 'Vacant',
        'Partially Occupied': 'Partially Occupied',
        'partial_occupied': 'Partially Occupied',
        'partially': 'Partially Occupied',
        'Full Occupied': 'Full Occupied',
        'full_occupied': 'Full Occupied',
        'full': 'Full Occupied',
    };
    return statusMap[status] || status || 'Vacant';
}

function renderPGCards(pgs, containerId, clickable = true) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const pgsArray = Array.isArray(pgs) ? pgs : [];

    if (pgsArray.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-house-x fs-1" style="color: var(--line-strong);"></i>
                <p class="mt-3 fw-semibold" style="color: var(--ink-soft);">No PGs match your filters. Try widening your search.</p>
            </div>`;
        return;
    }

    container.innerHTML = '';

    pgsArray.forEach((pg, index) => {
        const statusText = pg.status_text || 'Vacant';
        const statusClass = getStatusClass(statusText);

        const coverImage = pg.cover_image || pg.images?.[0] || 'https://placehold.co/600x400/92C24A/FFFFFF?text=No+Image';

        const rating = parseFloat(pg.overall_rating) || 0;
        const ratingDisplay = rating > 0 ? rating.toFixed(1) : 'New';

        const col = document.createElement('div');
        col.className = 'col-lg-3 col-md-4 col-sm-6 reveal';
        col.style.transitionDelay = `${Math.min(index, 8) * 0.06}s`;
        col.innerHTML = `
            <div class="pg-card" data-id="${pg.id}" role="button" tabindex="0" aria-label="View details for ${pg.name}">
                <div class="pg-card-img-wrap">
                    <img src="${coverImage}" class="pg-card-img" alt="${pg.name}" loading="lazy" onerror="this.src='https://placehold.co/600x400/92C24A/FFFFFF?text=No+Image'">
                </div>
                <div class="p-3">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="fw-bold mb-0">${pg.name || 'Unnamed PG'}</h5>
                        <span class="rating-badge">${ratingDisplay}</span>
                    </div>
                    <p class="small text-muted mb-2"><i class="bi bi-geo-alt"></i> ${pg.location || 'Location TBD'}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="pg-status ${statusClass}">${getStatusText(statusText)}</span>
                        <span class="fw-bold text-success">₹${(pg.rent || 0).toLocaleString('en-IN')}/mo</span>
                    </div>
                    <div class="mt-2 small">
                        <span>🛏 ${pg.total_rooms || 0} rooms</span>
                        <span class="ms-2">👤 ${(pg.total_capacity || 0) - (pg.total_occupied || 0)} available</span>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(col);
    });

    if (clickable) {
        document.querySelectorAll('.pg-card').forEach(card => {
            card.addEventListener('click', function () {
                const id = parseInt(this.dataset.id);
                openDetailModal(id);
            });
            card.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const id = parseInt(this.dataset.id);
                    openDetailModal(id);
                }
            });
        });
    }

    observeReveals();
}

// ============================================================
// DETAIL MODAL
// ============================================================

async function openDetailModal(pgIdOrData) {
    let pg;

    if (typeof pgIdOrData === 'number') {
        try {
            pg = await fetchPGDetails(pgIdOrData);
        } catch {
            const cached = getCached('pgs');
            if (cached) {
                pg = cached.find(p => p.id === pgIdOrData);
            }
            if (!pg) {
                alert('Failed to load PG details. Please try again.');
                return;
            }
        }
    } else {
        pg = pgIdOrData;
    }

    const modal = document.getElementById('pgDetailModal');
    if (!modal) {
        window.location.href = `pgs.html?pg=${pg.id}`;
        return;
    }

    document.getElementById('detailPgName').textContent = pg.name || 'PG Name';
    document.getElementById('detailLocation').textContent = pg.location || 'Location TBD';
    document.getElementById('detailRent').textContent = (pg.rent || 0).toLocaleString('en-IN');
    document.getElementById('detailRooms').textContent = pg.total_rooms || 0;
    const available = (pg.total_capacity || 0) - (pg.total_occupied || 0);
    document.getElementById('detailAvailable').textContent = available;

    const amenitiesList = extractAmenities(pg);
    const amenitiesDisplay = amenitiesList.length > 0 
        ? amenitiesList.join(', ')
        : 'None specified';
    document.getElementById('detailAmenities').textContent = amenitiesDisplay;

    const reviewsContainer = document.getElementById('detailReviews');
    reviewsContainer.innerHTML = '';
    const reviews = pg.reviews || [];
    if (reviews.length === 0) {
        reviewsContainer.innerHTML = '<p class="text-muted small">No reviews yet. Be the first to review!</p>';
    } else {
        reviews.forEach(review => {
            const name = review.name || review.tenant_name || 'Anonymous';
            const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
            const div = document.createElement('div');
            div.className = 'review-card';
            div.innerHTML = `
                <div class="review-avatar">${initials}</div>
                <div>
                    <strong>${name}</strong>
                    ${review.rating ? `<span class="text-success ms-1">★ ${review.rating}</span>` : ''}
                    <br>
                    <small>${review.comment || 'No comment provided.'}</small>
                </div>
            `;
            reviewsContainer.appendChild(div);
        });
    }

    const images = pg.images || [];
    const carouselInner = document.getElementById('detailCarouselInner');
    carouselInner.innerHTML = '';

    if (images.length === 0) {
        carouselInner.innerHTML = `
            <div class="carousel-item active">
                <img src="https://placehold.co/800x400/92C24A/FFFFFF?text=No+Images" class="d-block w-100" style="height: 350px; object-fit: cover;" alt="No images">
            </div>`;
    } else {
        images.forEach((img, index) => {
            const div = document.createElement('div');
            div.className = `carousel-item ${index === 0 ? 'active' : ''}`;
            div.innerHTML = `<img src="${img}" class="d-block w-100" style="height: 350px; object-fit: cover;" alt="${pg.name}" onerror="this.src='https://placehold.co/800x400/92C24A/FFFFFF?text=Image+Not+Found'">`;
            carouselInner.appendChild(div);
        });
    }

    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
}

// ============================================================
// SEARCH & FILTER
// ============================================================

function buildFiltersFromUI() {
    const filters = {};
    const searchInput = document.getElementById('searchInput');
    const amenityFilter = document.getElementById('amenityFilter');
    const occupancyFilter = document.getElementById('occupancyFilter');

    if (searchInput && searchInput.value.trim()) {
        filters.search = searchInput.value.trim();
    }

    if (amenityFilter && amenityFilter.value !== 'all') {
        filters.amenities = amenityFilter.value;
    }

    if (occupancyFilter && occupancyFilter.value !== 'all') {
        const statusMap = {
            'vacant': 'vacant',
            'partially': 'partial_occupied',
            'full': 'full_occupied',
        };
        filters.status = statusMap[occupancyFilter.value] || occupancyFilter.value;
    }

    return filters;
}

async function filterPGs() {
    const searchBtn = document.getElementById('searchBtn');
    setButtonLoading(searchBtn, true);

    try {
        const filters = buildFiltersFromUI();
        const pgs = await fetchAllPGs(filters);
        renderPGCards(pgs, 'pgCardContainer');
    } catch {
        const container = document.getElementById('pgCardContainer');
        if (container) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="bi bi-exclamation-triangle fs-1" style="color: #e74c3c;"></i>
                    <p class="mt-3 fw-semibold" style="color: var(--ink-soft);">Failed to load PGs. Please try again.</p>
                    <button class="btn btn-primary rounded-pill mt-3" onclick="filterPGs()">Retry</button>
                </div>`;
        }
    } finally {
        setButtonLoading(searchBtn, false);
    }
}

// ============================================================
// HELP FORM
// ============================================================

function initHelpForm() {
    const form = document.getElementById('helpForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const submitBtn = document.getElementById('helpFormSubmit');
        setButtonLoading(submitBtn, true);

        const name = document.getElementById('helpName').value;
        const phone = document.getElementById('helpPhone').value;
        const message = document.getElementById('helpMessage').value;

        const whatsappMsg = `Hi LIVINKEY!%0A%0AName: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0AMessage: ${encodeURIComponent(message)}`;

        setTimeout(() => {
            window.open(`https://wa.me/919878383497?text=${whatsappMsg}`, '_blank');
            setButtonLoading(submitBtn, false);
        }, 500);
    });
}

// ============================================================
// BUTTON LOADING STATE
// ============================================================

function setButtonLoading(btn, isLoading) {
    if (!btn) return;
    if (isLoading) {
        btn.classList.add('is-loading');
        btn.disabled = true;
    } else {
        btn.classList.remove('is-loading');
        btn.disabled = false;
    }
}

function wrapButtonLabel(btn) {
    if (!btn || btn.querySelector('.btn-label')) return;
    const span = document.createElement('span');
    span.className = 'btn-label';
    span.innerHTML = btn.innerHTML;
    btn.innerHTML = '';
    btn.appendChild(span);
}

// ============================================================
// SCROLL REVEAL
// ============================================================

let revealObserver;

function observeReveals() {
    if (!('IntersectionObserver' in window)) {
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
        return;
    }
    if (!revealObserver) {
        revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    }
    document.querySelectorAll('.reveal:not(.is-visible)').forEach(el => revealObserver.observe(el));
}

// ============================================================
// COUNT-UP ANIMATION
// ============================================================

function animateCounters() {
    const counters = document.querySelectorAll('[data-count-to]');
    if (!counters.length) return;

    const runCounter = (el) => {
        const target = parseInt(el.dataset.countTo, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1200;
        const start = performance.now();

        function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    };

    if (!('IntersectionObserver' in window)) {
        counters.forEach(runCounter);
        return;
    }
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                runCounter(entry.target);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(el => obs.observe(el));
}

// ============================================================
// NAVBAR SCROLL SHADOW
// ============================================================

function initNavbarScroll() {
    const nav = document.querySelector('.navbar');
    if (!nav) return;
    const onScroll = () => {
        nav.classList.toggle('scrolled', window.scrollY > 12);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

// ============================================================
// CHATBOT
// ============================================================

function initChatbot() {
    const container = document.getElementById('chatbot-container');
    if (!container) return;

    container.innerHTML = `
        <div class="chatbot-toggle" id="chatToggle" aria-label="Open chat assistant">
            <div class="key-icon-container">
                <svg class="animated-key" viewBox="0 0 100 100" width="32" height="32" aria-hidden="true">
                    <defs>
                        <linearGradient id="keyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#92C24A;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#5E8A2E;stop-opacity:1" />
                        </linearGradient>
                        <filter id="keyGlow">
                            <feGaussianBlur stdDeviation="2" result="blur"/>
                            <feMerge>
                                <feMergeNode in="blur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>
                    <circle cx="40" cy="35" r="22" fill="none" stroke="url(#keyGradient)" stroke-width="6" filter="url(#keyGlow)"/>
                    <rect x="36" y="48" width="6" height="28" rx="3" fill="url(#keyGradient)" filter="url(#keyGlow)"/>
                    <rect x="36" y="62" width="18" height="5" rx="2" fill="url(#keyGradient)" filter="url(#keyGlow)"/>
                    <rect x="36" y="70" width="14" height="5" rx="2" fill="url(#keyGradient)" filter="url(#keyGlow)"/>
                    <circle cx="32" cy="28" r="3" fill="white" opacity="0.6">
                        <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="45" cy="25" r="2" fill="white" opacity="0.4">
                        <animate attributeName="opacity" values="0.4;0.05;0.4" dur="2.5s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="40" cy="40" r="30" fill="none" stroke="rgba(146,194,74,0.15)" stroke-width="1.5" stroke-dasharray="4 6">
                        <animateTransform attributeName="transform" type="rotate" from="0 40 40" to="360 40 40" dur="8s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(146,194,74,0.08)" stroke-width="1" stroke-dasharray="3 8">
                        <animateTransform attributeName="transform" type="rotate" from="360 40 40" to="0 40 40" dur="12s" repeatCount="indefinite"/>
                    </circle>
                </svg>
                <span class="key-glow-ring"></span>
            </div>
            <span class="chatbot-badge">💬</span>
        </div>
        <div class="chatbot-window" id="chatWindow" role="dialog" aria-label="Chat assistant">
            <div class="chatbot-header">
                <div class="chatbot-header-content">
                    <div class="header-key-icon" aria-hidden="true">
                        <svg viewBox="0 0 100 100" width="28" height="28">
                            <circle cx="40" cy="35" r="18" fill="none" stroke="#92C24A" stroke-width="5"/>
                            <rect x="36" y="46" width="6" height="24" rx="3" fill="#92C24A"/>
                            <rect x="36" y="58" width="15" height="4" rx="2" fill="#92C24A"/>
                            <rect x="36" y="65" width="12" height="4" rx="2" fill="#92C24A"/>
                        </svg>
                    </div>
                    <div>
                        <h6 class="mb-0 fw-bold">LIVINKEY Assistant</h6>
                        <small class="text-muted">Online · Ready to help</small>
                    </div>
                </div>
                <button class="chatbot-close" id="chatClose" aria-label="Close chat"><i class="bi bi-x-lg"></i></button>
            </div>
            <div class="chatbot-messages" id="chatMessages">
                <div class="chat-message bot-message">
                    <div class="message-content">
                        <span class="message-avatar" aria-hidden="true">🔑</span>
                        <div class="message-bubble">
                            Hello! I'm the LIVINKEY assistant. How can I help you find your perfect PG?
                        </div>
                    </div>
                </div>
            </div>
            <div class="chatbot-quick-questions" id="quickQuestions">
                <button class="quick-btn" data-question="What are the rent prices?">💰 Rent prices</button>
                <button class="quick-btn" data-question="Do you have AC rooms?">❄️ AC rooms</button>
                <button class="quick-btn" data-question="Is food included?">🍽️ Food included</button>
                <button class="quick-btn" data-question="What amenities are available?">🏊 Amenities</button>
                <button class="quick-btn" data-question="How to book a PG?">📝 Booking process</button>
            </div>
            <div class="chatbot-input-area">
                <input type="text" class="chatbot-input" id="chatInput" placeholder="Type your message..." aria-label="Type your message" />
                <button class="chatbot-send" id="chatSend" aria-label="Send message"><i class="bi bi-send-fill"></i></button>
            </div>
        </div>
    `;

    let isOpen = false;
    const chatToggle = document.getElementById('chatToggle');
    const chatWindow = document.getElementById('chatWindow');
    const chatClose = document.getElementById('chatClose');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const quickBtns = document.querySelectorAll('.quick-btn');

    chatToggle.addEventListener('click', () => {
        isOpen = !isOpen;
        chatWindow.classList.toggle('active', isOpen);
        if (isOpen) {
            chatInput.focus();
            scrollToBottom();
        }
    });

    chatClose.addEventListener('click', () => {
        isOpen = false;
        chatWindow.classList.remove('active');
    });

    function sendMessage(message) {
        if (!message.trim()) return;
        addMessage(message, 'user');
        chatInput.value = '';
        showTypingIndicator();
        setTimeout(() => {
            hideTypingIndicator();
            const response = getBotResponse(message);
            addMessage(response, 'bot');
            scrollToBottom();
        }, 800 + Math.random() * 600);
    }

    function addMessage(text, sender) {
        const div = document.createElement('div');
        div.className = `chat-message ${sender}-message`;
        div.innerHTML = `
            <div class="message-content">
                ${sender === 'bot' ? '<span class="message-avatar" aria-hidden="true">🔑</span>' : ''}
                <div class="message-bubble">${text}</div>
            </div>
        `;
        chatMessages.insertBefore(div, chatMessages.querySelector('.typing-indicator') || chatMessages.lastChild);
        scrollToBottom();
    }

    function showTypingIndicator() {
        hideTypingIndicator();
        const div = document.createElement('div');
        div.className = 'chat-message bot-message typing-indicator';
        div.innerHTML = `
            <div class="message-content">
                <span class="message-avatar" aria-hidden="true">🔑</span>
                <div class="message-bubble typing-bubble">
                    <span class="dot-typing"></span>
                    <span class="dot-typing"></span>
                    <span class="dot-typing"></span>
                </div>
            </div>
        `;
        chatMessages.appendChild(div);
        scrollToBottom();
    }

    function hideTypingIndicator() {
        const indicator = chatMessages.querySelector('.typing-indicator');
        if (indicator) indicator.remove();
    }

    function getBotResponse(message) {
        const msg = message.toLowerCase();

        const responses = {
            'rent': 'Our PG rents range from ₹7,000 to ₹13,000 per month, depending on the property and amenities. You can check individual PG listings for exact prices!',
            'price': 'Our PG rents range from ₹7,000 to ₹13,000 per month, depending on the property and amenities. You can check individual PG listings for exact prices!',
            'ac': 'Yes! Many of our PGs offer AC rooms. Check the amenities section of each PG for details.',
            'food': 'Most of our PGs do not include food in the rent. However, each property has a fully-equipped kitchen where you can cook, and many are located near restaurants and food joints.',
            'amenities': 'Our amenities vary by property but commonly include: WiFi, AC, 24/7 Security, CCTV, Gym, Power Backup, Water Purifier, and Common Areas. Check individual PG listings for specific amenities.',
            'book': 'Booking is easy! Just follow these steps:\n1. Browse our PG listings\n2. Click "Book on WhatsApp" on any property\n3. Our team will guide you through the process\n4. Complete the booking and move in!',
            'booking': 'Booking is easy! Just follow these steps:\n1. Browse our PG listings\n2. Click "Book on WhatsApp" on any property\n3. Our team will guide you through the process\n4. Complete the booking and move in!',
            'security': 'Security is our top priority! All our properties have: 24/7 CCTV surveillance, Secure access systems, On-site security guards, and Well-lit common areas. Your safety is our commitment.',
            'location': 'We have properties strategically located near LPU, Law Gate, Phagwara City Center, and RS Rooms. Each property listing shows its exact location on the map.',
            'contact': 'You can reach us at:\n📱 WhatsApp: +91 98783 83497\n📧 Email: livinkey@gmail.com\n📍 Office: Near LPU, Law Gate, Punjab\nOr use our contact form on the Contact page!',
            'help': 'I\'m here to help! You can ask me about:\n• Rent prices\n• Amenities\n• Booking process\n• Location information\n• Security features\n• Contact details\nJust ask away!'
        };

        for (const [key, value] of Object.entries(responses)) {
            if (msg.includes(key)) {
                return value;
            }
        }

        return "Thanks for your question! I'd be happy to help. Could you be more specific? You can ask about rent, amenities, booking, locations, or anything else about our PGs. Or feel free to contact us directly via WhatsApp!";
    }

    chatSend.addEventListener('click', () => sendMessage(chatInput.value));
    chatInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') sendMessage(chatInput.value);
    });

    quickBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const question = btn.dataset.question;
            sendMessage(question);
        });
    });

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// ============================================================
// URL PARAMETER HANDLING
// ============================================================

function handlePGParameter() {
    const urlParams = new URLSearchParams(window.location.search);
    const pgId = urlParams.get('pg');
    if (pgId) {
        const id = parseInt(pgId);
        setTimeout(() => {
            const modalExists = document.getElementById('pgDetailModal');
            if (modalExists) {
                openDetailModal(id);
            } else {
                window.location.href = `pgs.html?pg=${pgId}`;
            }
        }, 800);
    }
}

// ============================================================
// PAGE-SPECIFIC INITIALIZATION
// ============================================================

async function initHomePage() {
    try {
        const welcome = await fetchWelcomeMessage();
        const heroTitle = document.querySelector('.hero-section h1');
        if (heroTitle && welcome.total_pgs !== undefined) {
            heroTitle.innerHTML = `Find Your Perfect <span class="text-highlight">PG</span> in India`;
        }

        const stats = await fetchPGStats();
        const totalPGs = stats.total_pgs || 0;

        const heroCount = document.getElementById('heroPGCount');
        if (heroCount) {
            heroCount.textContent = `${totalPGs}+`;
        }

        const pgs = await fetchAllPGs();
        let totalTenants = 0;
        if (Array.isArray(pgs)) {
            pgs.forEach(pg => {
                totalTenants += pg.total_occupied || 0;
            });
        }

        const statBoxes = document.querySelectorAll('.stat-box h3');
        if (statBoxes.length >= 2) {
            statBoxes[0].textContent = `${totalPGs}+`;
            statBoxes[0].dataset.countTo = totalPGs;
            const displayCount = totalTenants > 0 ? totalTenants : 0;
            statBoxes[1].textContent = `${displayCount}+`;
            statBoxes[1].dataset.countTo = displayCount;
        }

        const propertyCountEl = document.getElementById('aboutPropertyCount');
        if (propertyCountEl) {
            propertyCountEl.textContent = `${totalPGs}+ fully-furnished properties with modern amenities across India`;
        }

        const topPGs = Array.isArray(pgs) ? pgs.slice(0, 10) : [];
        renderPGCards(topPGs, 'topPropertiesContainer', true);

        animateCounters();
    } catch {
        const heroCount = document.getElementById('heroPGCount');
        if (heroCount) heroCount.textContent = '50+';
        
        const topContainer = document.getElementById('topPropertiesContainer');
        if (topContainer) {
            topContainer.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="bi bi-wifi-off fs-1" style="color: #e74c3c;"></i>
                    <p class="mt-3 fw-semibold">Unable to load PGs. Please check your connection.</p>
                    <button class="btn btn-primary rounded-pill mt-3" onclick="location.reload()">Retry</button>
                </div>`;
        }
    }
}

async function initPGsPage() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const amenityFilter = document.getElementById('amenityFilter');
    const occupancyFilter = document.getElementById('occupancyFilter');

    if (searchBtn) {
        searchBtn.addEventListener('click', filterPGs);
    }
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') filterPGs();
        });
    }
    if (amenityFilter) {
        amenityFilter.addEventListener('change', filterPGs);
    }
    if (occupancyFilter) {
        occupancyFilter.addEventListener('change', filterPGs);
    }

    try {
        const pgs = await fetchAllPGs();
        renderPGCards(pgs, 'pgCardContainer', true);
        handlePGParameter();
    } catch {
        const container = document.getElementById('pgCardContainer');
        if (container) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="bi bi-wifi-off fs-1" style="color: #e74c3c;"></i>
                    <p class="mt-3 fw-semibold">Unable to load PGs. Please check your connection.</p>
                    <button class="btn btn-primary rounded-pill mt-3" onclick="location.reload()">Retry</button>
                </div>`;
        }
    }
}

async function initAboutPage() {
    try {
        const stats = await fetchPGStats();
        const totalPGs = stats.total_pgs || 0;
        
        const propertyCountEl = document.getElementById('aboutPropertyCount');
        if (propertyCountEl) {
            propertyCountEl.textContent = `${totalPGs}+ fully-furnished properties with modern amenities across India`;
        }
        
        const pgs = await fetchAllPGs();
        let totalTenants = 0;
        if (Array.isArray(pgs)) {
            pgs.forEach(pg => {
                totalTenants += pg.total_occupied || 0;
            });
        }
        
        const statBoxes = document.querySelectorAll('.stat-box h3');
        if (statBoxes.length >= 2) {
            statBoxes[0].textContent = `${totalPGs}+`;
            statBoxes[0].dataset.countTo = totalPGs;
            statBoxes[1].textContent = `${totalTenants}+`;
            statBoxes[1].dataset.countTo = totalTenants;
        }
        animateCounters();
    } catch {
        const propertyCountEl = document.getElementById('aboutPropertyCount');
        if (propertyCountEl) {
            propertyCountEl.textContent = 'Premium properties across India';
        }
    }
}

// ============================================================
// MAIN INITIALIZATION
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
    initNavbarScroll();
    initChatbot();
    initHelpForm();

    ['searchBtn', 'helpFormSubmit'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) wrapButtonLabel(btn);
    });
    document.querySelectorAll('.app-download-tab').forEach(btn => wrapButtonLabel(btn));

    document.querySelectorAll('section, .about-card, .contact-info, .map-container').forEach(el => {
        if (!el.classList.contains('reveal')) el.classList.add('reveal');
    });

    const pageType = window.location.pathname.split('/').pop().split('?')[0] || 'home.html';

    if (pageType === 'home.html' || pageType === '') {
        initHomePage();
    } else if (pageType === 'pgs.html') {
        initPGsPage();
    } else if (pageType === 'about.html') {
        initAboutPage();
    }

    observeReveals();
});

window.filterPGs = filterPGs;
window.openDetailModal = openDetailModal;
window.fetchAllPGs = fetchAllPGs;