import express from "express";
import { config as configHandlebars } from "./config/handlebars.config.js";
import { config as configWebsocket } from "./config/websocket.config.js";

import productRouter from "./routes/product.router.js";
import cartRouter from "./routes/cart.router.js";
import routerViewHome from "./routes/home.view.router.js";

const app = express();

const PORT = 8080;

app.use("/api/public", express.static("./src/public"));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

configHandlebars(app);

// Declaración de rutas
app.use("/api/products", productRouter); // Rutas para los productos
app.use("/api/carts", cartRouter); // Rutas para los carritos
app.use("/", routerViewHome); // Rutas para las vistas

const httpServer = app.listen(PORT, () => {
    console.log(`Ejecutándose en http://localhost:${PORT}`);
});

configWebsocket(httpServer);
