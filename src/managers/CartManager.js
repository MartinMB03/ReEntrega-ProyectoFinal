import Cart from "../models/Cart.js";

class CartManager {
    // Obtener todos los carritos
    async getAll() {
        try {
            const carts = await Cart.find();  // Buscar todos los carritos en MongoDB
            return carts;
        } catch (error) {
            throw new Error(`Error al obtener los carritos: ${error.message}`);
        }
    }

    // Obtener un carrito por ID
    async getOneById(id) {
        try {
            const cart = await Cart.findById(id);  // Buscar el carrito por su ID
            if (!cart) {
                throw new Error(`Carrito con ID ${id} no encontrado.`);
            }
            return cart;
        } catch (error) {
            throw new Error(`Error al obtener el carrito: ${error.message}`);
        }
    }

    // Crear un nuevo carrito
    async insertOne(cartData) {
        try {
            const newCart = new Cart(cartData);
            await newCart.save();
            return newCart;
        } catch (error) {
            throw new Error(`Error al crear el carrito: ${error.message}`);
        }
    }

    // Actualizar un carrito por ID
    async updateOneById(id, updatedCartData) {
        try {
            const cart = await Cart.findByIdAndUpdate(id, updatedCartData, { new: true });
            if (!cart) {
                throw new Error(`Carrito con ID ${id} no encontrado.`);
            }
            return cart;
        } catch (error) {
            throw new Error(`Error al actualizar el carrito: ${error.message}`);
        }
    }

    // Eliminar un carrito por ID
    async deleteOneById(id) {
        try {
            const cart = await Cart.findByIdAndDelete(id);
            if (!cart) {
                throw new Error(`Carrito con ID ${id} no encontrado.`);
            }
        } catch (error) {
            throw new Error(`Error al eliminar el carrito: ${error.message}`);
        }
    }

    // Agregar un producto a un carrito
    async addProductToCart(cartId, productId, quantity) {
        try {
            const cart = await Cart.findById(cartId);  // Buscar el carrito por ID
            if (!cart) {
                throw new Error(`Carrito con ID ${cartId} no encontrado.`);
            }

            // Buscar si el producto ya existe en el carrito
            const productIndex = cart.products.findIndex((item) => item.productId.toString() === productId);
            if (productIndex === -1) {
                // Si el producto no existe, lo agregamos con la cantidad indicada
                cart.products.push({ productId, quantity });
            } else {
                // Si el producto ya está en el carrito, solo sumamos la cantidad
                cart.products[productIndex].quantity += quantity;
            }

            await cart.save(); // Guardar el carrito actualizado
            return cart;
        } catch (error) {
            throw new Error(`Error al agregar el producto al carrito: ${error.message}`);
        }
    }

    // Eliminar un producto de un carrito
    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await Cart.findById(cartId); // Buscar el carrito por id
            if (!cart) {
                throw new Error(`Carrito con ID ${cartId} no encontrado.`);
            }

            // Buscar el índice del producto en el carrito
            const productIndex = cart.products.findIndex((item) => item.productId.toString() === productId);
            if (productIndex === -1) {
                throw new Error(`Producto con ID ${productId} no encontrado en el carrito.`);
            }

            // Eliminar el producto del carrito
            cart.products.splice(productIndex, 1);
            await cart.save();  // Guardar el carrito actualizado
            return cart;
        } catch (error) {
            throw new Error(`Error al eliminar el producto del carrito: ${error.message}`);
        }
    }
}

export default CartManager;