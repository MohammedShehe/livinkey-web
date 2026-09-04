// ============================================================
// LIVINKEY FRONTEND - BACKEND API CONNECTION
// ============================================================

const API_BASE = 'https://api.livinkey.com/api';

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
        col.className = 'pg-card-col reveal';
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
    const pgId = typeof pgIdOrData === 'object' ? pgIdOrData?.id : pgIdOrData;
    if (!pgId) return;
    showPageLoading('Opening PG details...');
    window.location.href = `pg-details.html?pg=${encodeURIComponent(pgId)}`;
}

// Smooth, slow, eased horizontal scroll (native `behavior:'smooth'` is too
// fast/short for an auto-playing slider, so we drive it ourselves).
function slowScrollTo(el, target, duration = 1400) {
    const start = el.scrollLeft;
    const distance = target - start;
    if (Math.abs(distance) < 1) return;
    // Temporarily disable CSS scroll-snap + smooth behavior so our rAF
    // animation isn't fighting the browser's native scroll handling.
    const prevSnap = el.style.scrollSnapType;
    const prevBehavior = el.style.scrollBehavior;
    el.style.scrollSnapType = 'none';
    el.style.scrollBehavior = 'auto';
    const startTime = performance.now();
    const ease = t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2); // easeInOutQuad
    if (el._slideRAF) cancelAnimationFrame(el._slideRAF);
    const step = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        el.scrollLeft = start + distance * ease(progress);
        if (progress < 1) {
            el._slideRAF = requestAnimationFrame(step);
        } else {
            el._slideRAF = null;
            el.style.scrollSnapType = prevSnap || '';
            el.style.scrollBehavior = prevBehavior || '';
        }
    };
    el._slideRAF = requestAnimationFrame(step);
}

