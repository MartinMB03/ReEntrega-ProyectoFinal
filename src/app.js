import express from "express";
import { engine } from 'express-handlebars';
import { connectDB } from "./config/mongoose.config.js";
import productRouter from "./routes/product.router.js";
import cartRouter from "./routes/cart.router.js";
import routerViewHome from "./routes/home.view.router.js";

const app = express();
const PORT = 8080;

app.engine('handlebars', engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
}));

app.set('views', './src/views');

app.set('view engine', 'handlebars');

app.use("/api/public", express.static("./src/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", routerViewHome);
connectDB();

const httpServer = app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});