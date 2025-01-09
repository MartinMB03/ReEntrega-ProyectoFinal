const socket = io();

const productsList = document.getElementById("products-list");
const productsForm = document.getElementById("products-form");
const inputProductId = document.getElementById("input-product-id");
const btnDeleteProduct = document.getElementById("btn-delete-product");
const errorMessage = document.getElementById("error-message");

socket.on("products-list", (data) => {
    const products = data.products ?? [];
    productsList.innerHTML = "";
    if (products.length === 0) {
        productsList.innerHTML = "<li>No hay productos disponibles.</li>";
    } else {
        products.forEach((product) => {
            productsList.innerHTML += `
                <li>
                    Id: ${product.id} - Nombre: ${product.title} - Precio: $${product.price} 
                </li>
            `;
        });
    }
});

productsForm.onsubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    errorMessage.innerText = "";

    const title = formData.get("title");
    const description = formData.get("description");
    const code = formData.get("code");
    const price = parseFloat(formData.get("price"));
    const stock = parseInt(formData.get("stock"));
    const category = formData.get("category");
    const thumbnails = formData.get("thumbnails") ? formData.get("thumbnails").split(",") : [];

    if (!title || !description || !code || isNaN(price) || isNaN(stock) || !category) {
        errorMessage.innerText = "Todos los campos son requeridos y los valores deben ser válidos.";
        return;
    }

    form.reset();

    socket.emit("insert-product", {
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnails,
    });
};

btnDeleteProduct.onclick = () => {
    const id = Number(inputProductId.value);
    inputProductId.value = "";
    errorMessage.innerText = "";

    if (id <= 0) {
        errorMessage.innerText = "Por favor, ingrese un ID de producto válido.";
        return;
    }

    socket.emit("delete-product", { id });
};

socket.on("error-message", (data) => {
    errorMessage.innerText = data.message;
});

socket.on("connect_error", (error) => {
    errorMessage.innerText = `Error de conexión: ${error.message}`;
});