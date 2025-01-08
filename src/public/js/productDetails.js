document.getElementById("add-to-cart-btn").addEventListener("click", async () => {
    const productId = document.getElementById("add-to-cart-btn").getAttribute("data-product-id");
    const response = await fetch(`/api/carts/1/products/${productId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const result = await response.json();
    if (result.status === "success") {
        alert("Producto agregado al carrito");
    } else {
        alert("Error al agregar el producto");
    }
});