function initPGSlider(containerId = 'pgCardContainer', viewportId = 'pgSliderViewport', prevId = 'pgSliderPrev', nextId = 'pgSliderNext') {
    const viewport = document.getElementById(viewportId);
    const track = document.getElementById(containerId);
    const prev = document.getElementById(prevId);
    const next = document.getElementById(nextId);
    if (!viewport || !track || !prev || !next) return;

    // Tear down any previous instance on this viewport so filters / re-inits
    // don't leave orphaned intervals or duplicate listeners.
    if (viewport._pgSliderCleanup) {
        viewport._pgSliderCleanup();
        viewport._pgSliderCleanup = null;
    }

    const AUTOPLAY_PAUSE_MS = 4200;   // dwell time on each slide before advancing
    const AUTOPLAY_SCROLL_MS = 1600;  // how long the glide itself takes ("slowly")
    const RESUME_DELAY_MS = 3500;     // wait this long after user interaction before resuming
    let autoplayTimer = null;
    let resumeTimer = null;
    let layoutRetryTimer = null;
    let destroyed = false;

    const prefersReducedMotion = () =>
        window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const getMax = () => Math.max(0, track.scrollWidth - viewport.clientWidth - 2);

    const update = () => {
        if (destroyed) return;
        const max = getMax();
        const current = viewport.scrollLeft;
        const canSlide = max > 2;
        prev.disabled = current <= 2;
        next.disabled = current >= max - 2;
        prev.classList.toggle('d-none', !canSlide);
        next.classList.toggle('d-none', !canSlide);
    };

    const getStep = () => {
        const card = track.querySelector('.pg-card-col');
        // gap is 1.5rem (24px) on desktop; match that for consistent steps
        const gap = 24;
        return card ? card.getBoundingClientRect().width + gap : Math.max(280, viewport.clientWidth * 0.8);
    };

    const stopAutoplay = () => {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    };

    const scheduleResume = () => {
        if (destroyed) return;
        if (resumeTimer) clearTimeout(resumeTimer);
        resumeTimer = setTimeout(startAutoplay, RESUME_DELAY_MS);
    };

    const advance = () => {
        if (destroyed || document.hidden) return;
        const max = getMax();
        if (max <= 2) return;
        const current = viewport.scrollLeft;
        if (current >= max - 4) {
            // Reached the end — loop back to the beginning.
            slowScrollTo(viewport, 0, AUTOPLAY_SCROLL_MS);
        } else {
            slowScrollTo(viewport, Math.min(current + getStep(), max), AUTOPLAY_SCROLL_MS);
        }
    };

    function startAutoplay() {
        if (destroyed) return;
        stopAutoplay();
        if (prefersReducedMotion()) return;
        if (getMax() <= 2) return; // not enough overflow yet
        autoplayTimer = setInterval(advance, AUTOPLAY_PAUSE_MS);
    }

    const pauseAndResumeLater = () => {
        stopAutoplay();
        scheduleResume();
    };

    const onPrev = () => {
        pauseAndResumeLater();
        slowScrollTo(viewport, Math.max(viewport.scrollLeft - getStep(), 0), 700);
    };
    const onNext = () => {
        pauseAndResumeLater();
        slowScrollTo(viewport, Math.min(viewport.scrollLeft + getStep(), getMax()), 700);
    };
    const onScroll = () => update();
    const onResize = () => {
        update();
        startAutoplay();
    };
    const onVisibility = () => {
        if (document.hidden) stopAutoplay();
        else startAutoplay();
    };

    prev.addEventListener('click', onPrev);
    next.addEventListener('click', onNext);

    // Pause while the user is actively browsing the slider, resume shortly after.
    const pauseEvents = ['mouseenter', 'touchstart', 'focusin', 'pointerdown'];
    const resumeEvents = ['mouseleave', 'touchend'];
    pauseEvents.forEach(evt => viewport.addEventListener(evt, pauseAndResumeLater, { passive: true }));
    resumeEvents.forEach(evt => viewport.addEventListener(evt, scheduleResume, { passive: true }));

    viewport.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);

    // ResizeObserver: cards / images can change track width after initial paint.
    let ro = null;
    if (typeof ResizeObserver !== 'undefined') {
        ro = new ResizeObserver(() => {
            update();
            // If autoplay never started because layout wasn't ready, try again.
            if (!autoplayTimer && !destroyed) startAutoplay();
        });
        ro.observe(track);
        ro.observe(viewport);
    }

    viewport._pgSliderCleanup = () => {
        destroyed = true;
        stopAutoplay();
        if (resumeTimer) clearTimeout(resumeTimer);
        if (layoutRetryTimer) clearTimeout(layoutRetryTimer);
        prev.removeEventListener('click', onPrev);
        next.removeEventListener('click', onNext);
        pauseEvents.forEach(evt => viewport.removeEventListener(evt, pauseAndResumeLater));
        resumeEvents.forEach(evt => viewport.removeEventListener(evt, scheduleResume));
        viewport.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
        document.removeEventListener('visibilitychange', onVisibility);
        if (ro) ro.disconnect();
        if (viewport._slideRAF) {
            cancelAnimationFrame(viewport._slideRAF);
            viewport._slideRAF = null;
        }
    };

    // Layout may not be final right after innerHTML replacement (images, fonts,
    // reveal transforms). Defer the first start so scrollWidth is accurate.
    update();
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            update();
            startAutoplay();
            // One more retry shortly after in case images are still loading.
            layoutRetryTimer = setTimeout(() => {
                update();
                if (!autoplayTimer) startAutoplay();
            }, 600);
        });
    });
}

