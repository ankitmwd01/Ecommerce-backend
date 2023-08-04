import 'dotenv/config';
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import route from "./Routes/CreateProduct.js";
import productRoute from "./Routes/ProductWork.js"
import SingupLogin from "./Routes/signup.js"
import cookieParser from "cookie-parser";
import { MongoConnection } from "./database/dataConnection.js";
import PaymentRoute from "./Routes/paymentroute.js";
import OrderRoute from "./Routes/orderRoute.js";
const app = express();
MongoConnection();
app.use(cors({
    origin: "*",
    methods:["POST","GET","PUT","DELETE"]
}))
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/v1/admin", route);
app.use("/v1/product", productRoute);
app.use("/v1/user", SingupLogin, PaymentRoute,OrderRoute);

app.listen(process.env.PORT,() => {
    console.log("Server Is working "+process.env.PORT);
})