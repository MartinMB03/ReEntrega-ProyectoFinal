function addToCart(cartId, productId, quantity) {
    fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity })
    })
    .then(response => response.json())
    .then(data => {
        updateCartUI(data);
    })
    .catch(error => {
        console.error('Error al agregar el producto:', error);
    });
}

function removeFromCart(cartId, productId) {
    fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        updateCartUI(data);
    })
    .catch(error => {
        console.error('Error al eliminar el producto:', error);
    });
}

function updateCartUI(cartData) {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartData.totalProducts || 0;
    }
}

document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', () => {
        const productId = button.dataset.productId;
        const cartId = document.getElementById('cart-id').value;
        const quantity = 1;
        addToCart(cartId, productId, quantity);
    });
});

document.querySelectorAll('.remove-from-cart-btn').forEach(button => {
    button.addEventListener('click', () => {
        const productId = button.dataset.productId;
        const cartId = document.getElementById('cart-id').value;
        removeFromCart(cartId, productId);
    });
});