function renderDetailReviews(reviews) {
    const container = document.getElementById('detailReviews');
    if (!container) return;
    container.innerHTML = '';
    if (!Array.isArray(reviews) || !reviews.length) {
        container.innerHTML = `<div class="empty-detail-card"><i class="bi bi-chat-square-heart"></i><h5>No reviews yet</h5><p>Be one of the first residents to share your experience.</p></div>`;
        return;
    }
    reviews.forEach(review => {
        const name = review.name || review.tenant_name || 'Anonymous';
        const initials = name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
        const card = document.createElement('div');
        card.className = 'review-card detail-review-card';
        card.innerHTML = `<div class="review-avatar">${initials}</div><div><div class="d-flex flex-wrap gap-2 align-items-center"><strong>${name}</strong>${review.rating ? `<span class="text-success">★ ${review.rating}</span>` : ''}</div><small class="text-muted">${review.comment || 'No comment provided.'}</small></div>`;
        container.appendChild(card);
    });
}

function renderDetailAmenities(amenities) {
    const container = document.getElementById('detailAmenities');
    if (!container) return;
    container.innerHTML = '';
    if (!amenities.length) {
        container.innerHTML = '<span class="amenity-pill muted">No amenities specified</span>';
        return;
    }
    const icons = {wifi:'bi-wifi', ac:'bi-snow', security:'bi-shield-check', gym:'bi-heart-pulse', parking:'bi-p-square', kitchen:'bi-cup-hot', laundry:'bi-water'};
    amenities.forEach(item => {
        const text = String(item), key = text.toLowerCase();
        const iconKey = Object.keys(icons).find(k => key.includes(k));
        const pill = document.createElement('span');
        pill.className = 'amenity-pill';
        pill.innerHTML = `<i class="bi ${iconKey ? icons[iconKey] : 'bi-check2-circle'}"></i>${text}`;
        container.appendChild(pill);
    });
}

function renderDetailGallery(pg) {
    const carouselInner = document.getElementById('detailCarouselInner');
    if (!carouselInner) return;
    const images = Array.isArray(pg.images) ? pg.images : [];
    carouselInner.innerHTML = '';
    if (!images.length) {
        carouselInner.innerHTML = `<div class="carousel-item active"><img src="https://placehold.co/1200x650/92C24A/FFFFFF?text=No+Images" class="d-block w-100" alt="No images available"></div>`;
        return;
    }
    images.forEach((img,index) => {
        const item=document.createElement('div');
        item.className=`carousel-item ${index===0?'active':''}`;
        item.innerHTML=`<img src="${img}" class="d-block w-100" alt="${pg.name||'PG'}" onerror="this.src='https://placehold.co/1200x650/92C24A/FFFFFF?text=Image+Not+Found'">`;
        carouselInner.appendChild(item);
    });
}

// Fill the in-page enquiry section with the current PG details.
function fillPGContactPanel(pg) {
    const panel = document.getElementById('pgContactPanel');
    if (!panel) return;
    const name = pg?.name || 'Selected PG';
    const location = pg?.location || 'Location TBD';
    const nameEl = document.getElementById('contactPgName');
    const locEl = document.getElementById('contactPgLocation');
    const subEl = document.getElementById('contactPgSubtitle');
    if (nameEl) nameEl.textContent = name;
    if (locEl) locEl.textContent = location;
    if (subEl) subEl.textContent = `Tell us what you need at ${name} and we'll help you with the next step.`;
    const message = document.getElementById('pgContactMessage');
    if (message && !message.value) {
        message.value = `Hi LIVINKEY, I am interested in ${name}${location ? ` at ${location}` : ''}.`;
    }
}

// Scroll / focus the in-page enquiry section (used by the "Contact about this PG" button).
function openPGContactModal(pg) {
    fillPGContactPanel(pg);
    const panel = document.getElementById('pgContactPanel');
    if (!panel) return;
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    panel.classList.add('pg-enquiry-highlight');
    setTimeout(() => panel.classList.remove('pg-enquiry-highlight'), 1200);
    const firstInput = document.getElementById('pgContactName');
    if (firstInput) setTimeout(() => firstInput.focus({ preventScroll: true }), 400);
}

