import express from "express";
import { Product } from "../database/ProductDatabase.js";
import Card from "../database/CartDatabase.js";
import Order from "../database/orderDatabase.js";
import { User } from "../database/userDatabase.js";
const route = express.Router();
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
route.get("/admin/orders/:id", async (req, res) => {
    const id = req.params.id;
    const product = await Product.find({ user_id: id });
    const orders = await Order.find({});
    let Arr = [];
    for (let i = 0; i < product?.length; i++) {
        for (let j = 0; j < orders?.length; j++) {
            if (String(product[i]._id) === String(orders[j].product_id)) {
                Arr.push(orders[j]);
            }
        }
    }
    res.send(Arr);
})

// Card Routes
route.post("/card", async (req, res) => {
    const { user_id, product_id } = req.body;
    const user = await Card.findOne({ user_id:user_id,product_id: product_id });
    if (user) {
        return res.send("exists");
    }
    const card = await Card.create({
        user_id, product_id
    });
    res.send(card);

    
});
route.get("/card/:id", async (req, res) => {
    const id = req.params.id;
    const data = await Card.find({ user_id: id });
    res.send(data);
});
route.delete("/card/:id", async (req, res) => {
    try {
    const id = req.params.id;
    const Match = await Card.findOne({ _id: id });
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
    const required =Number( req.body.required);
    const exists = await Card.findOne({ _id: id });
    const card = await Card.findOneAndUpdate({ _id: id }, { quantity: required });
    res.send(card);
})
route.delete("/card/all/:id", async (req, res) => {
    const id = req.params.id;
    await Card.findManyAndDelete({ _id: id });
    res.send({ message: "Successfully Deleted" });
});
route.get("/card/all/:id", async (req, res) => {
    const id = req.params.id;
    const card = await Card.find({ user_id: id });
    const product = await Product.find({});
    var Arr = [];
    for (let i = 0; i < card?.length; i++){
        for (let j = 0; j < product?.length; j++){
            if (String(product[j]._id) === String(card[i].product_id)) {
                Arr.push({ name: product[j].name, price: product[j].price, quantity: card[i].quantity, img: product[j].img, total: product[j].quantity, product_id: product[j]._id, card_id: card[i]._id });
            }
        }
    }
    res.send(Arr);
})
route.post("/review/submit/:id", async (req, res) => {
    const product_id = req.params.id;
    const { rating, reviews } = req.body.review;
    const userId = req.body.userId;
    const user= await User.findOne({_id: userId});
    const product = await Product.findOne({ _id: product_id });
    const Match=product.review.some(review => review.userEmail===user.email);
    if (Match) {
        console.log(Match);
       return res.send("Already have a match");
    }
    else {
        var Review = product.review;
    var numOfRating = product.norating;
    var Rating = product.rating;
    numOfRating = numOfRating + 1;
    
    console.log(Rating,"rating",numOfRating)
    var total = ((Number((numOfRating - 1) * Rating)) +Number(rating));
    console.log(total, "total");
        Rating = (total / numOfRating);
    Review.push({ userReview: reviews, userRating: rating,userName: user.name,userEmail: user.email});
    await Product.findOneAndUpdate({ _id: product_id }, { review: Review, norating: numOfRating, rating:Rating });
     return res.send(Review);
    }
   
});
route.get("/review/:id", async (req, res) => { 
    const id = req.params.id;
    const product = await Product.findOne({ _id: id });
    const Review = product.review;
    console.log(Review);
    res.send(Review);
})
export default route;