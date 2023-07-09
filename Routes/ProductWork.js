import express from "express";
const route = express.Router();
import { Product } from "../database/ProductDatabase.js";
import Card from "../database/CartDatabase.js";
route.get("/all", async (req, res) => {
    var AllProduct = await Product.find({});
    res.send(AllProduct)
});
route.get("/:id", async (req, res) => {
    const id = req.params.id;
    const Item = await Product.find({ _id: id });
    if (!Item) {
        return res.send("User Not Found");
    }
    res.send(Item);
});
route.put("/:id", async (req, res) => {
    const id = req.params.id;
    const minus = req.body.quantity;
    const Match = await Product.findOne({ _id: id });
    if (!Match) {
       return res.send("notfound");
    }
    else {
        const product = await Product.findOneAndUpdate({ _id: id },{quantity:Match.quantity-minus});
       return res.send(product);
    }
})

route.post("/card", async (req, res) => {
    const { user_id, product_id } = req.body;
    const user = await Card.findOne({ user_id:user_id,product_id: product_id });
    if (user) {
        return res.send("exists");
    }
    const card = await Card.create({
        user_id, product_id
    });
    console.log(card);
    res.send(card);

    
});
route.get("/card/:id", async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const data = await Card.find({ user_id: id });
    console.log(data);
    res.send(data);
});
route.delete("/card/:id", async (req, res) => {
    try {
        const id = req.params.id;
    const Match = await Card.findOne({ _id: id });
    console.log("Match", Match);
    if (!Match) {
       return res.send("notfound");
    }
    await Card.findOneAndDelete({ _id: id });
       return res.send({message:"Successfully Deleted"});
    }
    catch (e) {
        console.log(e);
    }
});
route.put("/card/update/:id", async (req, res) => {
    const id = req.params.id;
    const required = req.body.required;
    console.log(required);
    const exists = await Card.findOne({ _id: id });
    const data = await Card.findOneAndUpdate({ _id: id }, {
        $set : {
            user_id: exists.user_id,
            product_id:exists.product_id,
            quantity:required,
        }
    });
    res.send(data);
})
route.delete("/card/all/:id", async(req, res) => {
     const id = req.params.id;
    await Card.findManyAndDelete({ _id: id });
    res.send({message:"Successfully Deleted"});
})
export default route;