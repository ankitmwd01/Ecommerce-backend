import express from "express";
const route = express.Router();
import { Product } from "../database/ProductDatabase.js";
import jwt from "jsonwebtoken";
// Create Product
route.post("/create", async (req, res) => {
    var { name, price, quantity, desc, discount, img, user_id } = req.body;
       
    if (!user_id) { 
        return res.send("user Not found");
    }
     user_id =  jwt.verify(String(user_id),String( process.env.JWT_SECRET_KEY));
    const user = await Product.create({
        name, price, quantity, img, desc, discount,user_id
    });
    res.json({
        message: "Success",
        user,
    })
});
export default route;