function initPGContactForm(pg) {
    const form=document.getElementById('pgContactForm'), button=document.getElementById('pgContactSubmit');
    if(!form || !button) return;
    form.addEventListener('submit',e=>{
        e.preventDefault(); setButtonLoading(button,true);
        const name=document.getElementById('pgContactName')?.value.trim()||'';
        const phone=document.getElementById('pgContactPhone')?.value.trim()||'';
        const email=document.getElementById('pgContactEmail')?.value.trim()||'';
        const message=document.getElementById('pgContactMessage')?.value.trim()||'';
        const text=['Hi LIVINKEY!','',`I am interested in: ${pg?.name||'this PG'}`,`Location: ${pg?.location||'Not specified'}`,`Name: ${name}`,`Phone: ${phone}`,email?`Email: ${email}`:'',`Message: ${message||`I would like more information about ${pg?.name||'this PG'}.`}`].filter(Boolean).join('\n');
        setTimeout(()=>{window.open(`https://wa.me/919878383497?text=${encodeURIComponent(text)}`,'_blank','noopener');setButtonLoading(button,false);},350);
    });
}

async function initPGDetailPage() {
    const params=new URLSearchParams(window.location.search), pgId=parseInt(params.get('pg'),10);
    const loading=document.getElementById('pgDetailLoading'), content=document.getElementById('pgDetailContent'), error=document.getElementById('pgDetailError');
    if(!pgId){ if(loading) loading.classList.add('d-none'); if(error){error.classList.remove('d-none');error.innerHTML=`<i class="bi bi-house-x"></i><h2>PG not found</h2><p>We couldn't identify the PG you were trying to open.</p><a href="pgs.html" class="btn btn-primary rounded-pill px-4">Browse all PGs</a>`;} return; }
    try {
        const pg=await fetchPGDetails(pgId);
        document.title=`${pg.name||'PG Details'} - LIVINKEY`;
        document.getElementById('detailPgName').textContent=pg.name||'PG Name';
        document.getElementById('detailLocation').textContent=pg.location||'Location TBD';
        document.getElementById('detailRent').textContent=(pg.rent||0).toLocaleString('en-IN');
        document.getElementById('detailRooms').textContent=pg.total_rooms||0;
        const available=Math.max(0,(pg.total_capacity||0)-(pg.total_occupied||0));
        document.getElementById('detailAvailable').textContent=available;
        const status=pg.status_text||'Vacant';
        document.getElementById('detailStatus').textContent=getStatusText(status);
        const rating=parseFloat(pg.overall_rating)||0;
        document.getElementById('detailRating').textContent=rating>0?rating.toFixed(1):'New';
        renderDetailGallery(pg); renderDetailAmenities(extractAmenities(pg)); renderDetailReviews(pg.reviews||[]);
        const av=document.getElementById('detailAvailabilityText');
        if(av) av.textContent=available>0?`${available} bed${available===1?'':'s'} currently shown as available. Availability can change, so contact LIVINKEY to confirm before booking.`:'This PG currently has no available beds shown. Contact LIVINKEY for the latest availability.';
        const wa=document.getElementById('whatsappPgBtn');
        if(wa) wa.href=`https://wa.me/919878383497?text=${encodeURIComponent(`Hi LIVINKEY, I want to enquire about ${pg.name||'this PG'}${pg.location?` in ${pg.location}`:''}.`)}`;
        const contact=document.getElementById('contactPgBtn');
        if(contact) contact.addEventListener('click',()=>openPGContactModal(pg));
        fillPGContactPanel(pg);
        initPGContactForm(pg);
        if(loading) loading.classList.add('d-none');
        if(content){content.classList.remove('d-none');requestAnimationFrame(()=>content.querySelectorAll('.reveal').forEach(el=>el.classList.add('is-visible')));}
    } catch(err) {
        console.error('PG detail page error:',err);
        if(loading) loading.classList.add('d-none');
        if(error){error.classList.remove('d-none');error.innerHTML=`<i class="bi bi-wifi-off"></i><h2>We couldn't load this PG</h2><p>Please check your connection and try again.</p><button class="btn btn-primary rounded-pill px-4" onclick="location.reload()">Try again</button>`;}
    } finally { hidePageLoading(); }
}

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
        initPGSlider();
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
    if (pgId && window.location.pathname.split('/').pop() === 'pgs.html') {
        window.location.replace(`pg-details.html?pg=${encodeURIComponent(pgId)}`);
    }
}

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
        initPGSlider('topPropertiesContainer', 'homePgSliderViewport', 'homePgSliderPrev', 'homePgSliderNext');

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
        initPGSlider();
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
// FEEDBACK MODAL - FLOATING BUTTON
// ============================================================

