// Vietnamese Parking Booking Website JavaScript - Fixed Version

// Application data with detailed addresses including ward and alley information
const parkingData = {
  "parkingLots": [
    {
      "id": 1,
      "name": "Bãi để xe nhà chị Hằng",
      "address": "Hẻm 234 Đường Điện Biên Phủ, Phường 15",
      "location": "gần UEH",
      "rating": 4.8,
      "hours": "6AM-8PM",
      "bookings": 15,
      "price": "35.000đ/2h đầu"
    },
    {
      "id": 2,
      "name": "Sân nhà cô Linh",
      "address": "Hẻm 156 Đường Nguyễn Đình Chiểu, Phường Đa Kao",
      "location": "",
      "rating": 5.0,
      "hours": "7AM-5PM",
      "bookings": 8,
      "price": "35.000đ/2h đầu"
    },
    {
      "id": 3,
      "name": "Bãi để xe nhà chú Bình",
      "address": "Hẻm 89 Đường Pasteur, Phường Bến Nghé",
      "location": "",
      "rating": 4.6,
      "hours": "7AM-5PM",
      "bookings": 12,
      "price": "35.000đ/2h đầu"
    },
    {
      "id": 4,
      "name": "Bãi đỗ xe Xuân Lộc",
      "address": "Hẻm 456 Đường Võ Văn Tần, Phường 6",
      "location": "",
      "rating": 4.7,
      "hours": "6AM-10PM",
      "bookings": 20,
      "price": "35.000đ/2h đầu"
    }
  ],
  "pricing": {
    "standard": {
      "name": "Tiêu chuẩn",
      "first2Hours": 35000,
      "nextHours": 20000,
      "notes": "Bao gồm camera giám sát"
    },
    "premium": {
      "name": "Cao cấp",
      "first2Hours": 40000,
      "nextHours": 25000,
      "notes": "Camera, che nắng, garage"
    },
    "weekly": {
      "name": "Gói tuần",
      "first2Hours": 30000,
      "nextHours": 20000,
      "notes": "Trả trước 7 × 30.000đ"
    }
  },
  "serviceFee": 2000,
  "testimonials": [
    {
      "name": "Anh Nam Hải",
      "review": "Rất tiện lợi, tìm được chỗ đậu gần trường dễ dàng. Giá cả hợp lý và bãi xe an toàn.",
      "rating": 5
    },
    {
      "name": "Chị Minh Thư",
      "review": "Giá cả hợp lý, bãi xe an toàn có camera. Chủ bãi rất thân thiện và nhiệt tình.",
      "rating": 5
    },
    {
      "name": "Anh Tuấn Kiệt",
      "review": "Đặt chỗ nhanh chóng, chủ bãi thân thiện. Ứng dụng dễ sử dụng và tiện lợi.",
      "rating": 4
    },
    {
      "name": "Cô Lan Phương",
      "review": "Gói tuần rất tiết kiệm cho sinh viên như mình. Bãi xe sạch sẽ và có mái che.",
      "rating": 5
    }
  ]
};

// Global state
let currentBookingLot = null;
let currentTestimonialIndex = 0;
let testimonialAutoPlay = null;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Vietnamese Parking App initialized');
    
    // Initialize the application
    initializeApp();
    
    // Set up event listeners
    setupEventListeners();
    
    // Render parking lots
    renderParkingLots();
    
    // Initialize testimonials carousel
    initializeTestimonials();
    
    // Set default date for forms
    setDefaultDates();
});

// Initialize application
function initializeApp() {
    console.log('Initializing application...');
    
    // Initialize modal display states
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    });
    
    const successMessage = document.getElementById('success-message');
    if (successMessage) {
        successMessage.classList.add('hidden');
        successMessage.style.display = 'none';
    }
    
    console.log('Application initialized');
}

// Set up all event listeners
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Wait a bit to ensure DOM is fully ready
    setTimeout(() => {
        // Main action buttons with more robust selection
        setupMainActionButtons();
        
        // Navigation
        setupNavigation();
        
        // Modal controls
        setupModals();
        
        // Form submissions
        setupForms();
        
        // Testimonial carousel controls
        setupTestimonialControls();
        
        // Mobile navigation
        setupMobileNavigation();
        
        console.log('Event listeners setup complete');
    }, 100);
}

