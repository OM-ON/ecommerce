// let slideIndex = 0;
// showSlides();

// function showSlides() {
//   let i;
//   let slides = document.getElementsByClassName("mySlides");
//   let dots = document.getElementsByClassName("dot");
//   for (i = 0; i < slides.length; i++) {
//     slides[i].style.display = "none";  
//   }
//   for (i = 0; i < dots.length; i++) {
//     dots[i].className = dots[i].className.replace(" active", "");
//   }
//   slideIndex++;
//   if (slideIndex > slides.length) {slideIndex = 1}    
//   slides[slideIndex-1].style.display = "block";  
//   dots[slideIndex-1].className += " active";
//   setTimeout(showSlides, 2000); // Change image every 2 seconds
// }

// function currentSlide(n) {
//   slideIndex = n;
//   showSlides();
// }

// function showProduct(productId) {
//     // Hide all product details
//     var productDetails = document.querySelectorAll('.product-detail');
//     productDetails.forEach(function(detail) {
//         detail.style.display = 'none';
//     });
    
//     // Hide the thumbnails
//     document.querySelector('.product-container').style.display = 'none';

//     // Show the selected product detail
//     document.getElementById(productId).style.display = 'block';
// }

// function showThumbnails() {
//     // Hide all product details
//     var productDetails = document.querySelectorAll('.product-detail');
//     productDetails.forEach(function(detail) {
//         detail.style.display = 'none';
//     });

//     // Show the thumbnails
//     document.querySelector('.product-container').style.display = 'flex';
// }
// // search bar
// const searchInput = document.getElementById('searchInput');
// const dealsContainer = document.getElementById('dealsContainer');
// const dealItems = document.querySelectorAll('.deal-item');

// searchInput.addEventListener('input', function() {
//     const searchValue = searchInput.value.toLowerCase();

//     dealItems.forEach(item => {
//         const product = item.getAttribute('data-product').toLowerCase();

//         if (product.includes(searchValue)) {
//             item.style.display = 'block'; // Show the item if it matches the search
//         } else {
//             item.style.display = 'none'; // Hide the item if it doesn't match
//         }
//     });
// });
document.addEventListener("DOMContentLoaded", function () {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    updateWishlistCount();
    updateWishlistButtons();

    document.querySelectorAll(".wishlist-btn").forEach(button => {
        button.addEventListener("click", function () {
            let productCard = this.closest(".product-card");
            let productId = productCard.getAttribute("data-id");
            let productName = productCard.getAttribute("data-name");
            let productImage = productCard.getAttribute("data-image");

            let existingProduct = wishlist.find(item => item.id === productId);
            if (!existingProduct) {
                wishlist.push({ id: productId, name: productName, image: productImage });
                this.classList.add("active");
                showNotification("❤️ Added to Wishlist!", "pink");
            } else {
                wishlist = wishlist.filter(item => item.id !== productId);
                this.classList.remove("active");
                showNotification("❌ Removed from Wishlist!", "red");
            }

            localStorage.setItem("wishlist", JSON.stringify(wishlist));
            updateWishlistCount();
            renderWishlist();
        });
    });

    document.getElementById("wishlist-icon").addEventListener("click", function () {
        document.getElementById("wishlist-popup").classList.toggle("show");
        renderWishlist();
    });

    document.getElementById("close-wishlist").addEventListener("click", function () {
        document.getElementById("wishlist-popup").classList.remove("show");
    });

    function updateWishlistCount() {
        document.getElementById("wishlist-count").textContent = wishlist.length;
    }
    document.getElementById("close-wishlist").addEventListener("click", function () {
document.getElementById("wishlist-popup").classList.remove("show");
});

    function renderWishlist() {
        let wishlistContainer = document.getElementById("wishlist-items");
        wishlistContainer.innerHTML = wishlist.length === 0 
            ? "<p>Your wishlist is empty.</p>" 
            : wishlist.map(item => `<div><img src="${item.image}" alt="${item.name}"> <span>${item.name}</span></div>`).join("");
    }

    function showNotification(message, color) {
        let notification = document.getElementById("notification");
        notification.textContent = message;
        notification.style.backgroundColor = color;
        notification.classList.add("show");
        setTimeout(() => notification.classList.remove("show"), 2000);
    }

    function updateWishlistButtons() {
        document.querySelectorAll(".wishlist-btn").forEach(button => {
            let productId = button.closest(".product-card").getAttribute("data-id");
            if (wishlist.some(item => item.id === productId)) {
                button.classList.add("active");
            } else {
                button.classList.remove("active");
            }
        });
    }
});
let notificationTimeout; // Store timeout reference

function showNotification(message, color) {
let notification = document.createElement("div"); // Create new notification
notification.className = "notification-message"; // Add class
notification.textContent = message;
notification.style.background = color;

// Append to body
document.body.appendChild(notification);

// Show notification smoothly
setTimeout(() => {
notification.classList.add("show");
}, 100); 

// Remove notification after 2 seconds
setTimeout(() => {
notification.classList.remove("show");
setTimeout(() => {
    notification.remove(); // Remove from DOM after fade out
}, 500);
}, 2000);
}

// responsive
function openSidebar() {
    document.getElementById("sidebar").style.left = "0";
}

function closeSidebar() {
    document.getElementById("sidebar").style.left = "-250px";
}
