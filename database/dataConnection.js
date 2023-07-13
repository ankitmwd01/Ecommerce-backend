import mongoose from "mongoose";
export const MongoConnection = () => {
    mongoose.connect((process.env.MONGO_URL), { dbName:process.env.MONGO_DATABASE}).then(() => console.log("Server Is Connected to Mongo")).catch((e) => console.log(e));
}
