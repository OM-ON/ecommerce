document.addEventListener('DOMContentLoaded', () => {
    const reviewForm = document.getElementById('review-form');
    const reviewsContainer = document.getElementById('reviews');
    const ratingBarsContainer = document.getElementById('rating-bars');

    let reviews = [];
    const ratingsCount = [0, 0, 0, 0, 0]; // Stores the count of each rating from 1 to 5

    reviewForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const rating = parseInt(document.getElementById('rating').value);
        const reviewText = document.getElementById('review').value;
        const imageInput = document.getElementById('image');
        let imageUrl = '';

        if (imageInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = function(event) {
                imageUrl = event.target.result;
                addReview(rating, reviewText, imageUrl);
            }
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            addReview(rating, reviewText, imageUrl);
        }

        reviewForm.reset();
    });

    function addReview(rating, reviewText, imageUrl) {
        reviews.push({ rating, reviewText, imageUrl });
        ratingsCount[rating - 1]++;
        displayReviews();
        displayRatingSummary();
    }

    function displayReviews() {
        reviewsContainer.innerHTML = reviews.map(review => `
            <div class="review">
                <p>Rating: ${review.rating}★</p>
                <p>${review.reviewText}</p>
                ${review.imageUrl ? `<img src="${review.imageUrl}" alt="Review image">` : ''}
            </div>
        `).join('');
    }

    function displayRatingSummary() {
        const totalReviews = reviews.length;
        ratingBarsContainer.innerHTML = ratingsCount.map((count, index) => {
            const percentage = totalReviews ? (count / totalReviews) * 100 : 0;
            return `
                <div class="rating-bar">
                    <span>${index + 1}★:</span>
                    <div class="bar" style="width: ${percentage}%"></div>
                    <span>${count}</span>
                </div>
            `;
        }).join('');
    }
});
