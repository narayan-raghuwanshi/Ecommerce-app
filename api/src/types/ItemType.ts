import mongoose from "mongoose";
export interface ItemType extends Document{
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string | 'Description not found';
    price: number;
    itemImageLink: string;
    category: string | 'Category not found';
    rating: number;
    sizes: string;
    color: string;
    seller: string;
}