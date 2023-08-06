import "dotenv/config";
import express from "express";
import Stripe from 'stripe';
import { Product } from "../database/ProductDatabase.js"; 
import Card from "../database/CartDatabase.js";
import Order from "../database/orderDatabase.js";
import jwt from "jsonwebtoken"
const route = express.Router();
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);
route.post("/card/payment", async (req, res) => {
    const Arr = req.body.Arr;
    const card_id = req.body.Arr[0].card_id ;
    const token=req.body.Arr[0].token;
    const id =  jwt.verify(String(token),String( process.env.JWT_SECRET_KEY));
    const end_url=Arr.length === 1 ?`/payment/success/${card_id}`: `/payment/success/all/${id}`;
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: Arr.map((item) => {
                return {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: item.name,
                            images: item.img
                        },
                        unit_amount: (item.price*100),
                    },
                    quantity: item.quantity
                }
            }),
            success_url: `${process.env.BACKEND_URL}/v1/user/${end_url}`,
            cancel_url: `${process.env.BACKEND_URL}/v1/user/payment/fail`,
        });

        res.send(session);
    }
    catch (e) {
        console.log(e);
    }
    
});
route.get("/payment/success",async(req,res)=>{
    res.send(`<h1> Your Payment Is Success  <a href="${process.env.FRONT_END_BASE_URL}"> Home Page </a></h1>  `);
  
})
route.get("/payment/fail",async(req,res)=>{
    res.send(`<h1> Your Payment Is Failed <a href="${process.env.FRONT_END_BASE_URL}"> Home Page </a></h1>  `);
})

route.get("/payment/success/:id", async (req, res) => {
    const card_id = req.params.id;
    const cardItem = await Card.findOne({ _id: card_id });
    if (cardItem) {
        const product = await Product.findOne({ _id: cardItem.product_id });
        const order = await Order.create({
            name: product.name,
            img: product.img,
            quantity: cardItem.quantity,
            price: product.price,
            product_id: cardItem.product_id,
            user_id: cardItem.user_id,
        })
        console.log(order);
        await Product.findOneAndUpdate({ _id: product._id }, { quantity: product.quantity - cardItem.quantity });
        await Card.deleteOne({ _id: card_id });
        return res.redirect(`${process.env.BACKEND_URL}/v1/user/payment/success`);
    }
    else {
        res.redirect(`${process.env.BACKEND_URL}/v1/user/payment/fail`);
    }
});

route.get("/payment/success/all/:id", async (req, res) => {
    const User_id = req.params.id;
    const cardItem = await Card.find({ user_id: User_id });
    for (let i = 0; i < cardItem?.length; i++){
         if (cardItem[i]) {
        const product = await Product.findOne({ _id: cardItem[i].product_id });
        const order = await Order.create({
            name: product.name,
            img: product.img,
            quantity: cardItem[i].quantity,
            price: product.price,
            product_id: cardItem[i].product_id,
            user_id: cardItem[i].user_id,
        })
        console.log(order);
        await Product.findOneAndUpdate({ _id: product._id }, { quantity: product.quantity - cardItem[i].quantity });  
        await Card.deleteOne({ _id: cardItem[i]._id });

    }
    }
    res.redirect(`${process.env.BACKEND_URL}/v1/user/payment/success`);
})
export default route;