// Setup main action buttons with robust event handling
function setupMainActionButtons() {
    console.log('Setting up main action buttons...');
    
    // Find parking button - try multiple selectors
    const findParkingSelectors = ['#find-parking-btn', '.find-parking-btn', '[data-action="find-parking"]'];
    let findParkingBtn = null;
    
    for (const selector of findParkingSelectors) {
        findParkingBtn = document.querySelector(selector);
        if (findParkingBtn) break;
    }
    
    if (findParkingBtn) {
        console.log('Found find parking button:', findParkingBtn);
        
        // Remove any existing listeners
        const newBtn = findParkingBtn.cloneNode(true);
        findParkingBtn.parentNode.replaceChild(newBtn, findParkingBtn);
        
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Find parking button clicked - opening modal');
            openModal('find-parking-modal');
        });
        
        // Also add event delegation from parent
        document.body.addEventListener('click', function(e) {
            if (e.target.id === 'find-parking-btn' || e.target.matches('.btn[data-action="find-parking"]')) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Find parking button clicked via delegation');
                openModal('find-parking-modal');
            }
        });
        
        console.log('Find parking button listener attached');
    } else {
        console.error('Find parking button not found');
    }
    
    // Register parking button - try multiple selectors
    const registerParkingSelectors = ['#register-parking-btn', '.register-parking-btn', '[data-action="register-parking"]'];
    let registerParkingBtn = null;
    
    for (const selector of registerParkingSelectors) {
        registerParkingBtn = document.querySelector(selector);
        if (registerParkingBtn) break;
    }
    
    if (registerParkingBtn) {
        console.log('Found register parking button:', registerParkingBtn);
        
        // Remove any existing listeners
        const newBtn = registerParkingBtn.cloneNode(true);
        registerParkingBtn.parentNode.replaceChild(newBtn, registerParkingBtn);
        
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Register parking button clicked - opening modal');
            openModal('register-modal');
        });
        
        // Also add event delegation from parent
        document.body.addEventListener('click', function(e) {
            if (e.target.id === 'register-parking-btn' || e.target.matches('.btn[data-action="register-parking"]')) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Register parking button clicked via delegation');
                openModal('register-modal');
            }
        });
        
        console.log('Register parking button listener attached');
    } else {
        console.error('Register parking button not found');
    }
}

// Navigation setup
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    console.log(`Setting up ${navLinks.length} navigation links`);
    
    navLinks.forEach((link, index) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const href = this.getAttribute('href');
            console.log(`Nav link ${index} clicked: ${href}`);
            
            if (href && href.startsWith('#')) {
                scrollToSection(href.substring(1));
                closeMobileNav();
            }
        });
    });
}

// Modal setup
function setupModals() {
    console.log('Setting up modal controls');
    
    // Close buttons
    const closeButtons = document.querySelectorAll('.modal-close');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeAllModals();
        });
    });
    
    // Cancel buttons
    const cancelButtons = document.querySelectorAll('.cancel-btn');
    cancelButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeAllModals();
        });
    });
    
    // Modal overlays
    const overlays = document.querySelectorAll('.modal-overlay');
    overlays.forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeAllModals();
        });
    });
    
    // Escape key to close modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

// Form setup
function setupForms() {
    console.log('Setting up forms');
    
    // Search form
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSearchSubmit(e);
        });
    }
    
    // Booking form
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleBookingSubmit(e);
        });
        
        // Price calculation on changes
        const serviceTypeSelect = document.getElementById('service-type');
        const durationSelect = document.getElementById('booking-duration');
        
        if (serviceTypeSelect) {
            serviceTypeSelect.addEventListener('change', calculateBookingPrice);
        }
        
        if (durationSelect) {
            durationSelect.addEventListener('change', calculateBookingPrice);
        }
    }
    
    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRegisterSubmit(e);
        });
    }
    
    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactSubmit(e);
        });
    }
}

