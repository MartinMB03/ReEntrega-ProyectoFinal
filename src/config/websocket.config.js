import { Server } from "socket.io";
import ProductManager from "../managers/ProductManager.js";

const productManager = new ProductManager();

export const config = (httpServer) => {
    const socketServer = new Server(httpServer);

    socketServer.on("connection", async (socket) => {
        console.log("Cliente conectado", socket.id);

        // Envía la lista de productos al conectarse
        try {
            const products = await productManager.getAllProducts();
            socket.emit("products-list", { products });
        } catch (error) {
            socket.emit("error-message", { message: error.message });
        }

        // Escucha el evento para agregar un nuevo producto
        socket.on("insert-product", async (data) => {
            try {
                await productManager.addProduct(data);
                const updatedProducts = await productManager.getAllProducts();
                socketServer.emit("products-list", { products: updatedProducts });
            } catch (error) {
                socket.emit("error-message", { message: error.message });
            }
        });

        // Escucha el evento para eliminar un producto
        socket.on("delete-product", async (data) => {
            try {
                await productManager.deleteOneById(data.id);
                const updatedProducts = await productManager.getAllProducts();
                socketServer.emit("products-list", { products: updatedProducts });
            } catch (error) {
                socket.emit("error-message", { message: error.message });
            }
        });

        // Desconexión del cliente
        socket.on("disconnect", () => {
            console.log("Cliente desconectado", socket.id);
        });
    });
};