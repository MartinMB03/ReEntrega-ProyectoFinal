import { writeJsonFile, readJsonFile } from "../utils/fileHandler.js";
import paths from "../utils/paths.js";
import { generateId } from "../utils/collectionHandler.js";

class ProductManager {
    constructor() {
        this.productsFilePath = paths.files + "../files/product.json";
    }

    // Obtiene todos los productos
    async getAllProducts() {
        try {
            const products = await readJsonFile(paths.files, "product.json");
            return products;
        } catch (error) {
            throw new Error(`Error al obtener los productos: ${error.message}`);
        }
    }

    // Agrega un nuevo producto
    async addProduct(productData) {
        try {
            const products = await readJsonFile(paths.files, "product.json");
            const newProduct = { id: generateId(products), ...productData };
            products.push(newProduct);
            await writeJsonFile(paths.files, "product.json", products);
            return newProduct;
        } catch (error) {
            throw new Error(`Error al agregar el producto: ${error.message}`);
        }
    }

    // Elimina un producto por ID
    async deleteOneById(id) {
        try {
            const products = await readJsonFile(paths.files, "product.json");
            const productIndex = products.findIndex((product) => product.id === id);
            if (productIndex === -1) {
                throw new Error(`Producto con ID ${id} no encontrado.`);
            }
            products.splice(productIndex, 1);
            await writeJsonFile(paths.files, "product.json", products);
        } catch (error) {
            throw new Error(`Error al eliminar el producto: ${error.message}`);
        }
    }
}

export default ProductManager;
