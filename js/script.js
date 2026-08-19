// Sample PG Data
const pgData = [
    {
        id: 1,
        name: "Lakeside PG",
        location: "Near LPU, Phagwara",
        rent: 8500,
        rooms: 12,
        available: 4,
        status: "vacant",
        rating: 4.8,
        amenities: ["wifi", "ac", "security", "gym"],
        images: ["https://placehold.co/600x400/92C24A/FFFFFF?text=Lakeside+1", "https://placehold.co/600x400/92C24A/FFFFFF?text=Lakeside+2", "https://placehold.co/600x400/92C24A/FFFFFF?text=Lakeside+3"],
        reviews: [
            { name: "Rahul S.", comment: "Great place, very clean and friendly staff!" },
            { name: "Priya M.", comment: "Best PG near LPU, highly recommend." }
        ]
    },
    {
        id: 2,
        name: "Green Valley PG",
        location: "Law Gate, Punjab",
        rent: 7500,
        rooms: 8,
        available: 2,
        status: "partially",
        rating: 4.6,
        amenities: ["wifi", "security"],
        images: ["https://placehold.co/600x400/92C24A/FFFFFF?text=Green+Valley+1", "https://placehold.co/600x400/92C24A/FFFFFF?text=Green+Valley+2"],
        reviews: [
            { name: "Amit K.", comment: "Good value for money." },
            { name: "Sneha R.", comment: "Safe and comfortable." }
        ]
    },
    {
        id: 3,
        name: "Sunrise PG",
        location: "Near RS Rooms, Phagwara",
        rent: 9200,
        rooms: 15,
        available: 0,
        status: "full",
        rating: 4.9,
        amenities: ["wifi", "ac", "gym"],
        images: ["https://placehold.co/600x400/92C24A/FFFFFF?text=Sunrise+1", "https://placehold.co/600x400/92C24A/FFFFFF?text=Sunrise+2", "https://placehold.co/600x400/92C24A/FFFFFF?text=Sunrise+3"],
        reviews: [
            { name: "Vikram P.", comment: "Excellent facilities!" },
            { name: "Neha G.", comment: "Love the community events." }
        ]
    },
    {
        id: 4,
        name: "Paradise PG",
        location: "Beside Paradise Momos, LPU",
        rent: 8000,
        rooms: 10,
        available: 3,
        status: "vacant",
        rating: 4.7,
        amenities: ["wifi", "ac", "security"],
        images: ["https://placehold.co/600x400/92C24A/FFFFFF?text=Paradise+1", "https://placehold.co/600x400/92C24A/FFFFFF?text=Paradise+2"],
        reviews: [
            { name: "Deepak J.", comment: "Perfect location for students." }
        ]
    },
    {
        id: 5,
        name: "Royal PG",
        location: "Phagwara City Center",
        rent: 9500,
        rooms: 6,
        available: 1,
        status: "partially",
        rating: 4.5,
        amenities: ["wifi", "ac", "gym", "security"],
        images: ["https://placehold.co/600x400/92C24A/FFFFFF?text=Royal+1", "https://placehold.co/600x400/92C24A/FFFFFF?text=Royal+2", "https://placehold.co/600x400/92C24A/FFFFFF?text=Royal+3"],
        reviews: [
            { name: "Anjali T.", comment: "Luxury at affordable price!" }
        ]
    },
    {
        id: 6,
        name: "Peaceful PG",
        location: "Near LPU, Back Gate",
        rent: 7000,
        rooms: 20,
        available: 8,
        status: "vacant",
        rating: 4.3,
        amenities: ["wifi", "security"],
        images: ["https://placehold.co/600x400/92C24A/FFFFFF?text=Peaceful+1", "https://placehold.co/600x400/92C24A/FFFFFF?text=Peaceful+2"],
        reviews: [
            { name: "Mohan R.", comment: "Peaceful environment." }
        ]
    },
    {
        id: 7,
        name: "Elite PG",
        location: "Law Gate, Punjab",
        rent: 10500,
        rooms: 5,
        available: 0,
        status: "full",
        rating: 4.9,
        amenities: ["wifi", "ac", "gym", "security"],
        images: ["https://placehold.co/600x400/92C24A/FFFFFF?text=Elite+1", "https://placehold.co/600x400/92C24A/FFFFFF?text=Elite+2"],
        reviews: [
            { name: "Kiran D.", comment: "Top-notch facilities!" }
        ]
    },
    {
        id: 8,
        name: "Garden PG",
        location: "Near RS Rooms, Phagwara",
        rent: 7800,
        rooms: 14,
        available: 5,
        status: "vacant",
        rating: 4.4,
        amenities: ["wifi", "security"],
        images: ["https://placehold.co/600x400/92C24A/FFFFFF?text=Garden+1", "https://placehold.co/600x400/92C24A/FFFFFF?text=Garden+2", "https://placehold.co/600x400/92C24A/FFFFFF?text=Garden+3"],
        reviews: [
            { name: "Suresh K.", comment: "Beautiful garden area." }
        ]
    },
    {
        id: 9,
        name: "City Light PG",
        location: "Phagwara Main Road",
        rent: 8200,
        rooms: 9,
        available: 2,
        status: "partially",
        rating: 4.6,
        amenities: ["wifi", "ac"],
        images: ["https://placehold.co/600x400/92C24A/FFFFFF?text=City+Light+1", "https://placehold.co/600x400/92C24A/FFFFFF?text=City+Light+2"],
        reviews: [
            { name: "Pooja S.", comment: "Convenient location." }
        ]
    },
    {
        id: 10,
        name: "Comfort PG",
        location: "LPU, South Campus",
        rent: 8800,
        rooms: 11,
        available: 3,
        status: "vacant",
        rating: 4.7,
        amenities: ["wifi", "ac", "security"],
        images: ["https://placehold.co/600x400/92C24A/FFFFFF?text=Comfort+1", "https://placehold.co/600x400/92C24A/FFFFFF?text=Comfort+2"],
        reviews: [
            { name: "Ravi G.", comment: "Very comfortable stay." }
        ]
    }
];

