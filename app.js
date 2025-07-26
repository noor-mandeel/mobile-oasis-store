// متغير لتخزين عدد المنتجات
let cartItemsCount = 0;

// جميع أزرار "أضف إلى السلة"
const addToCartButtons = document.querySelectorAll('.add-to-cart');

// حدث النقر على الأزرار
addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        cartItemsCount++;
        updateCartCounter();
        
        // تأثير مرئي عند الإضافة (اختياري)
        button.textContent = 'تمت الإضافة!';
        setTimeout(() => {
            button.textContent = 'أضف إلى السلة';
        }, 1000);
    });
});

// تحديث العداد في الواجهة
function updateCartCounter() {
    const cartCount = document.querySelector('.cart-count');
    cartCount.textContent = cartItemsCount;
    
    // تأثير عند التغيير (اختياري)
    cartCount.classList.add('pulse');
    setTimeout(() => {
        cartCount.classList.remove('pulse');
    }, 300);
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200; // سرعة العد (كلما قل الرقم زادت السرعة)
    
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const increment = target / speed;
        
        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(animateCounters, 1);
        } else {
            counter.innerText = target.toLocaleString(); // تنسيق الأرقام
        }
    });
    
}

// تشغيل العد عند التمرير للقسم
window.addEventListener('scroll', () => {
    const statsSection = document.querySelector('.stats');
    const sectionPosition = statsSection.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.3;
    
    if (sectionPosition < screenPosition) {
        animateCounters();
    }
})
// توليد النجوم حسب التقييم
document.querySelectorAll('.rating').forEach(ratingEl => {
    const rating = parseFloat(ratingEl.getAttribute('data-rating'));
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            starsHtml += '★';
        } else if (i === fullStars + 1 && hasHalfStar) {
            starsHtml += '½';
        } else {
            starsHtml += '☆';
        }
    }
    ratingEl.innerHTML = starsHtml;
});

// نظام التقييم بالنقر
document.querySelectorAll('.star').forEach(star => {
    star.addEventListener('click', () => {
        const value = parseInt(star.getAttribute('data-value'));
        const stars = document.querySelectorAll('.star');
        
        stars.forEach((s, index) => {
            s.classList.toggle('active', index < value);
        });
    });
});

// إرسال التقييم
document.getElementById('review-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const stars = document.querySelectorAll('.star.active').length;
    const comment = e.target.querySelector('textarea').value;
    const name = e.target.querySelector('input').value;
    
    // هنا يمكنك إرسال البيانات للسيرفر أو عرضها مباشرة
    alert(`شكراً ${name} على تقييمك ${stars} نجوم!`);
    e.target.reset();
    document.querySelectorAll('.star').forEach(s => s.classList.remove('active'));
});

// تهيئة التقييمات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    loadReviews();
    setupStarRating();
    setupReviewForm();
});

// تحميل التقييمات من localStorage
function loadReviews() {
    const reviewsContainer = document.getElementById('reviews-container');
    const savedReviews = JSON.parse(localStorage.getItem('reviews')) || [];
    
    reviewsContainer.innerHTML = savedReviews.map(review => `
        <div class="review-card">
            <div class="reviewer-info">
                <img src="https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}" alt="${review.name}" class="reviewer-avatar">
                <div class="reviewer-name">
                    <h4>${review.name}</h4>
                    <div class="rating" data-rating="${review.rating}"></div>
                </div>
            </div>
            <p class="review-text">"${review.text}"</p>
            <span class="review-date">${new Date().toLocaleDateString('ar-EG')}</span>
        </div>
    `).join('');

    // توليد النجوم لكل تقييم
    document.querySelectorAll('.rating').forEach(generateStars);
}

// إعداد نظام النجوم
function setupStarRating() {
    const stars = document.querySelectorAll('.star');
    const ratingInput = document.getElementById('rating-value');
    
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const value = parseInt(star.getAttribute('data-value'));
            ratingInput.value = value;
            
            stars.forEach((s, idx) => {
                s.classList.toggle('active', idx < value);
            });
        });
    });
}

// إعداد نموذج الإرسال
function setupReviewForm() {
    const form = document.getElementById('review-form');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const rating = document.getElementById('rating-value').value;
        const text = document.getElementById('review-text').value;
        const name = document.getElementById('reviewer-name').value;
        
        if (rating === '0') {
            alert('الرجاء اختيار تقييم بالنجوم');
            return;
        }
        
        addNewReview({
            name,
            text,
            rating,
            date: new Date().toISOString()
        });
        
        form.reset();
        document.querySelectorAll('.star').forEach(s => s.classList.remove('active'));
    });
}

// إضافة تقييم جديد
function addNewReview(review) {
    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    reviews.unshift(review); // إضافة في البداية
    localStorage.setItem('reviews', JSON.stringify(reviews));
    
    // عرض التقييم الجديد فوراً
    const reviewsContainer = document.getElementById('reviews-container');
    reviewsContainer.insertAdjacentHTML('afterbegin', `
        <div class="review-card">
            <div class="reviewer-info">
                <img src="https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}" alt="${review.name}" class="reviewer-avatar">
                <div class="reviewer-name">
                    <h4>${review.name}</h4>
                    <div class="rating" data-rating="${review.rating}"></div>
                </div>
            </div>
            <p class="review-text">"${review.text}"</p>
            <span class="review-date">${new Date(review.date).toLocaleDateString('ar-EG')}</span>
        </div>
    `);
    
    // توليد النجوم للتقييم الجديد
    generateStars(reviewsContainer.querySelector('.rating'));
}

// توليد النجوم
function generateStars(ratingEl) {
    const rating = parseFloat(ratingEl.getAttribute('data-rating'));
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    ratingEl.innerHTML = '★'.repeat(fullStars) + 
                        (hasHalfStar ? '½' : '') + 
                        '☆'.repeat(5 - fullStars - (hasHalfStar ? 1 : 0));
}

