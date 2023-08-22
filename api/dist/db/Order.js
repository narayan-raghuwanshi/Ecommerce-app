"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const orderSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    itemImageLink: { type: String, required: true },
    category: String,
    size: { type: String, required: true },
    color: { type: String, required: true },
    seller: { type: String, required: true },
    buyer: { type: String, required: true },
    date: { type: String, required: true },
    phone: { type: Number, required: true },
    address: { type: String, required: true },
    shipped: { type: Boolean, required: true },
    delivered: { type: Boolean, required: true },
    itemId: { type: "ObjectId", required: true },
});
exports.Order = mongoose_1.default.model("Order", orderSchema);
