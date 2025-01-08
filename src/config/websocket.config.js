import { Server } from "socket.io";
import ProductManager from "../managers/ProductManager.js";

const productManager = new ProductManager();

export const config = (httpServer) => {
    const socketServer = new Server(httpServer);

    socketServer.on("connection", async (socket) => {
        console.log("Cliente conectado", socket.id);

        try {
            const products = await productManager.getAllProducts();
            socket.emit("products-list", { products });
        } catch (error) {
            socket.emit("error-message", { message: error.message });
        }

        socket.on("insert-product", async (data) => {
            try {
                await productManager.addProduct(data);
                const updatedProducts = await productManager.getAllProducts();
                socketServer.emit("products-list", { products: updatedProducts });
            } catch (error) {
                socket.emit("error-message", { message: error.message });
            }
        });

        socket.on("delete-product", async (data) => {
            try {
                await productManager.deleteOneById(data.id);
                const updatedProducts = await productManager.getAllProducts();
                socketServer.emit("products-list", { products: updatedProducts });
            } catch (error) {
                socket.emit("error-message", { message: error.message });
            }
        });

        socket.on("disconnect", () => {
            console.log("Cliente desconectado", socket.id);
        });
    });
};