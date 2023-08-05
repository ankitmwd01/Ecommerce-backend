import "dotenv/config";
import express from "express";
import Stripe from 'stripe';
import { Product } from "../database/ProductDatabase.js"; 
import Card from "../database/CartDatabase.js";
import Order from "../database/orderDatabase.js";
const route = express.Router();
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);
route.post("/card/payment", async (req, res) => {
    const Arr = req.body.Arr;
    const card_id = Arr.length === 1 ? req.body.Arr[0].card_id : "all";
    try {
        console.log("1");
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
            success_url: `${process.env.FRONT_END_BASE_URL}/payment/success/card/${card_id}`,
            cancel_url: `${process.env.FRONT_END_BASE_URL}`,
        });
        console.log("1");

        res.send(session);
    }
    catch (e) {
        console.log(e);
    }
    
});
route.post("/payment/success/:id", async (req, res) => {
    const card_id = req.params.id;
    const cardItem = await Card.findOne({ _id: card_id });
    if (cardItem) {
        await Card.deleteOne({ _id: card_id });
        const product = await Product.findOne({ _id: cardItem.product_id });
        const order = await Order.create({
            name: product.name,
            img: product.img,
            quantity: cardItem.quantity,
            price: product.price,
            product_id: product._id,
            user_id: cardItem.user_id,
        })
        console.log(order);
        await Product.findOneAndUpdate({ _id: product._id }, { quantity: product.quantity - cardItem.quantity });
        res.send(order);
    }
    else {
        res.send("nothing");
    }
});
route.post("/payment/success/all/:id", async (req, res) => {
    const User_id = req.params.id;
    const cardItem = await Card.find({ user_id: User_id });
    for (let i = 0; i < cardItem?.length; i++){
         if (cardItem[i]) {
        await Card.deleteOne({ _id: cardItem[i]._id });
        const product = await Product.findOne({ _id: cardItem[i].product_id });
        const order = await Order.create({
            name: product.name,
            img: product.img,
            quantity: cardItem[i].quantity,
            price: product.price,
            product_id: product._id,
            user_id: cardItem[i].user_id,
        })
        console.log(order);
        await Product.findOneAndUpdate({ _id: product._id }, { quantity: product.quantity - cardItem[i].quantity });  
    }
    }
    res.send("done");
})
export default route;
