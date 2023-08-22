import { OrderType } from "../types/OrderType";
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema<OrderType>({
    title: {type: String, required: true},
    description: String,
    price: {type: Number, required: true},
    itemImageLink: {type: String, required: true},
    category: String,
    size: {type: String, required: true},
    color: {type: String, required: true},
    seller: {type:String,required:true},
    buyer:{type:String,required:true},
    date:{type:String,required:true},
    phone:{type:Number,required:true},
    address:{type:String,required:true},
    shipped:{type:Boolean,required:true},
    delivered:{type:Boolean,required:true},
    itemId:{type:"ObjectId",required:true},
});

export const Order = mongoose.model("Order", orderSchema);
