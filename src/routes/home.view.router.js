import { Router } from "express";
import Product from "../models/Product.js";
import CartManager from "../managers/CartManager.js";

const router = Router();
const cartManager = new CartManager();

router.get("/", async (req, res) => {
    try {
        const products = await Product.find().limit(10);
        const carts = await cartManager.getAll();
        const cart = carts.length > 0 ? carts[0] : null;
        res.render("home", { title: "Inicio", products, cart });
    } catch (error) {
        res.status(500).send(`<h1>Error</h1><h3>${error.message}</h3>`);
    }
});

router.get("/products/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send(`<h1>Producto no encontrado</h1>`);
        }
        res.render("productDetails", { title: "Detalles del Producto", product });
    } catch (error) {
        res.status(500).send(`<h1>Error</h1><h3>${error.message}</h3>`);
    }
});

router.get("/carts/:id", async (req, res) => {
    try {
        const cart = await cartManager.getOneById(req.params.id);
        res.render("cart", { title: "Carrito de Compras", cart });
    } catch (error) {
        res.status(500).send(`<h1>Error</h1><h3>${error.message}</h3>`);
    }
});

router.get("/realTimeProducts", async (req, res) => {
    try {
        res.render("realTimeProducts", { title: "Productos en Tiempo Real" });
    } catch (error) {
        res.status(500).send(`<h1>Error</h1><h3>${error.message}</h3>`);
    }
});

export default router;
