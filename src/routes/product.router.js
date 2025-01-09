import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const manager = new ProductManager();

router.get("/", async (req, res) => {
    try {
        const { limit = 10, page = 1, sort = "asc", query = "" } = req.query;
        const limitNumber = parseInt(limit);
        const pageNumber = parseInt(page);

        const result = await manager.getAllProducts({
            limit: limitNumber,
            page: pageNumber,
            sort,
            query,
        });

        const { products, totalPages, hasPrevPage, hasNextPage, prevLink, nextLink } = result;

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

router.get("/:id", async (req, res) => {
    try {
        const product = await manager.getOneById(req.params.id);
        res.status(200).json({ status: "success", payload: product });
    } catch (error) {
        res.status(error.code).json({ status: "error", message: error.message });
    }
});

export default router;
