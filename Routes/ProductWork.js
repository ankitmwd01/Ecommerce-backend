import express from "express";
import { Product } from "../database/ProductDatabase.js";
import Card from "../database/CartDatabase.js";
import Order from "../database/orderDatabase.js";
import { User } from "../database/userDatabase.js";
import jwt from "jsonwebtoken";
const route = express.Router();
route.get("/all", async (req, res) => {
    var AllProduct = await Product.find({});
    res.send(AllProduct);
});
route.get("/:id", async (req, res) => {
    const id = req.params.id;
    const Item = await Product.findOne({ _id: id });
    if (!Item) {
        return res.send("User Not Found");
    }
    console.log(Item);
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
        const product = await Product.findOneAndUpdate({ _id: id },{quantity:Match.quantity-minus},{new:true});
       return res.send(product);
    }
})
route.get("/admin/orders/:id", async (req, res) => {
    const token = req.params.id;
    if (!token) { 
        return res.send("user Not found");
    }
    const id =  jwt.verify(String(token),String( process.env.JWT_SECRET_KEY));
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
    const { token, product_id } = req.body;
    if (!token) { 
        return res.send("user Not found");
    }
    const user_id =  jwt.verify(String(token),String( process.env.JWT_SECRET_KEY));
    const user = await Card.findOne({ user_id:user_id,product_id: product_id });
    if (user) {
        return res.send("exists");
    }
    const card = await Card.create({
        user_id, product_id
    });
    let newCard = await card.populate("product_id",'-review');
    res.send(newCard);  
});
route.get("/card/:id", async (req, res) => {
    const token = req.params.id;
    if (!token) { 
        return res.send("user Not found");
    }
    const id =  jwt.verify(String(token),String( process.env.JWT_SECRET_KEY));
    const data = await Card.find({ user_id: id }).populate("product_id", "-review");
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
       return res.send(Match);
    }
    catch (e) {
        console.log(e);
    }
});
route.put("/card/update/:id", async (req, res) => {
    const id = req.params.id;
    const required =Number( req.body.required);
    const card = await Card.findOneAndUpdate({ _id: id }, { quantity: required }, { new: true });
    const newCard = await card.populate("product_id", "-review");
    res.send(newCard);
})
route.delete("/card/all/:id", async (req, res) => {
    const id = req.params.id;
    const card = await Card.findOne({ _id: id });
    if (card) {
        await Card.findManyAndDelete({ _id: id });
       return res.send(card);
    }
    else {
       return res.send("not Found");
    }
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
    const token = req.body.token;
    if (!token) { 
        return res.send("user Not found");
    }
    const userId =  jwt.verify(String(token),String( process.env.JWT_SECRET_KEY));
    const user= await User.findOne({_id: userId});
    const product = await Product.findOne({ _id: product_id });
    const Match=product.review.some(review => review.userEmail===user.email);
    if (Match) {
    
       return res.send("Already have a match");
    }
    else {
    var Review = product.review;
    var numOfRating = product.norating;
    var Rating = product.rating;
    numOfRating = numOfRating + 1;
    var total = ((Number((numOfRating - 1) * Rating)) +Number(rating));
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