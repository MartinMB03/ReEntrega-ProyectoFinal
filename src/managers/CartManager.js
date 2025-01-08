import Cart from "../models/Cart.js";
import Product from "../models/Product.js"; // Asegúrate de que este modelo esté importado para usarlo en la validación de productos si es necesario

class CartManager {
    async getAll() {
        try {
            // Obtener todos los carritos
            const carts = await Cart.find().populate('products.productId');  // Usamos populate para obtener los detalles del producto
            return carts;
        } catch (error) {
            throw new Error(`Error al obtener los carritos: ${error.message}`);
        }
    }

    async getOneById(id) {
        try {
            // Obtener un carrito por su ID y realizar el populate
            const cart = await Cart.findById(id).populate('products.productId');
            if (!cart) {
                throw new Error(`Carrito con ID ${id} no encontrado.`);
            }
            return cart;
        } catch (error) {
            throw new Error(`Error al obtener el carrito: ${error.message}`);
        }
    }

    async insertOne(cartData) {
        try {
            const newCart = new Cart(cartData);
            await newCart.save();
            return newCart;
        } catch (error) {
            throw new Error(`Error al crear el carrito: ${error.message}`);
        }
    }

    async updateOneById(id, updatedCartData) {
        try {
            const cart = await Cart.findByIdAndUpdate(id, updatedCartData, { new: true }).populate('products.productId');
            if (!cart) {
                throw new Error(`Carrito con ID ${id} no encontrado.`);
            }
            return cart;
        } catch (error) {
            throw new Error(`Error al actualizar el carrito: ${error.message}`);
        }
    }

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

    async addProductToCart(cartId, productId, quantity) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error(`Carrito con ID ${cartId} no encontrado.`);
            }

            // Verificar si el producto ya está en el carrito
            const productIndex = cart.products.findIndex((item) => item.productId.toString() === productId);
            if (productIndex === -1) {
                cart.products.push({ productId, quantity });
            } else {
                // Si el producto ya está, aumentamos la cantidad
                cart.products[productIndex].quantity += quantity;
            }

            await cart.save();
            return cart;
        } catch (error) {
            throw new Error(`Error al agregar el producto al carrito: ${error.message}`);
        }
    }

    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error(`Carrito con ID ${cartId} no encontrado.`);
            }

            // Buscar el producto en el carrito
            const productIndex = cart.products.findIndex((item) => item.productId.toString() === productId);
            if (productIndex === -1) {
                throw new Error(`Producto con ID ${productId} no encontrado en el carrito.`);
            }

            // Eliminar el producto
            cart.products.splice(productIndex, 1);
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error(`Error al eliminar el producto del carrito: ${error.message}`);
        }
    }

    // Vaciar el carrito (eliminar todos los productos)
    async clearCart(cartId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error(`Carrito con ID ${cartId} no encontrado.`);
            }

            // Vaciar los productos del carrito
            cart.products = [];
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error(`Error al vaciar el carrito: ${error.message}`);
        }
    }

    // Actualizar la cantidad de un producto en el carrito
    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error(`Carrito con ID ${cartId} no encontrado.`);
            }

            // Buscar el producto en el carrito
            const productInCart = cart.products.find((item) => item.productId.toString() === productId);
            if (!productInCart) {
                throw new Error(`Producto con ID ${productId} no encontrado en el carrito.`);
            }

            // Actualizar la cantidad
            productInCart.quantity = quantity;
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error(`Error al actualizar la cantidad del producto: ${error.message}`);
        }
    }
}

export default CartManager;
