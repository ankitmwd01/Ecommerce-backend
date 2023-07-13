import mongoose from "mongoose";
const card = new mongoose.Schema({
    product_id: {
         type: mongoose.Schema.Types.ObjectId,
         required: true,
         ref: "Product",
    },
    quantity: {
        type: Number,
        required: true,
        default:1,
    },
    user_id: {
         type: mongoose.Schema.Types.ObjectId,
         required: true,
         ref: "User",
    }

});
const Card = new mongoose.model("Card", card);
export default Card;