function initFeedbackModal() {
    const toggle = document.getElementById('feedbackToggle');
    const modal = document.getElementById('feedbackModal');
    const modalBody = document.getElementById('feedbackModalBody');

    if (!toggle || !modal || !modalBody) return;

    // Load feedback form content when modal is shown
    modal.addEventListener('show.bs.modal', function() {
        // Only load if not already loaded
        if (modalBody.dataset.loaded === 'true') return;
        loadFeedbackForm(modalBody);
    });

    // Click toggle to open modal
    toggle.addEventListener('click', function() {
        const bsModal = bootstrap.Modal.getInstance(modal);
        if (bsModal) {
            bsModal.show();
        } else {
            const newModal = new bootstrap.Modal(modal);
            newModal.show();
        }
    });
}

async function loadFeedbackForm(container) {
    try {
        // Fetch PGs
        const pgs = await fetchAllPGs();
        
        let optionsHtml = '<option value="">Select a PG...</option>';
        if (Array.isArray(pgs)) {
            pgs.forEach(pg => {
                optionsHtml += `<option value="${pg.id}">${pg.name || 'Unnamed PG'} - ₹${(pg.rent || 0).toLocaleString('en-IN')}/month</option>`;
            });
        }

        container.innerHTML = `
            <form id="feedbackFormModal" novalidate>
                <!-- PG Selector -->
                <div class="pg-select-wrapper mb-3">
                    <select id="pgSelectModal" required>
                        ${optionsHtml}
                    </select>
                    <small class="text-muted">Choose the PG you want to rate</small>
                </div>

                <!-- User Details -->
                <div class="row g-3">
                    <div class="col-md-6">
                        <div class="field-group">
                            <input type="text" id="fullNameModal" placeholder=" " required>
                            <label for="fullNameModal">Full Name *</label>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="field-group">
                            <input type="email" id="emailModal" placeholder=" " required>
                            <label for="emailModal">Email Address *</label>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="field-group">
                            <input type="tel" id="phoneModal" placeholder=" " required>
                            <label for="phoneModal">Phone Number *</label>
                        </div>
                    </div>
                </div>

                <hr class="my-3">

                <!-- Ratings -->
                <div id="ratingsContainerModal">
                    ${createRatingSlider('livingRatingModal', 'livingValueModal', 'Living Experience', 'bi-house-fill')}
                    ${createRatingSlider('maintenanceRatingModal', 'maintenanceValueModal', 'Maintenance Handling', 'bi-tools')}
                    ${createRatingSlider('communicationRatingModal', 'communicationValueModal', 'Communication', 'bi-chat-dots-fill')}
                    ${createRatingSlider('amenitiesRatingModal', 'amenitiesValueModal', 'Amenities', 'bi-grid-fill')}
                    ${createRatingSlider('technologyRatingModal', 'technologyValueModal', 'Technology Handling', 'bi-phone-fill')}
                </div>

                <!-- Overall Rating -->
                <div class="overall-rating-box mt-3">
                    <span class="label">🌟 Overall Rating</span>
                    <span class="value" id="overallRatingModal">5.0 / 10</span>
                </div>

                <!-- Comment -->
                <div class="field-group mt-3">
                    <textarea id="commentModal" placeholder=" "></textarea>
                    <label for="commentModal">Additional Comments (Optional)</label>
                </div>

                <button type="submit" class="btn-submit-feedback mt-3" id="submitBtnModal">
                    <i class="bi bi-send-fill me-2"></i>Submit Feedback
                </button>
            </form>
            <div id="feedbackSuccessModal" style="display:none;" class="feedback-success-state">
                <span class="icon">🎉</span>
                <h4>Thank You!</h4>
                <p>Your feedback has been submitted successfully. We appreciate your input!</p>
                <button class="btn btn-primary rounded-pill px-4 mt-2" onclick="closeFeedbackModal()">Close</button>
            </div>
        `;

        container.dataset.loaded = 'true';

        // Set up rating sliders
        document.querySelectorAll('#ratingsContainerModal .rating-slider').forEach(slider => {
            slider.addEventListener('input', updateRatingsModal);
        });

        // Set up form submission
        document.getElementById('feedbackFormModal').addEventListener('submit', handleFeedbackSubmit);

        // Update initial ratings
        updateRatingsModal();

    } catch (error) {
        console.error('Failed to load feedback form:', error);
        container.innerHTML = `
            <div class="text-center py-4">
                <i class="bi bi-exclamation-triangle fs-1" style="color: #e74c3c;"></i>
                <p class="mt-3">Failed to load feedback form. Please try again.</p>
                <button class="btn btn-primary rounded-pill px-4" onclick="loadFeedbackForm(document.getElementById('feedbackModalBody'))">Retry</button>
            </div>
        `;
    }
}

