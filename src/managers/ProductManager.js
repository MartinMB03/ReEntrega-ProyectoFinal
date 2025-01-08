import Product from "../models/Product.js";

class ProductManager {
    async getAllProducts({ limit, page, sort, query }) {
        try {
            // Construir filtro para buscar por categoría, disponibilidad o título
            const filter = {};
            if (query) {
                // Si hay query, aplicar búsqueda por título, categoría o disponibilidad
                const regexQuery = new RegExp(query, "i");
                filter.$or = [
                    { title: { $regex: regexQuery } },
                    { category: { $regex: regexQuery } },
                    { availability: { $regex: regexQuery } }
                ];
            }

            // Calcular la cantidad de productos a omitir para la paginación
            const skip = (page - 1) * limit;

            // Consultar productos con el filtro, ordenamiento y paginación
            const products = await Product.find(filter)
                .sort({ price: sort === "asc" ? 1 : -1 })  // Ordenar por precio asc/desc
                .skip(skip)  // Paginación
                .limit(limit);  // Limitar el número de productos

            // Contar los productos que coinciden con el filtro
            const totalProducts = await Product.countDocuments(filter);
            const totalPages = Math.ceil(totalProducts / limit);  // Total de páginas

            // Verificar si existen páginas anteriores o siguientes
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

            // Generar enlaces para la paginación
            const prevLink = hasPrevPage ? `/api/products?page=${page - 1}&limit=${limit}&sort=${sort}${query ? `&query=${query}` : ""}` : null;
            const nextLink = hasNextPage ? `/api/products?page=${page + 1}&limit=${limit}&sort=${sort}${query ? `&query=${query}` : ""}` : null;

            // Retornar los productos con la información de la paginación
            return {
                products,
                totalPages,
                hasPrevPage,
                hasNextPage,
                prevLink,
                nextLink,
            };
        } catch (error) {
            throw new Error(`Error al obtener los productos: ${error.message}`);
        }
    }

    async getOneById(id) {
        try {
            const product = await Product.findById(id);
            if (!product) {
                throw new Error("Producto no encontrado");
            }
            return product;
        } catch (error) {
            throw new Error(`Error al obtener el producto: ${error.message}`);
        }
    }
    
    async addProduct(productData, file) {
        try {
            const newProduct = new Product(productData);
            if (file) newProduct.image = file.path;  // Si hay imagen, agregarla al producto
            await newProduct.save();
            return newProduct;
        } catch (error) {
            throw new Error(`Error al agregar el producto: ${error.message}`);
        }
    }

    async deleteOneById(id) {
        try {
            const product = await Product.findByIdAndDelete(id);
            if (!product) {
                throw new Error(`Producto con ID ${id} no encontrado.`);
            }
        } catch (error) {
            throw new Error(`Error al eliminar el producto: ${error.message}`);
        }
    }
}

export default ProductManager;
