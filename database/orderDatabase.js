import mongoose from "mongoose";

const order = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    product_id: {
        type: String,
        required: true,
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