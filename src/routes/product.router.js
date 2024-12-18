import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";
import uploader from "../utils/uploader.js";

const router = Router();
const productManager = new ProductManager();

// Ruta para obtener todos los productos con filtros, paginación y ordenamiento
router.get("/", async (req, res) => {
    try {
        const { limit = 10, page = 1, sort = "asc", query = "" } = req.query;

        // Convertimos limit y page a números
        const limitNumber = parseInt(limit);
        const pageNumber = parseInt(page);

        const result = await productManager.getAllProducts({
            limit: limitNumber,
            page: pageNumber,
            sort,
            query,
        });

        // Desestructuramos el resultado
        const { products, totalPages, hasPrevPage, hasNextPage, prevLink, nextLink } = result;

        // Envio de la respuesta
        res.status(200).json({
            status: "success",
            payload: products,
            totalPages,
            prevPage: hasPrevPage ? pageNumber - 1 : null,
            nextPage: hasNextPage ? pageNumber + 1 : null,
            page: pageNumber,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink,
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

// Ruta para obtener un producto por su ID
router.get("/:id", async (req, res) => {
    try {
        const product = await productManager.getOneById(req.params.id);
        if (!product) {
            return res.status(404).json({ status: "error", message: "Producto no encontrado" });
        }
        res.status(200).json({ status: "success", payload: product });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

// Ruta para crear un producto, permite la subida de imágenes
router.post("/", uploader.single("file"), async (req, res) => {
    try {
        const product = await productManager.addProduct(req.body, req.file);
        res.status(201).json({ status: "success", payload: product });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

// Ruta para actualizar un producto por su ID
router.put("/:id", uploader.single("file"), async (req, res) => {
    try {
        const product = await productManager.updateOneById(req.params.id, req.body, req.file);
        if (!product) {
            return res.status(404).json({ status: "error", message: "Producto no encontrado" });
        }
        res.status(200).json({ status: "success", payload: product });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

// Ruta para eliminar un producto por su ID
router.delete("/:id", async (req, res) => {
    try {
        await productManager.deleteOneById(req.params.id);
        res.status(200).json({ status: "success" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

export default router;