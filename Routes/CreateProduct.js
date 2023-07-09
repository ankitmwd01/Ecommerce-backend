import express from "express";
const route = express.Router();
import { Product } from "../database/ProductDatabase.js";

// Create Product
route.post("/create", async (req, res) => {
    const { name, price, quantity, desc, discount, img, user_id } = req.body;
    console.log(user_id);
    const user = await Product.create({
        name, price, quantity, img, desc, discount,user_id
    });
    res.json({
        message: "Success",
        user,
    })
});


export default route;