function createRatingSlider(id, displayId, label, iconClass) {
    return `
        <div class="rating-slider-container">
            <div class="rating-label">
                <span class="label"><i class="bi ${iconClass} me-2" style="color: var(--green);"></i>${label}</span>
                <span class="value" id="${displayId}">5.0</span>
            </div>
            <input type="range" class="rating-slider" id="${id}" min="0" max="10" step="0.5" value="5">
            <div class="rating-scale">
                <span>Poor</span>
                <span>Average</span>
                <span>Excellent</span>
            </div>
        </div>
    `;
}

function updateRatingsModal() {
    const ratings = [
        { id: 'livingRatingModal', display: 'livingValueModal' },
        { id: 'maintenanceRatingModal', display: 'maintenanceValueModal' },
        { id: 'communicationRatingModal', display: 'communicationValueModal' },
        { id: 'amenitiesRatingModal', display: 'amenitiesValueModal' },
        { id: 'technologyRatingModal', display: 'technologyValueModal' }
    ];

    let total = 0;
    let validCount = 0;
    ratings.forEach(r => {
        const slider = document.getElementById(r.id);
        const display = document.getElementById(r.display);
        if (slider && display) {
            const value = parseFloat(slider.value);
            display.textContent = value.toFixed(1);
            total += value;
            validCount++;
        }
    });

    const overall = validCount > 0 ? total / validCount : 0;
    const overallEl = document.getElementById('overallRatingModal');
    if (overallEl) {
        overallEl.textContent = overall.toFixed(1) + ' / 10';
    }
}

