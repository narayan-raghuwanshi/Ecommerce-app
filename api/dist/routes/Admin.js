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
const Admin_1 = require("../db/Admin");
const Order_1 = require("../db/Order");
const middleware_1 = require("../middleware/middleware");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_1 = __importDefault(require("express"));
const adminRouter = express_1.default.Router();
adminRouter.get("/me", middleware_1.authenticateJwt, (req, res) => {
    res.json({
        username: req.headers.username
    });
});
adminRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, username, password, companyName } = req.body;
    const admin = yield Admin_1.Admin.findOne({ username });
    if (admin) {
        res.status(403).json({ message: "Admin already exists" });
    }
    else {
        const companyNameCheck = yield Admin_1.Admin.findOne({ companyName });
        if (companyNameCheck) {
            res.status(403).json({ message: "company name already in use" });
        }
        else {
            const newAdmin = new Admin_1.Admin({ fullName, username, password, companyName });
            yield newAdmin.save();
            const token = jsonwebtoken_1.default.sign({ username, role: "admin" }, middleware_1.secretKey, {
                expiresIn: '1h',
            });
            res.json({ message: "Admin created successfully", token });
        }
    }
}));
adminRouter.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const admin = yield Admin_1.Admin.findOne({ username, password });
    if (admin) {
        const token = jsonwebtoken_1.default.sign({ username, role: "admin" }, middleware_1.secretKey, {
            expiresIn: '1h',
        });
        res.json({ message: "Logged in Successfully", token });
    }
    else {
        res.status(403).json({ message: "Invalid username or password" });
    }
}));
adminRouter.get("/items", middleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield Admin_1.Admin.findOne({ username: req.headers.username });
    if (admin) {
        const items = yield Item_1.Item.find({});
        const myItems = items.filter(item => item.seller === admin.companyName);
        res.json({ items: myItems });
    }
    else {
        res.status(403).json({ message: "Admin not found" });
    }
}));
adminRouter.get("/item/:itemId", middleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield Admin_1.Admin.findOne({ username: req.headers.username });
    if (admin) {
        const item = yield Item_1.Item.findOne({ _id: req.params.itemId, seller: admin.companyName });
        res.json({ item: item });
    }
    else {
        res.status(403).json({ message: "Admin not found" });
    }
}));
adminRouter.post("/addItem", middleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const item = req.body;
    const admin = yield Admin_1.Admin.findOne({ username: req.headers.username });
    if (admin) {
        item.seller = admin.companyName;
        const newitem = new Item_1.Item(item);
        yield newitem.save();
        yield admin.save();
        res.json({ message: "Item added successfully" });
    }
    else {
        res.status(403).json({ message: "Admin not found" });
    }
}));
adminRouter.patch("/updateItem/:itemId", middleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let item = yield Item_1.Item.findById(req.params.itemId); // revisit null type
    if (item) {
        const admin = yield Admin_1.Admin.findOne({ username: req.headers.username });
        if (admin) {
            const updatingValue = req.body;
            for (const [key, value] of Object.entries(updatingValue)) {
                if (key !== 'seller' && key !== '_id') {
                    // @ts-ignore                                                                           revisit
                    item[key] = value;
                }
            }
            yield item.save();
            res.json({ message: "Item updated successfully", item: item });
        }
        else {
            res.status(403).json({ message: "Admin not found" });
        }
    }
    else {
        res.status(403).json({ message: "Item not found" });
    }
}));
adminRouter.delete("/deleteItem/:itemId", middleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield Admin_1.Admin.findOne({ username: req.headers.username });
    if (admin) {
        yield Item_1.Item.findByIdAndRemove(req.params.itemId);
        res.json({ message: "Item Deleted Successfully" });
    }
    else {
        res.status(403).json({ message: "Admin not found" });
    }
}));
adminRouter.get("/adminOrders", middleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield Admin_1.Admin.findOne({ username: req.headers.username });
    if (admin) {
        const orders = yield Order_1.Order.find({});
        const myOrders = orders.filter(order => order.seller === admin.companyName);
        res.json({ orders: myOrders });
    }
    else {
        res.status(403).json({ message: "Admin not found" });
    }
}));
adminRouter.put("/ship/:orderId", middleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield Admin_1.Admin.findOne({ username: req.headers.username });
    if (admin) {
        const order = yield Order_1.Order.findById(req.params.orderId);
        if (order) {
            order.shipped = true;
            yield order.save();
            res.json({ message: "Order Shipped Successfully" });
        }
        else {
            res.status(403).json({ message: "Order not found" });
        }
    }
    else {
        res.status(403).json({ message: "Admin not found" });
    }
}));
adminRouter.put("/deliver/:orderId", middleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield Admin_1.Admin.findOne({ username: req.headers.username });
    if (admin) {
        const order = yield Order_1.Order.findById(req.params.orderId);
        if (order) {
            order.delivered = true;
            yield order.save();
            res.json({ message: "Order Delivered Successfully" });
        }
        else {
            res.status(403).json({ message: "Order not found" });
        }
    }
    else {
        res.status(403).json({ message: "Admin not found" });
    }
}));
exports.default = adminRouter;
