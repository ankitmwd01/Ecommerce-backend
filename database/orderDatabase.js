import mongoose from "mongoose";

const order = new mongoose.Schema({
    user_id: {
         type: mongoose.Schema.Types.ObjectId,
         required: true,
         ref: "User",
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
         required: true,
         ref: "Product",
    },
    order_date: {
        type: Date,
        default: Date.now(),
    },
    status: {
        type: String,
        default: "ordered"
    },
    price: {
        type: Number,
    },
    quantity: {
        type:Number,
    },
    name: {
        type:String,
    },
    img: [{
        type:String,
    }],
});
const Order = new mongoose.model("Order", order);
export default Order;