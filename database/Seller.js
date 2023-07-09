import mongoose from "mongoose";
const seller = new  mongoose.Schema({
    shop: {
        type: String,
        required: true,
    },
    bankaccount: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    pincode: {
        type: String,
        required: true,
    },
    user_id: {
        type: String,
        required: true,
    }
});
const Seller = new mongoose.model("Seller", seller);
export default Seller;
