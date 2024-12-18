import Product from "../models/Product.js";  // Asegúrate de importar el modelo de MongoDB

class ProductManager {
    // Obtener todos los productos con paginación, ordenamiento y filtrado
    async getAllProducts({ limit, page, sort, query }) {
        try {
            // Filtrar productos por título (query)
            const filter = query ? { title: { $regex: query, $options: "i" } } : {};

            // Calcular el número de productos a saltar para la paginación
            const skip = (page - 1) * limit;

            // Obtener los productos con el filtro, ordenados por precio y con paginación
            const products = await Product.find(filter)
                .sort({ price: sort === "asc" ? 1 : -1 }) // Ordenar por precio (ascendente o descendente)
                .skip(skip) // Saltar los productos ya mostrados
                .limit(limit); // Limitar el número de productos por página

            // Contar el total de productos que coinciden con el filtro
            const totalProducts = await Product.countDocuments(filter);

            // Calcular el total de páginas
            const totalPages = Math.ceil(totalProducts / limit);

            // Determinar si hay páginas previas o siguientes
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

            // Generar los enlaces para la paginación
            const prevLink = hasPrevPage ? `/api/products?page=${page - 1}&limit=${limit}&sort=${sort}&query=${query}` : null;
            const nextLink = hasNextPage ? `/api/products?page=${page + 1}&limit=${limit}&sort=${sort}&query=${query}` : null;

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

    // Obtener un producto por ID
    async getOneById(id) {
        try {
            const product = await Product.findById(id);
            return product;
        } catch (error) {
            throw new Error(`Error al obtener el producto: ${error.message}`);
        }
    }

    // Agregar un nuevo producto
    async addProduct(productData, file) {
        try {
            const newProduct = new Product(productData);
            if (file) newProduct.image = file.path; // Guardamos la imagen si se sube
            await newProduct.save();  // Guardar el nuevo producto en MongoDB
            return newProduct;
        } catch (error) {
            throw new Error(`Error al agregar el producto: ${error.message}`);
        }
    }

    // Eliminar un producto por ID
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