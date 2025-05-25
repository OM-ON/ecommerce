async function searchProducts() {
    let query = document.getElementById("searchInput").value.toLowerCase();
    if (query.length < 2) return;

    let response = await fetch("products.json");
    let products = await response.json();

    let resultDiv = document.getElementById("searchResults");
    resultDiv.innerHTML = "";

    let matchedProducts = products.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.category.toLowerCase().includes(query)
    );

    if (matchedProducts.length === 0) {
        resultDiv.innerHTML = "<p>No results found.</p>";
        return;
    }

    matchedProducts.forEach(product => {
        let item = document.createElement("div");
        item.innerHTML = `<a href="${product.page}">${product.name} (${product.category})</a>`;
        resultDiv.appendChild(item);
    });
}
