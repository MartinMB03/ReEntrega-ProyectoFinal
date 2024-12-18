import { Router } from "express";
import Product from "../models/Product.js";

const router = Router();

// Ruta para la página de inicio
router.get("/", async (req, res) => {
    try {
        const products = await Product.find().limit(10);

        res.render("home", { title: "Inicio", products });
    } catch (error) {
        res.status(500).send(`<h1>Error</h1><h3>${error.message}</h3>`);
    }
});

// Ruta para la página de productos en tiempo real
router.get("/realTimeProducts", async (req, res) => {
    try {
        // Obtener productos en tiempo real
        const products = await Product.find();

        res.render("realTimeProducts", { title: "Productos en Tiempo Real", products });
    } catch (error) {
        res.status(500).send(`<h1>Error</h1><h3>${error.message}</h3>`);
    }
});

export default router;