import express from "express";
import Order from "../database/orderDatabase.js";
import { Product } from "../database/ProductDatabase.js";
import Card from "../database/CartDatabase.js";
const route = express.Router();
route.post("/ordered/:id", async (req, res) => {
    const id = req.params.id;
    const card = await Card.findOne({ _id: id });
    const product = await Product.findOne({ _id: card.product_id });
    const order = await Order.create({
        user_id:card.user_id, product_id:product._id, name:product.name, price:product.price,quantity:card.quantity, img:product.img
    });
    return res.send(order);
});
route.get("/order/all/:id", async (req, res) => {
    const id = req.params.id;
    const order = await Order.find({ user_id: id });
    return res.send(order);
})
export default route;