import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/User";
import adminRouter from "./routes/Admin";
import path from "path";
import cors from "cors";
const app = express();
import * as dotenv from 'dotenv';
const port = 3000;
dotenv.config();

app.use(express.json());

if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not set.');
}
mongoose.connect(process.env.MONGODB_URI, { dbName: "ecommerce" }).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

app.use("/user", userRouter);
app.use("/admin", adminRouter);

app.use(express.static("public"));
app.use("/*",(req,res)=>{
    res.sendFile(path.join(__dirname, "/public/index.html"));
})

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});