// Testimonial carousel setup
function setupTestimonialControls() {
    const prevBtn = document.getElementById('prev-testimonial');
    const nextBtn = document.getElementById('next-testimonial');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            prevTestimonial();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            nextTestimonial();
        });
    }
}

// Mobile navigation setup
function setupMobileNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMobileNav();
        });
        
        // Close nav when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                closeMobileNav();
            }
        });
    }
}

// Initialize testimonials carousel
function initializeTestimonials() {
    console.log('Initializing testimonials carousel');
    const testimonialTrack = document.getElementById('testimonial-track');
    const testimonialDots = document.getElementById('testimonial-dots');
    
    if (!testimonialTrack || !testimonialDots) return;
    
    // Create testimonial slides
    testimonialTrack.innerHTML = '';
    parkingData.testimonials.forEach((testimonial, index) => {
        const slide = document.createElement('div');
        slide.className = 'testimonial-slide';
        slide.innerHTML = `
            <div class="testimonial-content">
                <blockquote class="testimonial-quote">${testimonial.review}</blockquote>
                <div class="testimonial-rating">
                    ${generateStars(testimonial.rating)}
                </div>
            </div>
            <div class="testimonial-author">${testimonial.name}</div>
        `;
        testimonialTrack.appendChild(slide);
    });
    
    // Create dots
    testimonialDots.innerHTML = '';
    parkingData.testimonials.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'testimonial-dot';
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            goToTestimonial(index);
        });
        testimonialDots.appendChild(dot);
    });
    
    // Start auto-play
    startTestimonialAutoPlay();
    
    // Pause on hover
    const testimonialSection = document.querySelector('.testimonial-section');
    if (testimonialSection) {
        testimonialSection.addEventListener('mouseenter', stopTestimonialAutoPlay);
        testimonialSection.addEventListener('mouseleave', startTestimonialAutoPlay);
    }
    
    console.log('Testimonials carousel initialized');
}

function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<span class="testimonial-star">★</span>';
        } else {
            stars += '<span class="testimonial-star" style="opacity: 0.3;">★</span>';
        }
    }
    return stars;
}

function nextTestimonial() {
    currentTestimonialIndex = (currentTestimonialIndex + 1) % parkingData.testimonials.length;
    updateTestimonialDisplay();
}

function prevTestimonial() {
    currentTestimonialIndex = currentTestimonialIndex === 0 
        ? parkingData.testimonials.length - 1 
        : currentTestimonialIndex - 1;
    updateTestimonialDisplay();
}

function goToTestimonial(index) {
    currentTestimonialIndex = index;
    updateTestimonialDisplay();
}

