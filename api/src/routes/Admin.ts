import { Item } from "../db/Item";
import { Admin } from "../db/Admin";
import { Order } from "../db/Order";
import { UpdateItemType } from "../types/UpdateItemType";
import { ItemType } from "../types/ItemType";
import { authenticateJwt,secretKey } from "../middleware/middleware";
import jwt from "jsonwebtoken";
import express from "express";
const adminRouter = express.Router()


adminRouter.get("/me", authenticateJwt, (req, res) => {
    res.json({
        username: req.headers.username
    })
});
adminRouter.post("/signup", async (req, res) => {
    const { fullName, username, password,companyName } = req.body;
    const admin = await Admin.findOne({ username });
    if (admin) {
        res.status(403).json({ message: "Admin already exists" });
    } else {
        const companyNameCheck = await Admin.findOne({ companyName});
        if(companyNameCheck){
            res.status(403).json({ message: "company name already in use" });
        }else{
            const newAdmin = new Admin({ fullName, username, password,companyName });
            await newAdmin.save();
            const token = jwt.sign({ username, role: "admin" }, secretKey, {
                expiresIn: '1h',
            });
            res.json({ message: "Admin created successfully", token });
        }
    }
});

adminRouter.post("/signin", async (req, res) => {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username,password });
    if (admin) {
        const token = jwt.sign({ username, role: "admin" }, secretKey, {
            expiresIn: '1h',
        });
        res.json({ message: "Logged in Successfully", token });
    } else {
        res.status(403).json({ message: "Invalid username or password" });
    }
});

adminRouter.get("/items",authenticateJwt, async (req, res) => {
    const admin = await Admin.findOne({username: req.headers.username});
    if(admin){
        const items = await Item.find({});
        const myItems = items.filter(item=>item.seller===admin.companyName);
        res.json({items: myItems});
    }else{
        res.status(403).json({message:"Admin not found"});
    }
});

adminRouter.get("/item/:itemId",authenticateJwt,async(req,res)=>{
    const admin = await Admin.findOne({username: req.headers.username});
    if(admin){
        const item = await Item.findOne({_id:req.params.itemId,seller:admin.companyName});
        res.json({item: item});
    }else{
        res.status(403).json({message:"Admin not found"});
    }
});

adminRouter.post("/addItem",authenticateJwt,async(req,res)=>{
    const item:ItemType = req.body;
    const admin = await Admin.findOne({username: req.headers.username});
    if(admin){
        item.seller = admin.companyName;
        const newitem = new Item(item);
        await newitem.save();
        await admin.save();
        res.json({message:"Item added successfully"});
    }else{
        res.status(403).json({message:"Admin not found"});
    }
});

adminRouter.patch("/updateItem/:itemId",authenticateJwt,async(req,res)=>{
    let item = await Item.findById(req.params.itemId);                                      // revisit null type
    if(item){
        const admin = await Admin.findOne({username: req.headers.username});
        if(admin){
            const updatingValue:UpdateItemType = req.body;
            for(const[key,value] of Object.entries(updatingValue)){
                if(key !== 'seller' && key!=='_id'){
                    // @ts-ignore                                                                           revisit
                    item[key] = value;
                }
            }
            await item.save();
            res.json({message:"Item updated successfully",item:item});
        }else{
            res.status(403).json({message:"Admin not found"});
        }
    }else{
        res.status(403).json({message:"Item not found"});
    }
});

adminRouter.delete("/deleteItem/:itemId",authenticateJwt,async(req,res)=>{
    const admin = await Admin.findOne({username: req.headers.username});
    if(admin){
        await Item.findByIdAndRemove(req.params.itemId);
        res.json({message:"Item Deleted Successfully"});
    }else{
        res.status(403).json({message:"Admin not found"});
    }
});

adminRouter.get("/adminOrders",authenticateJwt,async(req,res)=>{
    const admin = await Admin.findOne({username: req.headers.username});
    if(admin){
        const orders = await Order.find({});
        const myOrders = orders.filter(order=>order.seller===admin.companyName);
        res.json({orders: myOrders});
    }else{
        res.status(403).json({message:"Admin not found"});
    }
});

adminRouter.put("/ship/:orderId",authenticateJwt,async(req,res)=>{
    const admin = await Admin.findOne({username: req.headers.username});
    if(admin){
        const order = await Order.findById(req.params.orderId);
        if(order){
            order.shipped = true;
            await order.save();
            res.json({message: "Order Shipped Successfully"});
        }else{
            res.status(403).json({message:"Order not found"});
        }
    }else{
        res.status(403).json({message:"Admin not found"});
    }
})
adminRouter.put("/deliver/:orderId",authenticateJwt,async(req,res)=>{
    const admin = await Admin.findOne({username: req.headers.username});
    if(admin){
        const order = await Order.findById(req.params.orderId);
        if(order){
            order.delivered = true;
            await order.save();
            res.json({message: "Order Delivered Successfully"});
        }else{
            res.status(403).json({message:"Order not found"});
        }
    }else{
        res.status(403).json({message:"Admin not found"});
    }
})

export default adminRouter;