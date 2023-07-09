import mongoose from "mongoose";
const card = new mongoose.Schema({
    product_id: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default:1,
    },
    user_id: {
        type: String,
        required: true,
    }

});
const Card = new mongoose.model("Card", card);
export default Card;