function updateTestimonialDisplay() {
    const testimonialTrack = document.getElementById('testimonial-track');
    const dots = document.querySelectorAll('.testimonial-dot');
    
    if (!testimonialTrack) return;
    
    // Move track
    const translateX = -currentTestimonialIndex * 100;
    testimonialTrack.style.transform = `translateX(${translateX}%)`;
    
    // Update dots
    dots.forEach((dot, index) => {
        if (index === currentTestimonialIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prev-testimonial');
    const nextBtn = document.getElementById('next-testimonial');
    
    if (prevBtn) {
        prevBtn.disabled = false;
    }
    
    if (nextBtn) {
        nextBtn.disabled = false;
    }
}

function startTestimonialAutoPlay() {
    stopTestimonialAutoPlay();
    testimonialAutoPlay = setInterval(nextTestimonial, 4000);
}

function stopTestimonialAutoPlay() {
    if (testimonialAutoPlay) {
        clearInterval(testimonialAutoPlay);
        testimonialAutoPlay = null;
    }
}

// Render parking lots with detailed addresses
function renderParkingLots() {
    console.log('Rendering parking lots with detailed addresses');
    const parkingGrid = document.getElementById('parking-grid');
    if (!parkingGrid) return;
    
    parkingGrid.innerHTML = '';
    
    parkingData.parkingLots.forEach(lot => {
        const card = createParkingCard(lot);
        parkingGrid.appendChild(card);
    });
    
    console.log('Parking lots rendered with detailed addresses');
}

// Create parking card element with full address display
function createParkingCard(lot) {
    const card = document.createElement('div');
    card.className = 'parking-card';
    card.setAttribute('data-lot-id', lot.id);
    
    const stars = '★'.repeat(Math.floor(lot.rating)) + (lot.rating % 1 >= 0.5 ? '☆' : '');
    
    // Display full address with ward and alley information
    const fullAddress = lot.address + (lot.location ? `, ${lot.location}` : '');
    
    card.innerHTML = `
        <div class="parking-card-header">
            <h3 class="parking-name">${lot.name}</h3>
            <div class="parking-rating">
                <span class="stars">${stars}</span>
                <span>${lot.rating}</span>
            </div>
        </div>
        <div class="parking-info">
            <div class="parking-location" title="${fullAddress}">${fullAddress}</div>
            <div class="parking-hours">Giờ hoạt động: ${lot.hours}</div>
        </div>
        <div class="parking-stats">
            <span class="booking-count">${lot.bookings} người đã đặt</span>
            <span class="parking-price">${lot.price}</span>
        </div>
    `;
    
    card.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Parking card clicked:', lot.name);
        openBookingModal(lot);
    });
    
    return card;
}

// Modal functions with better error handling
function openModal(modalId) {
    console.log('Opening modal:', modalId);
    closeAllModals();
    
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Focus first input
        setTimeout(() => {
            const firstInput = modal.querySelector('input, select, textarea');
            if (firstInput) {
                firstInput.focus();
            }
        }, 100);
        
        console.log('Modal opened successfully:', modalId);
    } else {
        console.error('Modal not found:', modalId);
        // Try to find modal with alternative selectors
        const modalAlternative = document.querySelector(`.modal[data-modal="${modalId}"]`);
        if (modalAlternative) {
            modalAlternative.classList.remove('hidden');
            modalAlternative.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            console.log('Modal opened via alternative selector:', modalId);
        }
    }
}

function closeAllModals() {
    console.log('Closing all modals');
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    });
    document.body.style.overflow = '';
    
    // Reset forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.reset();
        clearValidationErrors(form);
    });
    
    // Hide search results
    const searchResults = document.getElementById('search-results');
    if (searchResults) {
        searchResults.classList.add('hidden');
    }
}

function openBookingModal(lot) {
    console.log('Opening booking modal for:', lot.name);
    currentBookingLot = lot;
    
    // Populate booking details with full address
    const bookingDetails = document.getElementById('booking-details');
    if (bookingDetails) {
        const stars = '★'.repeat(Math.floor(lot.rating)) + (lot.rating % 1 >= 0.5 ? '☆' : '');
        const fullAddress = lot.address + (lot.location ? `, ${lot.location}` : '');
        
        bookingDetails.innerHTML = `
            <div class="booking-lot-name">${lot.name}</div>
            <div class="booking-lot-info">
                <div class="parking-rating">
                    <span class="stars">${stars}</span>
                    <span>${lot.rating} • ${lot.bookings} người đã đặt</span>
                </div>
            </div>
            <div class="booking-lot-info">${fullAddress}</div>
            <div class="booking-lot-info">Giờ hoạt động: ${lot.hours}</div>
        `;
    }
    
    openModal('booking-modal');
    calculateBookingPrice();
}

// Form handlers (keeping existing functionality)
function handleSearchSubmit(e) {
    console.log('Search form submitted');
    
    const formData = getFormData(e.target);
    if (!validateSearchForm(formData)) return;
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Đang tìm kiếm...';
    submitBtn.disabled = true;
    
    // Simulate search delay
    setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Show search results
        showSearchResults(formData);
        console.log('Search completed');
    }, 1000);
}

