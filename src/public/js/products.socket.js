const socket = io();

const productsList = document.getElementById("products-list");
const productsForm = document.getElementById("products-form");
const inputProductId = document.getElementById("input-product-id");
const btnDeleteProduct = document.getElementById("btn-delete-product");
const errorMessage = document.getElementById("error-message");

socket.on("products-list", (data) => {
    const products = data.products ?? [];
    productsList.innerText = "";

    products.forEach((product) => {
        productsList.innerHTML += `<li>Id: ${product.id} - Nombre: ${product.title} - Precio: $${product.price}</li>`;
    });
});

// Escuchar el evento de enviar un producto nuevo
productsForm.onsubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    errorMessage.innerText = "";

    form.reset(); // Limpiar el formulario después de enviar

    // Emitir el evento al servidor para insertar un nuevo producto
    socket.emit("insert-product", {
        title: formData.get("title"),
        description: formData.get("description"),
        code: formData.get("code"),
        price: parseFloat(formData.get("price")),
        stock: parseInt(formData.get("stock")),
        category: formData.get("category"),
        thumbnails: formData.get("thumbnails") ? formData.get("thumbnails").split(",") : [],
    });
};

// Eliminar producto
btnDeleteProduct.onclick = () => {
    const id = Number(inputProductId.value); // Obtener el ID del producto a eliminar
    inputProductId.value = "";
    errorMessage.innerText = "";

    if (id > 0) {
        socket.emit("delete-product", { id });
    }
};

// Escuchar el mensaje de error
socket.on("error-message", (data) => {
    errorMessage.innerText = data.message;
});
