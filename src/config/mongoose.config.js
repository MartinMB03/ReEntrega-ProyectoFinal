import { connect, Types } from "mongoose";

export const connectDB = async () => {
    const URL = "mongodb+srv://martin:1234@cluster0.ui1ja.mongodb.net/proyecto";

    try {
        await connect(URL);
        console.log("Conectado a MongoDB");
    } catch (error) {
        console.log("Error al conectar con MongoDB", error.message);
    }
};

export const isValidID = (id) => {
    return Types.ObjectId.isValid(id);
};