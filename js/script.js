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
    // wraps existing button content in a span so it can be hidden while spinner shows
    if (!btn || btn.querySelector('.btn-label')) return;
    const span = document.createElement('span');
    span.className = 'btn-label';
    span.innerHTML = btn.innerHTML;
    btn.innerHTML = '';
    btn.appendChild(span);
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

    // Add click event to cards
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

    // Amenities
    const amenityMap = { wifi: 'WiFi', ac: 'AC', security: 'Security', gym: 'Gym' };
    const amenityList = pg.amenities.map(a => amenityMap[a] || a).join(', ');
    document.getElementById('detailAmenities').textContent = amenityList || 'None specified';

    // Reviews
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

    // Carousel
    const carouselInner = document.getElementById('detailCarouselInner');
    carouselInner.innerHTML = '';
    pg.images.forEach((img, index) => {
        const div = document.createElement('div');
        div.className = `carousel-item ${index === 0 ? 'active' : ''}`;
        div.innerHTML = `<img src="${img}" class="d-block w-100" style="height: 350px; object-fit: cover;" alt="${pg.name}">`;
        carouselInner.appendChild(div);
    });

    // Open modal
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
    }, 380); // brief, honest delay so the spinner is perceptible
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

    // wrap labels on buttons that get a loading state
    ['searchBtn', 'helpFormSubmit'].forEach(id => wrapButtonLabel(document.getElementById(id)));
    document.querySelectorAll('.app-download-tab').forEach(btn => wrapButtonLabel(btn));

    // Home page top 10
    if (document.getElementById('topPropertiesContainer')) {
        renderPGCards(pgData.slice(0, 10), 'topPropertiesContainer');
    }

    // PGs page
    if (document.getElementById('pgCardContainer')) {
        renderPGCards(pgData, 'pgCardContainer');

        // Search event listeners
        document.getElementById('searchBtn')?.addEventListener('click', filterPGs);
        document.getElementById('searchInput')?.addEventListener('keyup', function (e) {
            if (e.key === 'Enter') filterPGs();
        });
        document.getElementById('amenityFilter')?.addEventListener('change', filterPGs);
        document.getElementById('occupancyFilter')?.addEventListener('change', filterPGs);
    }

    // Help form - WhatsApp redirect (with loading spinner)
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

    // App download buttons — brief loading feel before opening store links
    document.querySelectorAll('.app-download-tab').forEach(btn => {
        btn.addEventListener('click', function (e) {
            if (this.getAttribute('href') === '#') e.preventDefault();
            setButtonLoading(this, true);
            setTimeout(() => setButtonLoading(this, false), 600);
        });
    });

    // Scroll reveal + counters
    document.querySelectorAll('section, .about-card, .contact-info, .map-container').forEach(el => {
        if (!el.classList.contains('reveal')) el.classList.add('reveal');
    });
    observeReveals();
    animateCounters();
});