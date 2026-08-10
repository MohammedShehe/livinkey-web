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

// Function to render PG Cards
function renderPGCards(data, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    data.forEach(pg => {
        const statusClass = pg.status === 'vacant' ? 'status-vacant' : pg.status === 'partially' ? 'status-partial' : 'status-full';
        const statusText = pg.status === 'vacant' ? 'Vacant' : pg.status === 'partially' ? 'Partially Occupied' : 'Full Occupied';
        const stars = '★'.repeat(Math.floor(pg.rating)) + '☆'.repeat(5 - Math.floor(pg.rating));
        
        const col = document.createElement('div');
        col.className = 'col-lg-3 col-md-4 col-sm-6';
        col.innerHTML = `
            <div class="pg-card" data-id="${pg.id}">
                <img src="${pg.images[0] || 'https://placehold.co/600x400/92C24A/FFFFFF?text=No+Image'}" class="pg-card-img" alt="${pg.name}">
                <div class="p-3">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="fw-bold mb-0">${pg.name}</h5>
                        <span class="rating-badge">★ ${pg.rating}</span>
                    </div>
                    <p class="small text-muted mb-2"><i class="bi bi-geo-alt"></i> ${pg.location}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="pg-status ${statusClass}">${statusText}</span>
                        <span class="fw-bold text-success">₹${pg.rent}/mo</span>
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
        card.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            const pg = pgData.find(p => p.id === id);
            if (pg) openDetailModal(pg);
        });
    });
}

// Function to open detail modal
function openDetailModal(pg) {
    document.getElementById('detailPgName').textContent = pg.name;
    document.getElementById('detailLocation').textContent = pg.location;
    document.getElementById('detailRent').textContent = pg.rent;
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
        const div = document.createElement('div');
        div.className = 'mb-2 p-2 bg-light rounded';
        div.innerHTML = `<strong>${review.name}</strong><br><small>${review.comment}</small>`;
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

// Filter and search functionality
function filterPGs() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const amenityFilter = document.getElementById('amenityFilter')?.value || 'all';
    const occupancyFilter = document.getElementById('occupancyFilter')?.value || 'all';
    
    const filtered = pgData.filter(pg => {
        const matchSearch = pg.name.toLowerCase().includes(searchTerm) || 
                           pg.location.toLowerCase().includes(searchTerm);
        const matchAmenity = amenityFilter === 'all' || pg.amenities.includes(amenityFilter);
        const matchOccupancy = occupancyFilter === 'all' || pg.status === occupancyFilter;
        return matchSearch && matchAmenity && matchOccupancy;
    });
    
    renderPGCards(filtered, 'pgCardContainer');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Home page top 10
    if (document.getElementById('topPropertiesContainer')) {
        renderPGCards(pgData.slice(0, 10), 'topPropertiesContainer');
    }
    
    // PGs page
    if (document.getElementById('pgCardContainer')) {
        renderPGCards(pgData, 'pgCardContainer');
        
        // Search event listeners
        document.getElementById('searchBtn')?.addEventListener('click', filterPGs);
        document.getElementById('searchInput')?.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') filterPGs();
        });
        document.getElementById('amenityFilter')?.addEventListener('change', filterPGs);
        document.getElementById('occupancyFilter')?.addEventListener('change', filterPGs);
    }
    
    // Help form - WhatsApp redirect
    document.getElementById('helpForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = this.querySelector('input[placeholder="Your Name"]').value;
        const phone = this.querySelector('input[placeholder="Phone Number"]').value;
        const message = this.querySelector('textarea').value;
        const whatsappMsg = `Hi LIVINKEY!%0A%0AName: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0AMessage: ${encodeURIComponent(message)}`;
        window.open(`https://wa.me/919878383497?text=${whatsappMsg}`, '_blank');
    });
});