function handleBookingSubmit(e) {
    console.log('Booking form submitted');
    
    const formData = getFormData(e.target);
    if (!validateBookingForm(formData)) return;
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Đang xử lý...';
    submitBtn.disabled = true;
    
    // Simulate booking process
    setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        closeAllModals();
        showSuccessMessage(
            'Đặt chỗ thành công!',
            `Bạn đã đặt chỗ tại ${currentBookingLot.name}. Chúng tôi sẽ gửi email xác nhận trong vài phút.`
        );
        console.log('Booking completed');
    }, 1500);
}

function handleRegisterSubmit(e) {
    console.log('Register form submitted');
    
    const formData = getFormData(e.target);
    if (!validateRegisterForm(formData)) return;
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Đang đăng ký...';
    submitBtn.disabled = true;
    
    // Simulate registration process
    setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        closeAllModals();
        showSuccessMessage(
            'Đăng ký thành công!',
            'Chúng tôi sẽ xem xét thông tin và liên hệ với bạn trong vòng 24 giờ.'
        );
        console.log('Registration completed');
    }, 2000);
}

function handleContactSubmit(e) {
    console.log('Contact form submitted');
    
    const formData = getFormData(e.target);
    if (!validateContactForm(formData)) return;
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Đang gửi...';
    submitBtn.disabled = true;
    
    // Simulate sending
    setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        e.target.reset();
        clearValidationErrors(e.target);
        showSuccessMessage(
            'Gửi tin nhắn thành công!',
            'Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.'
        );
        console.log('Contact form sent');
    }, 1000);
}

// Show search results with full addresses
function showSearchResults(searchData) {
    const searchResults = document.getElementById('search-results');
    const resultsList = document.getElementById('results-list');
    
    if (!searchResults || !resultsList) return;
    
    // Filter parking lots based on search (simplified)
    const results = parkingData.parkingLots.filter(lot => 
        lot.address.toLowerCase().includes(searchData.searchLocation.toLowerCase()) ||
        lot.name.toLowerCase().includes(searchData.searchLocation.toLowerCase()) ||
        (lot.location && lot.location.toLowerCase().includes(searchData.searchLocation.toLowerCase()))
    );
    
    if (results.length === 0) {
        resultsList.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary);">Không tìm thấy bãi đỗ xe phù hợp.</p>';
    } else {
        resultsList.innerHTML = results.map(lot => {
            const fullAddress = lot.address + (lot.location ? `, ${lot.location}` : '');
            return `
                <div class="result-item" data-lot-id="${lot.id}">
                    <div class="result-name">${lot.name}</div>
                    <div class="result-details">
                        <span title="${fullAddress}">${fullAddress}</span>
                        <span class="result-price">${lot.price}</span>
                    </div>
                </div>
            `;
        }).join('');
        
        // Add click handlers to results
        resultsList.querySelectorAll('.result-item').forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const lotId = parseInt(this.getAttribute('data-lot-id'));
                const lot = parkingData.parkingLots.find(l => l.id === lotId);
                if (lot) {
                    closeAllModals();
                    setTimeout(() => openBookingModal(lot), 300);
                }
            });
        });
    }
    
    searchResults.classList.remove('hidden');
}

// Price calculation (keeping existing functionality)
function calculateBookingPrice() {
    const serviceTypeSelect = document.getElementById('service-type');
    const durationSelect = document.getElementById('booking-duration');
    const priceAmount = document.getElementById('price-amount');
    
    if (!serviceTypeSelect || !durationSelect || !priceAmount) return;
    
    const serviceType = serviceTypeSelect.value;
    const duration = parseInt(durationSelect.value) || 0;
    
    if (!serviceType || duration === 0) {
        priceAmount.textContent = '0đ';
        return;
    }
    
    const pricingInfo = parkingData.pricing[serviceType];
    if (!pricingInfo) {
        priceAmount.textContent = '0đ';
        return;
    }
    
    let totalPrice = 0;
    
    if (duration <= 2) {
        // First 2 hours or less
        totalPrice = pricingInfo.first2Hours;
    } else {
        // First 2 hours + additional hours
        totalPrice = pricingInfo.first2Hours + ((duration - 2) * pricingInfo.nextHours);
    }
    
    // Add service fee
    totalPrice += parkingData.serviceFee;
    
    priceAmount.textContent = formatVietnamesePrice(totalPrice);
}

