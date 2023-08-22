import {AdminType} from "../types/AdminType";
import mongoose from "mongoose";

const adminSchema = new mongoose.Schema<AdminType>({
    fullName: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
    companyName: {type: String, required: true}
});

export const Admin = mongoose.model("Admin", adminSchema);
