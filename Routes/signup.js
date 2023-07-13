import { User } from "../database/userDatabase.js";
import express from "express";
import bcrypt from "bcrypt";
import Seller from "../database/Seller.js";
import Token from "../database/tookenDatabase.js"
import crypto from 'crypto';
import sendMail from "../utilis/sendEmail.js";
import "dotenv/config";
const route = express.Router();

route.post("/signup", async (req, res) => {
    const { name, email, phone, gender, password } = req.body;
    let exists = await User.findOne({ email: email });

    if (exists) {
        res.send("exists");
    }
    else {
        const hashPassword = await bcrypt.hash(password,10);
        const user = await User.create({
            name, email, phone, gender, password:hashPassword
        });
        const token = await Token.create({
            id: user._id,
            token: crypto.randomBytes(32).toString("hex")
        });
        const url = `${process.env.BACKEND_URL}/v1/user/${user._id}/verify/${token.token}`;
        await sendMail(user.email, "Verify Email", url);
        res.send(user);
    }
});
route.put("/edit/profile/:id", async (req, res) => {
    const id = req.params.id;
    const { name,phone, gender } = req.body;
    let exists = await User.findOne({ _id: id });
    if (exists) {
        let newUser = await User.findOneAndUpdate({ _id: id }, { name: name, phone: phone, gender: gender });
        return res.send(newUser);
    }
    else {
        return res.send("nothing");
    }
});
route.get("/:id/verify/:token", async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id });
        if (!user) {
            res.send("notauser");
        }
        const token = await Token.findOne({ id: user._id, token: req.params.token });
        if (!token) {
            res.send("invalidlink");
           
        }
        else {
            await User.updateOne({ _id: user._id }, {verified: true });
            await token.deleteOne();
            res.send(" verified successfully");
        }
    }
    catch (e) {
        console.log(e);
    }
})
route.post("/login", async (req, res) => {
    const { email, password } = req.body;
    var exists = await User.findOne({ email: email });
    if (!exists) {
        res.send("notexists");
    }
    else if (exists.verified === false) {
        var token = await Token.findOne({ id: exists._id });
        if (!token) {
           token = await Token.create({
            id: exists._id,
            token: crypto.randomBytes(32).toString("hex")
        });
        }
        const url = `${process.env.BACKEND_URL}/v1/user/${exists._id}/verify/${token.token}`;
        await sendMail(email, "Verify Email", url);
        res.send("notverified")
    }
    else {

        let Match = await bcrypt.compare(password, exists.password);
        if (Match) {
            res.send({
                login: "login",
                id:exists._id,
            });
        }
        else res.send("notlogin");
    }
});
route.post("/seller", async (req, res) => {
    const { shop, address, pincode, bankaccount, user_id } = req.body;
    let exists = await Seller.findOne({ user_id: user_id });
    if (exists) {
        res.send("exists");
    }
    else {
        const user = await Seller.create({ shop, address, pincode, bankaccount, user_id });
        console.log(user);
        res.send(user);
    }
});
route.get("/:id", async (req, res) => {
    const id = req.params.id;
    const userProfile = await User.find({ _id: id });
    const sellerProfile = await Seller.find({ user_id: id });
    res.send({userProfile:userProfile,sellerProfile:sellerProfile});
})
export default route;