import express from "express";
import Order from "../database/orderDatabase.js";
import { Product } from "../database/ProductDatabase.js";
import Card from "../database/CartDatabase.js";
import jwt from "jsonwebtoken"
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
    const token = req.params.id;
    if (!token) { 
        return res.send("user Not found");
    }
    const id =  jwt.verify(String(token),String( process.env.JWT_SECRET_KEY));
    // const id = req.params.id;
    const order = await Order.find({ user_id: id });
    
    return res.send(order);
});
// change Status
route.put("/order/status/:id",async(req,res)=>{
      const id=req.params.id;
      const status1=String(req.body.status1);
      console.log(status1);
      const update= await Order.findOneAndUpdate(({_id:id},{status:status1},{new:true}));
      console.log(update ,"updated Order Printing");
      res.send(update)
})
export default route;