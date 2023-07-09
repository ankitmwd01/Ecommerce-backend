import mongoose, { Schema} from "mongoose";
const token = new mongoose.Schema({
    id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
        unique: true,
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