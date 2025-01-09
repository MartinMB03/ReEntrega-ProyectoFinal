import { Router } from "express";
import Product from "../models/Product.js";
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
            products,
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
        })
    } catch (error) {
        res.status(500).send(`<h1>Error</h1><h3>${error.message}</h3>`);
    }
});

router.get("/realTimeProducts", async (req, res) => {
    try {
        const products = await Product.find();

        res.render("realTimeProducts", { title: "Productos en Tiempo Real", products });
    } catch (error) {
        res.status(500).send(`<h1>Error</h1><h3>${error.message}</h3>`);
    }
});

export default router;