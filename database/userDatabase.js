
import mongoose from "mongoose";
const user= new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    img:{
        type:String
    },
    phone: {
        type: String,
        required:true,
    },
    email: {
        type: String,
        required:true,
    },
    address: [{
        type: String,
        default:null,
    }],
    user_type: {
        type: String,
        default:"user",
    },
    gender: {
        type: String,
        required: true,   
    },
    password: {
        type: String,
        required:true,
    },
    verified: {
        type: Boolean,
        default:false,
    }
});
export const User = new mongoose.model("User", user);