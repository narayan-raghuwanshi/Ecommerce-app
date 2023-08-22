import {ItemType} from "../types/ItemType";
import mongoose from "mongoose";

const itemSchema = new mongoose.Schema<ItemType>({
    title: {type: String, required: true},
    description: String,
    price: {type: Number, required: true},
    itemImageLink: {type: String, required: true},
    category: String,
    rating: {type: Number, required: true},
    sizes: {type: String, required:true},
    color:{type: String, required: true},
    seller: {type:String,required:true},
});

export const Item = mongoose.model("Item", itemSchema);
