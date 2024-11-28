import { writeJsonFile, readJsonFile } from "../utils/fileHandler.js";
import paths from "../utils/paths.js";
import { generateId } from "../utils/collectionHandler.js";

class CartManager {
    constructor() {
        this.cartFilePath = paths.files + "../files/cart.json"; // Ruta del archivo JSON de carritos
    }

    async getAll() {
        try {
            const carts = await readJsonFile(paths.files, "cart.json");
            return carts;
        } catch (error) {
            throw new Error(`Error al obtener los carritos: ${error.message}`);
        }
    }

    // Obtiene un carrito por ID
    async getOneById(id) {
        try {
            const carts = await readJsonFile(paths.files, "cart.json");
            const cart = carts.find(cart => cart.id === id);
            if (!cart) {
                throw new Error(`Carrito con ID ${id} no encontrado.`);
            }
            return cart;
        } catch (error) {
            throw new Error(`Error al obtener el carrito: ${error.message}`);
        }
    }

    // Crea un nuevo carrito
    async insertOne(cartData) {
        try {
            const carts = await readJsonFile(paths.files, "cart.json");
            const newCart = { id: generateId(carts), ...cartData };
            carts.push(newCart);
            await writeJsonFile(paths.files, "cart.json", carts);
            return newCart;
        } catch (error) {
            throw new Error(`Error al crear el carrito: ${error.message}`);
        }
    }

    // Actualiza un carrito por ID
    async updateOneById(id, updatedCartData) {
        try {
            const carts = await readJsonFile(paths.files, "cart.json");
            const cartIndex = carts.findIndex(cart => cart.id === id);
            if (cartIndex === -1) {
                throw new Error(`Carrito con ID ${id} no encontrado.`);
            }
            carts[cartIndex] = { ...carts[cartIndex], ...updatedCartData };
            await writeJsonFile(paths.files, "cart.json", carts);
            return carts[cartIndex];
        } catch (error) {
            throw new Error(`Error al actualizar el carrito: ${error.message}`);
        }
    }

    // Elimina un carrito por ID
    async deleteOneById(id) {
        try {
            const carts = await readJsonFile(paths.files, "cart.json");
            const cartIndex = carts.findIndex(cart => cart.id === id);
            if (cartIndex === -1) {
                throw new Error(`Carrito con ID ${id} no encontrado.`);
            }
            carts.splice(cartIndex, 1);
            await writeJsonFile(paths.files, "cart.json", carts);
        } catch (error) {
            throw new Error(`Error al eliminar el carrito: ${error.message}`);
        }
    }
}

export default CartManager;