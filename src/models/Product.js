import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    availability: { type: Boolean, default: true },
    thumbnail: { type: String },
});

const Product = mongoose.model("Product", productSchema);

export default Product;