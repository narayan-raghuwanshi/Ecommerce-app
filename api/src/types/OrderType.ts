import mongoose from "mongoose";
export interface OrderType extends Document{
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string | 'Description not found';
    price: number;
    itemImageLink: string;
    category: string | 'Category not found';
    size: string;
    color: string;
    seller: string;
    buyer: string;
    date:string;
    phone:number;
    address:string;
    shipped:boolean;
    delivered:boolean;
    itemId: mongoose.Types.ObjectId;
}