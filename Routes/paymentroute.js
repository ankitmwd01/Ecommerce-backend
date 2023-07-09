import "dotenv/config";
import express from "express";
import Stripe from 'stripe';
import { Product } from "../database/ProductDatabase.js"; 
import Card from "../database/CartDatabase.js";
const route = express.Router();
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);
route.post("/card/payment", async (req, res) => {
    const Arr = [];
    const product_id = req.body.Arr[0].product_id;
    // const card_id = req.body.Arr[0].card_id;
    const quantity = req.body.Arr[0].quantity;

    for (let i = 0; i < req.body.Arr.length; i++) {
        Arr.push(await Card.findOne({ user_id: req.body.Arr[i].user_id, product_id: req.body.Arr[i].product_id }))
    }
    console.log(Arr, "Arr");
    const lineItems = [];
    for (let i = 0; i < Arr.length; i++) {
        const { name, price, img } = await Product.findOne({ _id: Arr[i].product_id });
        
        lineItems.push({ name: name, price: price*100, img: img, quantity: Arr[i].quantity });
    }
    
    console.log(lineItems);
    const card_id = Arr.length === 1 ? req.body.Arr[0].card_id : "all";
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: lineItems.map((item) => {
                return {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: item.name,
                            images: item.img
                        },
                        unit_amount: item.price,
                    },
                    quantity: item.quantity
                }
            }),
            success_url: `${process.env.FRONT_END_BASE_URL}/payment/success/card/${card_id}`,
            cancel_url: `${process.env.FRONT_END_BASE_URL}`,
        });
        res.send(session);
    }
    catch (e) {
        console.log(e);
    }
    
});
export default route;
