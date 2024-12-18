import express from "express";
import { config as configHandlebars } from "./config/handlebars.config.js";
import { config as configWebsocket } from "./config/websocket.config.js";

import { connectDB } from "./config/mongoose.config.js";

import productRouter from "./routes/product.router.js";
import cartRouter from "./routes/cart.router.js";
import routerViewHome from "./routes/home.view.router.js";

const app = express();
const PORT = 8080;

app.use("/api/public", express.static("./src/public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

configHandlebars(app);

// Rutas de la API y vistas
app.use("/api/products", productRouter); // Rutas para productos
app.use("/api/carts", cartRouter); // Rutas para carritos
app.use("/", routerViewHome); // Rutas para las vistas

connectDB();

// Iniciar el servidor HTTP
const httpServer = app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});

// Configuración de WebSocket
configWebsocket(httpServer);