// Validation functions (keeping existing functionality)
function validateSearchForm(data) {
    const errors = {};
    
    if (!data.searchLocation || !data.searchLocation.trim()) {
        errors.searchLocation = 'Vui lòng nhập địa điểm';
    }
    
    if (!data.searchDate) {
        errors.searchDate = 'Vui lòng chọn ngày';
    }
    
    if (!data.searchTime) {
        errors.searchTime = 'Vui lòng chọn giờ bắt đầu';
    }
    
    if (!data.searchDuration) {
        errors.searchDuration = 'Vui lòng chọn giờ kết thúc';
    }
    
    return displayValidationErrors('search-form', errors);
}

function validateBookingForm(data) {
    const errors = {};
    
    if (!data.serviceType) {
        errors.serviceType = 'Vui lòng chọn loại dịch vụ';
    }
    
    if (!data.bookingDate) {
        errors.bookingDate = 'Vui lòng chọn ngày đỗ xe';
    }
    
    if (!data.bookingStartTime) {
        errors.bookingStartTime = 'Vui lòng chọn giờ bắt đầu';
    }
    
    if (!data.bookingDuration) {
        errors.bookingDuration = 'Vui lòng chọn thời gian đỗ xe';
    }
    
    if (!data.customerName || !data.customerName.trim()) {
        errors.customerName = 'Vui lòng nhập họ tên';
    }
    
    if (!data.customerPhone || !data.customerPhone.trim()) {
        errors.customerPhone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9+\-\s\(\)]{8,15}$/.test(data.customerPhone.trim())) {
        errors.customerPhone = 'Số điện thoại không hợp lệ';
    }
    
    if (!data.customerEmail || !data.customerEmail.trim()) {
        errors.customerEmail = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.customerEmail.trim())) {
        errors.customerEmail = 'Email không hợp lệ';
    }
    
    if (!data.vehicleInfo || !data.vehicleInfo.trim()) {
        errors.vehicleInfo = 'Vui lòng nhập thông tin xe';
    }
    
    if (!data.paymentMethod) {
        errors.paymentMethod = 'Vui lòng chọn phương thức thanh toán';
    }
    
    return displayValidationErrors('booking-form', errors);
}

function validateRegisterForm(data) {
    const errors = {};
    
    if (!data.ownerName || !data.ownerName.trim()) {
        errors.ownerName = 'Vui lòng nhập họ tên';
    }
    
    if (!data.ownerPhone || !data.ownerPhone.trim()) {
        errors.ownerPhone = 'Vui lòng nhập số điện thoại';
    }
    
    if (!data.ownerEmail || !data.ownerEmail.trim()) {
        errors.ownerEmail = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.ownerEmail.trim())) {
        errors.ownerEmail = 'Email không hợp lệ';
    }
    
    if (!data.parkingName || !data.parkingName.trim()) {
        errors.parkingName = 'Vui lòng nhập tên bãi đỗ xe';
    }
    
    if (!data.parkingAddress || !data.parkingAddress.trim()) {
        errors.parkingAddress = 'Vui lòng nhập địa chỉ';
    }
    
    if (!data.parkingCapacity || data.parkingCapacity < 1) {
        errors.parkingCapacity = 'Vui lòng nhập số chỗ đỗ hợp lệ';
    }
    
    if (!data.parkingPrice || data.parkingPrice < 1000) {
        errors.parkingPrice = 'Vui lòng nhập giá thuê hợp lệ (tối thiểu 1.000 VND)';
    }
    
    if (!data.parkingOpen) {
        errors.parkingOpen = 'Vui lòng chọn giờ mở cửa';
    }
    
    if (!data.parkingClose) {
        errors.parkingClose = 'Vui lòng chọn giờ đóng cửa';
    }
    
    return displayValidationErrors('register-form', errors);
}