/* ===================== HELPERS: button loading state ===================== */
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

/* ===================== CHATBOT with Animated Key Icon ===================== */
function initChatbot() {
    const container = document.getElementById('chatbot-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="chatbot-toggle" id="chatToggle">
            <div class="key-icon-container">
                <svg class="animated-key" viewBox="0 0 100 100" width="32" height="32">
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
                    <!-- Key bow (circular top) -->
                    <circle cx="40" cy="35" r="22" fill="none" stroke="url(#keyGradient)" stroke-width="6" filter="url(#keyGlow)"/>
                    <!-- Key shaft -->
                    <rect x="36" y="48" width="6" height="28" rx="3" fill="url(#keyGradient)" filter="url(#keyGlow)"/>
                    <!-- Key teeth -->
                    <rect x="36" y="62" width="18" height="5" rx="2" fill="url(#keyGradient)" filter="url(#keyGlow)"/>
                    <rect x="36" y="70" width="14" height="5" rx="2" fill="url(#keyGradient)" filter="url(#keyGlow)"/>
                    <!-- Key highlight sparkle -->
                    <circle cx="32" cy="28" r="3" fill="white" opacity="0.6">
                        <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="45" cy="25" r="2" fill="white" opacity="0.4">
                        <animate attributeName="opacity" values="0.4;0.05;0.4" dur="2.5s" repeatCount="indefinite"/>
                    </circle>
                    <!-- Rotating ring around key -->
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
        <div class="chatbot-window" id="chatWindow">
            <div class="chatbot-header">
                <div class="chatbot-header-content">
                    <div class="header-key-icon">
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
                <button class="chatbot-close" id="chatClose"><i class="bi bi-x-lg"></i></button>
            </div>
            <div class="chatbot-messages" id="chatMessages">
                <div class="chat-message bot-message">
                    <div class="message-content">
                        <span class="message-avatar">🔑</span>
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
                <input type="text" class="chatbot-input" id="chatInput" placeholder="Type your message..." />
                <button class="chatbot-send" id="chatSend"><i class="bi bi-send-fill"></i></button>
            </div>
        </div>
    `;
    
    // Chatbot state
    let isOpen = false;
    const chatToggle = document.getElementById('chatToggle');
    const chatWindow = document.getElementById('chatWindow');
    const chatClose = document.getElementById('chatClose');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const quickBtns = document.querySelectorAll('.quick-btn');
    
    // Toggle chat
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
    
    // Send message
    function sendMessage(message) {
        if (!message.trim()) return;
        
        // Add user message
        addMessage(message, 'user');
        chatInput.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        // Get response with delay
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
                ${sender === 'bot' ? '<span class="message-avatar">🔑</span>' : ''}
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
                <span class="message-avatar">🔑</span>
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
            'rent': 'Our PG rents range from ₹7,000 to ₹10,500 per month, depending on the property and amenities. You can check individual PG listings for exact prices!',
            'price': 'Our PG rents range from ₹7,000 to ₹10,500 per month, depending on the property and amenities. You can check individual PG listings for exact prices!',
            'ac': 'Yes! Many of our PGs offer AC rooms. Properties like Sunrise PG, Royal PG, and Elite PG all have AC facilities. Check the amenities section of each PG for details.',
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
    
    // Event listeners
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

/* ===================== Function to render PG Cards ===================== */
function renderPGCards(data, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    if (data.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-house-x fs-1" style="color: var(--line-strong);"></i>
                <p class="mt-3 fw-semibold" style="color: var(--ink-soft);">No PGs match your filters. Try widening your search.</p>
            </div>`;
        return;
    }

    data.forEach((pg, index) => {
        const statusClass = pg.status === 'vacant' ? 'status-vacant' : pg.status === 'partially' ? 'status-partial' : 'status-full';
        const statusText = pg.status === 'vacant' ? 'Vacant' : pg.status === 'partially' ? 'Partially Occupied' : 'Full Occupied';

        const col = document.createElement('div');
        col.className = 'col-lg-3 col-md-4 col-sm-6 reveal';
        col.style.transitionDelay = `${Math.min(index, 8) * 0.06}s`;
        col.innerHTML = `
            <div class="pg-card" data-id="${pg.id}">
                <div class="pg-card-img-wrap">
                    <img src="${pg.images[0] || 'https://placehold.co/600x400/92C24A/FFFFFF?text=No+Image'}" class="pg-card-img" alt="${pg.name}" loading="lazy">
                </div>
                <div class="p-3">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="fw-bold mb-0">${pg.name}</h5>
                        <span class="rating-badge">${pg.rating}</span>
                    </div>
                    <p class="small text-muted mb-2"><i class="bi bi-geo-alt"></i> ${pg.location}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="pg-status ${statusClass}">${statusText}</span>
                        <span class="fw-bold text-success">₹${pg.rent.toLocaleString('en-IN')}/mo</span>
                    </div>
                    <div class="mt-2 small">
                        <span>🛏 ${pg.rooms} rooms</span>
                        <span class="ms-2">👤 ${pg.available} available</span>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(col);
    });

    document.querySelectorAll('.pg-card').forEach(card => {
        card.addEventListener('click', function () {
            const id = parseInt(this.dataset.id);
            const pg = pgData.find(p => p.id === id);
            if (pg) openDetailModal(pg);
        });
    });

    observeReveals();
}

/* ===================== Function to open detail modal ===================== */
function openDetailModal(pg) {
    document.getElementById('detailPgName').textContent = pg.name;
    document.getElementById('detailLocation').textContent = pg.location;
    document.getElementById('detailRent').textContent = pg.rent.toLocaleString('en-IN');
    document.getElementById('detailRooms').textContent = pg.rooms;
    document.getElementById('detailAvailable').textContent = pg.available;

    const amenityMap = { wifi: 'WiFi', ac: 'AC', security: 'Security', gym: 'Gym' };
    const amenityList = pg.amenities.map(a => amenityMap[a] || a).join(', ');
    document.getElementById('detailAmenities').textContent = amenityList || 'None specified';

    const reviewContainer = document.getElementById('detailReviews');
    reviewContainer.innerHTML = '';
    pg.reviews.forEach(review => {
        const initials = review.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
        const div = document.createElement('div');
        div.className = 'review-card';
        div.innerHTML = `
            <div class="review-avatar">${initials}</div>
            <div>
                <strong>${review.name}</strong><br>
                <small>${review.comment}</small>
            </div>`;
        reviewContainer.appendChild(div);
    });

    const carouselInner = document.getElementById('detailCarouselInner');
    carouselInner.innerHTML = '';
    pg.images.forEach((img, index) => {
        const div = document.createElement('div');
        div.className = `carousel-item ${index === 0 ? 'active' : ''}`;
        div.innerHTML = `<img src="${img}" class="d-block w-100" style="height: 350px; object-fit: cover;" alt="${pg.name}">`;
        carouselInner.appendChild(div);
    });

    const modal = new bootstrap.Modal(document.getElementById('pgDetailModal'));
    modal.show();
}

/* ===================== Filter and search functionality ===================== */
function filterPGs() {
    const searchBtn = document.getElementById('searchBtn');
    setButtonLoading(searchBtn, true);

    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const amenityFilter = document.getElementById('amenityFilter')?.value || 'all';
    const occupancyFilter = document.getElementById('occupancyFilter')?.value || 'all';

    setTimeout(() => {
        const filtered = pgData.filter(pg => {
            const matchSearch = pg.name.toLowerCase().includes(searchTerm) ||
                pg.location.toLowerCase().includes(searchTerm);
            const matchAmenity = amenityFilter === 'all' || pg.amenities.includes(amenityFilter);
            const matchOccupancy = occupancyFilter === 'all' || pg.status === occupancyFilter;
            return matchSearch && matchAmenity && matchOccupancy;
        });

        renderPGCards(filtered, 'pgCardContainer');
        setButtonLoading(searchBtn, false);
    }, 380);
}

/* ===================== Scroll reveal (IntersectionObserver) ===================== */
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

/* ===================== Count-up stats ===================== */
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

/* ===================== Navbar scroll shadow ===================== */
function initNavbarScroll() {
    const nav = document.querySelector('.navbar');
    if (!nav) return;
    const onScroll = () => {
        nav.classList.toggle('scrolled', window.scrollY > 12);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* ===================== Initialize on page load ===================== */
document.addEventListener('DOMContentLoaded', function () {
    initNavbarScroll();
    
    initChatbot();

    ['searchBtn', 'helpFormSubmit'].forEach(id => wrapButtonLabel(document.getElementById(id)));
    document.querySelectorAll('.app-download-tab').forEach(btn => wrapButtonLabel(btn));

    if (document.getElementById('topPropertiesContainer')) {
        renderPGCards(pgData.slice(0, 10), 'topPropertiesContainer');
    }

    if (document.getElementById('pgCardContainer')) {
        renderPGCards(pgData, 'pgCardContainer');

        document.getElementById('searchBtn')?.addEventListener('click', filterPGs);
        document.getElementById('searchInput')?.addEventListener('keyup', function (e) {
            if (e.key === 'Enter') filterPGs();
        });
        document.getElementById('amenityFilter')?.addEventListener('change', filterPGs);
        document.getElementById('occupancyFilter')?.addEventListener('change', filterPGs);
    }

    document.getElementById('helpForm')?.addEventListener('submit', function (e) {
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

    document.querySelectorAll('.app-download-tab').forEach(btn => {
        btn.addEventListener('click', function (e) {
            if (this.getAttribute('href') === '#') e.preventDefault();
            setButtonLoading(this, true);
            setTimeout(() => setButtonLoading(this, false), 600);
        });
    });

    document.querySelectorAll('section, .about-card, .contact-info, .map-container').forEach(el => {
        if (!el.classList.contains('reveal')) el.classList.add('reveal');
    });
    observeReveals();
    animateCounters();
});