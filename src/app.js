import express from "express";
import { engine } from 'express-handlebars';
import { connectDB } from "./config/mongoose.config.js";
import productRouter from "./routes/product.router.js";
import cartRouter from "./routes/cart.router.js";
import routerViewHome from "./routes/home.view.router.js";

const app = express();
const PORT = 8080;

// Configurar Handlebars
app.engine('handlebars', engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
}));

// Configuración del directorio de vistas
app.set('views', './src/views');  // Asegúrate de que esta ruta esté bien configurada

app.set('view engine', 'handlebars'); // Establecer el motor de plantillas

app.use("/api/public", express.static("./src/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/products", productRouter); // Rutas para productos
app.use("/api/carts", cartRouter); // Rutas para carritos
app.use("/", routerViewHome); // Rutas para las vistas

connectDB();

// Iniciar el servidor HTTP
const httpServer = app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
