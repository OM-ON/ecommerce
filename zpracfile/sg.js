document.querySelectorAll('.wishlist').forEach(button => {
    button.addEventListener('click', function() {
        this.classList.toggle('clicked');
    });
})
      // JavaScript code to handle product interactions
        
      const products = document.querySelectorAll(".product");

      products.forEach((product) => {
        // Add click event listener to each product's "Add to Cart" button
        const addToCartButton = product.querySelector(".add-to-cart");
        addToCartButton.addEventListener("click", () => {
          // Handle adding to cart logic here (e.g., update cart counter, display message)
          console.log(
            "Adding to Cart:",
            product.querySelector(".title").textContent
          );
        });
      });

      // Add hover effect to badges
      const badges = document.querySelectorAll(".badge");

      badges.forEach((badge) => {
        badge.addEventListener("mouseover", () => {
          badge.style.transform = "scale(1.1)";
        });
        badge.addEventListener("mouseout", () => {
          badge.style.transform = "scale(1)";
        });
      });