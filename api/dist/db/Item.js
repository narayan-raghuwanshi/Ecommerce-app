"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const itemSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    itemImageLink: { type: String, required: true },
    category: String,
    rating: { type: Number, required: true },
    sizes: { type: String, required: true },
    color: { type: String, required: true },
    seller: { type: String, required: true },
});
exports.Item = mongoose_1.default.model("Item", itemSchema);