function validateContactForm(data) {
    const errors = {};
    
    if (!data.contactName || !data.contactName.trim()) {
        errors.contactName = 'Vui lòng nhập họ tên';
    }
    
    if (!data.contactEmail || !data.contactEmail.trim()) {
        errors.contactEmail = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail.trim())) {
        errors.contactEmail = 'Email không hợp lệ';
    }
    
    if (!data.contactMessage || !data.contactMessage.trim()) {
        errors.contactMessage = 'Vui lòng nhập tin nhắn';
    } else if (data.contactMessage.trim().length < 10) {
        errors.contactMessage = 'Tin nhắn quá ngắn (tối thiểu 10 ký tự)';
    }
    
    return displayValidationErrors('contact-form', errors);
}

// Utility functions (keeping existing functionality)
function getFormData(form) {
    const data = {};
    
    // Get all form inputs
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (input.id) {
            data[input.id.replace(/-([a-z])/g, (g) => g[1].toUpperCase())] = input.value;
        }
    });
    
    return data;
}

function displayValidationErrors(formId, errors) {
    const form = document.getElementById(formId);
    if (!form) return Object.keys(errors).length === 0;
    
    // Clear previous errors
    clearValidationErrors(form);
    
    // Display new errors
    Object.keys(errors).forEach(fieldName => {
        const field = form.querySelector(`#${fieldName.replace(/([A-Z])/g, '-$1').toLowerCase()}`);
        if (field) {
            field.classList.add('error');
            
            const errorElement = document.createElement('div');
            errorElement.className = 'form-error';
            errorElement.textContent = errors[fieldName];
            
            field.parentNode.appendChild(errorElement);
        }
    });
    
    return Object.keys(errors).length === 0;
}

function clearValidationErrors(form) {
    const errorElements = form.querySelectorAll('.form-error');
    errorElements.forEach(error => error.remove());
    
    const inputElements = form.querySelectorAll('.form-control.error');
    inputElements.forEach(input => input.classList.remove('error'));
}

function formatVietnamesePrice(price) {
    return parseInt(price).toLocaleString('vi-VN') + 'đ';
}

function scrollToSection(sectionId) {
    console.log('Scrolling to section:', sectionId);
    const section = document.getElementById(sectionId);
    if (section) {
        const header = document.querySelector('.header');
        const headerHeight = header ? header.offsetHeight : 80;
        const targetPosition = section.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        console.log('Scrolled to section:', sectionId);
    } else {
        console.warn('Section not found:', sectionId);
    }
}

function toggleMobileNav() {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    
    if (navMenu && navToggle) {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
}

function closeMobileNav() {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    
    if (navMenu && navToggle) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function showSuccessMessage(title, message) {
    const successMessage = document.getElementById('success-message');
    const successTitle = document.getElementById('success-title');
    const successText = document.getElementById('success-text');
    
    if (successMessage && successTitle && successText) {
        successTitle.textContent = title;
        successText.textContent = message;
        
        successMessage.classList.remove('hidden');
        successMessage.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Auto hide after 4 seconds
        setTimeout(() => {
            successMessage.classList.add('hidden');
            successMessage.style.display = 'none';
            document.body.style.overflow = '';
        }, 4000);
        
        // Click to close
        successMessage.onclick = function() {
            successMessage.classList.add('hidden');
            successMessage.style.display = 'none';
            document.body.style.overflow = '';
        };
    }
}

function setDefaultDates() {
    const today = new Date();
    const dateInputs = document.querySelectorAll('input[type="date"]');
    
    dateInputs.forEach(input => {
        input.min = today.toISOString().split('T')[0];
        if (!input.value) {
            input.value = today.toISOString().split('T')[0];
        }
    });
    
    const timeInputs = document.querySelectorAll('input[type="time"]');
    timeInputs.forEach(input => {
        if (!input.value) {
            input.value = '08:00';
        }
    });
}

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (header) {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.boxShadow = '0 2px 10px rgba(59, 130, 246, 0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
    }
});

// Form field error clearing on input
document.addEventListener('input', function(e) {
    if (e.target.classList.contains('error')) {
        e.target.classList.remove('error');
        const errorElement = e.target.parentNode.querySelector('.form-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
});

// Global functions for backwards compatibility
window.scrollToSection = scrollToSection;