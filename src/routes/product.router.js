import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
    try {
        const { limit = 10, page = 1, sort = "asc", query = "" } = req.query;
        const limitNumber = parseInt(limit);
        const pageNumber = parseInt(page);

        const result = await productManager.getAllProducts({
            limit: limitNumber,
            page: pageNumber,
            sort,
            query,
        });

        const { products, totalPages, hasPrevPage, hasNextPage, prevLink, nextLink } = result;

        // Convertir los productos a objetos planos
        const plainProducts = products.map(product => product.toObject());

        res.render("home", {
            products: plainProducts,
            totalPages,
            hasPrevPage,
            hasNextPage,
            prevPage: hasPrevPage ? pageNumber - 1 : null,
            nextPage: hasNextPage ? pageNumber + 1 : null,
            page: pageNumber,
            prevLink,
            nextLink,
            limit: limitNumber,
            sort,
            query
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});


router.get("/:pid", async (req, res) => {
    try {
        const product = await productManager.getOneById(req.params.pid);
        res.render("productDetails", { product });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

export default router;
