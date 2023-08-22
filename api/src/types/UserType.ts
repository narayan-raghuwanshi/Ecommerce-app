import { ItemType } from "./ItemType";
export interface UserType extends Document{
    fullName: string;
    username: string;
    password: string;
    cartItems: ItemType[];
    wishlist: ItemType[];
}