function showFeedbackToast(message, type = 'success') {
    const existing = document.querySelector('.feedback-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `feedback-toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

async function handleFeedbackSubmit(e) {
    e.preventDefault();

    const pgSelect = document.getElementById('pgSelectModal');
    const fullName = document.getElementById('fullNameModal');
    const email = document.getElementById('emailModal');
    const phone = document.getElementById('phoneModal');

    // Validate
    if (!pgSelect.value) {
        showFeedbackToast('Please select a PG.', 'warning');
        return;
    }
    if (!fullName.value.trim()) {
        showFeedbackToast('Please enter your full name.', 'warning');
        return;
    }
    if (!email.value.trim() || !email.value.includes('@')) {
        showFeedbackToast('Please enter a valid email address.', 'warning');
        return;
    }
    if (!phone.value.trim() || phone.value.trim().length < 5) {
        showFeedbackToast('Please enter a valid phone number.', 'warning');
        return;
    }

    const data = {
        pg_id: parseInt(pgSelect.value),
        full_name: fullName.value.trim(),
        email: email.value.trim(),
        phone: phone.value.trim(),
        living_experience_rating: parseFloat(document.getElementById('livingRatingModal').value || 5),
        maintenance_handling_rating: parseFloat(document.getElementById('maintenanceRatingModal').value || 5),
        communication_rating: parseFloat(document.getElementById('communicationRatingModal').value || 5),
        amenities_rating: parseFloat(document.getElementById('amenitiesRatingModal').value || 5),
        technology_handling_rating: parseFloat(document.getElementById('technologyRatingModal').value || 5),
        comment: document.getElementById('commentModal').value.trim() || null
    };

    const submitBtn = document.getElementById('submitBtnModal');
    submitBtn.disabled = true;
    submitBtn.classList.add('is-loading');

    try {
        const response = await fetch(`${API_BASE}/feedbacks/public/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            document.getElementById('feedbackFormModal').style.display = 'none';
            document.getElementById('feedbackSuccessModal').style.display = 'block';
            showFeedbackToast('Thank you for your feedback! 🎉', 'success');
        } else {
            showFeedbackToast(result.message || 'Failed to submit feedback. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Submit error:', error);
        showFeedbackToast('An error occurred. Please try again.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove('is-loading');
    }
}

function closeFeedbackModal() {
    const modal = document.getElementById('feedbackModal');
    if (modal) {
        const bsModal = bootstrap.Modal.getInstance(modal);
        if (bsModal) bsModal.hide();
    }
}

// ============================================================
// GLOBAL PAGE LOADING STATE
// ============================================================

function ensurePageLoader() {
    if (document.getElementById('globalPageLoader')) return;
    const loader = document.createElement('div');
    loader.id = 'globalPageLoader';
    loader.className = 'global-page-loader';
    loader.innerHTML = `
        <div class="global-loader-card">
            <div class="loader-mark"><i class="bi bi-key-fill"></i></div>
            <div class="spinner-border" role="status"></div>
            <span id="globalPageLoaderText">Loading...</span>
        </div>`;
    document.body.appendChild(loader);
}

function showPageLoading(message = 'Loading...') {
    ensurePageLoader();
    const loader = document.getElementById('globalPageLoader');
    const text = document.getElementById('globalPageLoaderText');
    if (text) text.textContent = message;
    requestAnimationFrame(() => loader.classList.add('is-visible'));
}

function hidePageLoading() {
    const loader = document.getElementById('globalPageLoader');
    if (loader) loader.classList.remove('is-visible');
}

function initNavigationLoading() {
    document.querySelectorAll('a[href]').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') ||
                href.startsWith('https://wa.me/') || this.target === '_blank' || href.startsWith('javascript:')) return;
            if (this.origin !== window.location.origin) return;
            showPageLoading('Loading page...');
        });
    });
}

// ============================================================
// MAIN INITIALIZATION
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
    ensurePageLoader();
    initNavbarScroll();
    initNavigationLoading();
    initChatbot();
    initHelpForm();
    initFeedbackModal();

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
    } else if (pageType === 'pg-details.html') {
        initPGDetailPage();
    }

    observeReveals();
});

window.filterPGs = filterPGs;
window.openDetailModal = openDetailModal;
window.openPGContactModal = openPGContactModal;
window.fetchAllPGs = fetchAllPGs;
window.loadFeedbackForm = loadFeedbackForm;
window.closeFeedbackModal = closeFeedbackModal;
// Hide transition loader when returning through browser back/forward cache.
window.addEventListener('pageshow', hidePageLoading);
