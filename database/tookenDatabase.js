import mongoose, { Schema} from "mongoose";
const token = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    token: { type: String, required: true },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 3600
    }
});
const Token =new mongoose.model("Token", token);
export default Token;