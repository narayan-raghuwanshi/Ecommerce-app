"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Item_1 = require("../db/Item");
const User_1 = require("../db/User");
const Order_1 = require("../db/Order");
const middleware_1 = require("../middleware/middleware");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_1 = __importDefault(require("express"));
const userRouter = express_1.default.Router();
/* User Routes */
userRouter.get("/me", middleware_1.authenticateJwt, (req, res) => {
    res.json({
        username: req.headers.username
    });
});
userRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, username, password } = req.body;
    const user = yield User_1.User.findOne({ username });
    if (user) {
        res.status(403).json({ message: "User already exists" });
    }
    else {
        const newUser = new User_1.User({ fullName, username, password });
        yield newUser.save();
        const token = jsonwebtoken_1.default.sign({ username, role: "user" }, middleware_1.secretKey, {
            expiresIn: '1h',
        });
        res.json({ message: "User created successfully", token });
    }
}));
userRouter.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield User_1.User.findOne({ username, password });
    if (user) {
        const token = jsonwebtoken_1.default.sign({ username, role: "user" }, middleware_1.secretKey, {
            expiresIn: '1h',
        });
        res.json({ message: "Logged in Successfully", token });
    }
    else {
        res.status(403).json({ message: "Invalid username or password" });
    }
}));
userRouter.get("/items", middleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const items = yield Item_1.Item.find({});
    res.json({ items });
}));
userRouter.get("/item/:itemId", middleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const item = yield Item_1.Item.findById(req.params.itemId);
    res.json({ item });
}));
userRouter.post("/cart/:itemId", middleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const item = yield Item_1.Item.findById(req.params.itemId); /* Revisit any type */
    if (item) {
        const user = yield User_1.User.findOne({ username: req.headers.username });
        if (user) {
            user.cartItems.push(item);
            yield user.save();
            res.json({ message: "Item added to cart" });
        }
        else {
            res.status(403).json({ message: "User not found" });
        }
    }
    else {
        res.status(403).json({ message: "Item not found" });
    }
}));
userRouter.get("/cart", middleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.findOne({ username: req.headers.username }).populate("cartItems");
    if (user) {
        res.json({ cartItems: user.cartItems || [] });
    }
    else {
        res.status(403).json({ message: "User not found" });
    }
}));
userRouter.post("/wishlist/:itemId", middleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const item = yield Item_1.Item.findById(req.params.itemId);
    if (item) {
        const user = yield User_1.User.findOne({ username: req.headers.username }).populate("wishlist");
        if (user) {
            const index = user.wishlist.findIndex(w => w._id.toString() === req.params.itemId);
            if (index !== -1) {
                res.json({ message: "Item already in wishlist" });
            }
            else {
                user.wishlist.push(item);
                yield user.save();
                res.json({ message: "Item added to wishlist" });
            }
        }
        else {
            res.status(403).json({ message: "User not found" });
        }
    }
    else {
        res.status(403).json({ message: "Item not found" });
    }
}));
userRouter.get("/wishlist", middleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.findOne({ username: req.headers.username }).populate("wishlist");
    if (user) {
        res.json({ wishlist: user.wishlist || [] });
    }
    else {
        res.status(403).json({ message: "User not found" });
    }
}));
userRouter.get("/orders", middleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.findOne({ username: req.headers.username });
    if (user) {
        const orders = yield Order_1.Order.find({ buyer: user.username });
        res.json({ orders: orders || [] });
    }
    else {
        res.status(403).json({ message: "User not found" });
    }
}));
userRouter.patch("/deleteFromCart/:itemId", middleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const item = yield Item_1.Item.findById(req.params.itemId);
    if (item) {
        const user = yield User_1.User.findOne({ username: req.headers.username });
        if (user) {
            const itemIndex = user.cartItems.findIndex((item) => item._id.toString() === req.params.itemId);
            if (itemIndex !== -1) {
                user.cartItems = user.cartItems.filter((item, index) => index !== itemIndex);
                yield user.save();
                res.json({ message: "Item removed from cart", cartItems: user.cartItems });
            }
            else {
                res.status(404).json({ message: "Item is not in cart" });
            }
        }
        else {
            res.status(404).json({ message: "User not found" });
        }
    }
    else {
        res.status(404).json({ message: "Item not found" });
    }
}));
userRouter.patch("/deleteFromWishlist/:itemId", middleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const item = yield Item_1.Item.findById(req.params.itemId);
    if (item) {
        const user = yield User_1.User.findOne({ username: req.headers.username });
        if (user) {
            const itemIndex = user.wishlist.findIndex((item) => item._id.toString() === req.params.itemId);
            if (itemIndex !== -1) {
                user.wishlist = user.wishlist.filter((item, index) => index !== itemIndex);
                yield user.save();
                res.json({ message: "Item removed from wishlist", wishlist: user.wishlist });
            }
            else {
                res.status(404).json({ message: "Item is not in wishlist" });
            }
        }
        else {
            res.status(404).json({ message: "User not found" });
        }
    }
    else {
        res.status(404).json({ message: "Item not found" });
    }
}));
userRouter.post("/purchaseOne/:itemId", middleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const item = yield Item_1.Item.findById(req.params.itemId).populate('price');
    if (item) {
        const user = yield User_1.User.findOne({ username: req.headers.username });
        if (user) {
            let totalPrice = item.price;
            const newOrder = new Order_1.Order({
                "title": item.title,
                "description": item.description,
                "price": item.price,
                "itemImageLink": item.itemImageLink,
                "category": item.category,
                "size": req.body.size,
                "color": item.color,
                "seller": item.seller,
                "buyer": user.username,
                "date": new Date().toUTCString(),
                "phone": req.body.phone,
                "address": req.body.address,
                "shipped": false,
                "delivered": false,
                "itemId": item._id
            });
            yield newOrder.save();
            res.json({ message: "Item purchased successfully", totalPrice: totalPrice });
        }
        else {
            res.status(403).json({ message: "User not found" });
        }
    }
    else {
        res.status(403).json({ message: "Item not found" });
    }
}));
userRouter.post("/purchaseAll", middleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.findOne({ username: req.headers.username }).populate("cartItems");
    if (user) {
        const sizesArray = req.body.sizes;
        if (sizesArray.length !== user.cartItems.length) {
            return res.status(400).json({ message: "Provide size for all items" });
        }
        let totalPrice = 0;
        const cartitems = user.cartItems;
        for (let i = 0; i < cartitems.length; i++) {
            const item = cartitems[i];
            totalPrice += item.price;
            const newOrder = new Order_1.Order({
                "title": item.title,
                "description": item.description,
                "price": item.price,
                "itemImageLink": item.itemImageLink,
                "category": item.category,
                "size": sizesArray[i],
                "color": item.color,
                "seller": item.seller,
                "buyer": user.username,
                "date": new Date().toUTCString(),
                "phone": req.body.phone,
                "address": req.body.address,
                "shipped": false,
                "delivered": false,
                "itemId": item._id
            });
            yield newOrder.save();
        }
        res.json({ message: "Items Purchased Successfully", totalPrice: totalPrice });
    }
    else {
        res.status(403).json({ message: "User not found" });
    }
}));
exports.default = userRouter;
