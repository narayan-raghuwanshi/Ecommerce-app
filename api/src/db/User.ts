import { UserType } from "../types/UserType";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema<UserType>({
    fullName: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
    cartItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }]
});
export const User = mongoose.model("User", userSchema);
