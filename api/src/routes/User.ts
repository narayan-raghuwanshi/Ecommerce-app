import { Item } from "../db/Item";
import { User } from "../db/User";
import { Order } from "../db/Order";
import { authenticateJwt,secretKey } from "../middleware/middleware";
import jwt from "jsonwebtoken";
import express from "express";
const userRouter = express.Router()
/* User Routes */

userRouter.get("/me", authenticateJwt, (req, res) => {
    res.json({
        username: req.headers.username
    })
});
userRouter.post("/signup", async (req, res) => {
    const { fullName, username, password } = req.body;
    const user = await User.findOne({ username });
    if (user) {
        res.status(403).json({ message: "User already exists" });
    } else {
        const newUser = new User({ fullName, username, password });
        await newUser.save();
        const token = jwt.sign({ username, role: "user" }, secretKey, {
            expiresIn: '1h',
        });
        res.json({ message: "User created successfully", token });
    }
});

userRouter.post("/signin", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username,password });
    if (user) {
        const token = jwt.sign({ username, role: "user" }, secretKey, {
            expiresIn: '1h',
        });
        res.json({ message: "Logged in Successfully", token });
    } else {
        res.status(403).json({ message: "Invalid username or password" });
    }
});

userRouter.get("/items",authenticateJwt, async (req, res) => {
    const items = await Item.find({});
    res.json({items});
});

userRouter.get("/item/:itemId",authenticateJwt,async(req,res)=>{
    const item = await Item.findById(req.params.itemId);
    res.json({item});
});

userRouter.post("/cart/:itemId",authenticateJwt,async(req, res) => {
    const item:any = await Item.findById(req.params.itemId);                            /* Revisit any type */
    if(item){
        const user = await User.findOne({username: req.headers.username});
        if(user){
            user.cartItems.push(item);
            await user.save();
            res.json({message:"Item added to cart"});
        }else{
            res.status(403).json({message:"User not found"});
        }
    }else{
        res.status(403).json({message:"Item not found"});
    }
});

userRouter.get("/cart",authenticateJwt,async(req, res) => {
    const user = await User.findOne({username: req.headers.username}).populate("cartItems");
    if(user){
        res.json({cartItems: user.cartItems || []});
    }else{
        res.status(403).json({message:"User not found"});
    }
});

userRouter.post("/wishlist/:itemId",authenticateJwt,async(req, res) => {
    const item = await Item.findById(req.params.itemId);
    if(item){
        const user = await User.findOne({username: req.headers.username}).populate("wishlist");
        if(user){
            const index = user.wishlist.findIndex(w => w._id.toString() === req.params.itemId);
            if(index!==-1){
                res.json({message:"Item already in wishlist"});
            }else{
                user.wishlist.push(item);
                await user.save();
                res.json({message:"Item added to wishlist"});
            }
        }else{
            res.status(403).json({message:"User not found"});
        }
    }else{
        res.status(403).json({message:"Item not found"});
    }
});

userRouter.get("/wishlist",authenticateJwt,async(req, res) => {
    const user = await User.findOne({username: req.headers.username}).populate("wishlist");
    if(user){
        res.json({wishlist: user.wishlist || []});
    }else{
        res.status(403).json({message:"User not found"});
    }
});

userRouter.get("/orders",authenticateJwt,async(req, res) => {
    const user = await User.findOne({username: req.headers.username});
    if(user){
        const orders = await Order.find({buyer: user.username});
        res.json({orders: orders || []});
    }else{
        res.status(403).json({message:"User not found"});
    }
});

userRouter.patch("/deleteFromCart/:itemId",authenticateJwt,async(req,res)=>{
    const item = await Item.findById(req.params.itemId);
    if(item){
        const user = await User.findOne({username: req.headers.username});
        if(user){
            const itemIndex = user.cartItems.findIndex((item) => item._id.toString() === req.params.itemId);
            if(itemIndex !== -1){
                user.cartItems = user.cartItems.filter((item, index) => index !== itemIndex);
                await user.save();
                res.json({message:"Item removed from cart",cartItems: user.cartItems});
            }else{
                res.status(404).json({message:"Item is not in cart"});
            }
        }else{
            res.status(404).json({message:"User not found"});
        }
    }else{
        res.status(404).json({message:"Item not found"});
    }
});

userRouter.patch("/deleteFromWishlist/:itemId",authenticateJwt,async(req,res)=>{
    const item = await Item.findById(req.params.itemId);
    if(item){
        const user = await User.findOne({username: req.headers.username});
        if(user){
            const itemIndex = user.wishlist.findIndex((item) => item._id.toString() === req.params.itemId);
            if(itemIndex !== -1){
                user.wishlist = user.wishlist.filter((item, index) => index !== itemIndex);
                await user.save();
                res.json({message:"Item removed from wishlist",wishlist: user.wishlist});
            }else{
                res.status(404).json({message:"Item is not in wishlist"});
            }
        }else{
            res.status(404).json({message:"User not found"});
        }
    }else{
        res.status(404).json({message:"Item not found"});
    }
})

userRouter.post("/purchaseOne/:itemId",authenticateJwt,async(req, res) => {
    const item = await Item.findById(req.params.itemId).populate('price');
    if(item){
        const user = await User.findOne({username: req.headers.username});
        if(user){
            let totalPrice: number = item.price;
            const newOrder = new Order({
                "title": item.title,
                "description": item.description,
                "price": item.price,
                "itemImageLink": item.itemImageLink,
                "category": item.category,
                "size": req.body.size,
                "color": item.color,
                "seller": item.seller,               // revisit: make this required
                "buyer":user.username,
                "date": new Date().toUTCString(),
                "phone":req.body.phone,
                "address":req.body.address,
                "shipped":false,
                "delivered":false,
                "itemId":item._id
            });
            await newOrder.save();
            res.json({message:"Item purchased successfully",totalPrice: totalPrice});
        }else{
            res.status(403).json({message:"User not found"});
        }
    }else{
        res.status(403).json({message:"Item not found"});
    }
});

userRouter.post("/purchaseAll",authenticateJwt,async(req, res) => {
    const user = await User.findOne({username: req.headers.username}).populate("cartItems");
    if(user){
        const sizesArray = req.body.sizes;
        if(sizesArray.length !== user.cartItems.length){
            return res.status(400).json({message:"Provide size for all items"});
        }
        let totalPrice = 0;
        const cartitems =user.cartItems;
        for(let i=0;i<cartitems.length;i++){
            const item = cartitems[i]
            totalPrice += item.price;
            const newOrder = new Order({
                "title": item.title,
                "description": item.description,
                "price": item.price,
                "itemImageLink": item.itemImageLink,
                "category": item.category,
                "size": sizesArray[i],
                "color": item.color,
                "seller": item.seller,
                "buyer":user.username,
                "date": new Date().toUTCString(),
                "phone":req.body.phone,
                "address":req.body.address,
                "shipped":false,
                "delivered":false,
                "itemId":item._id
            });
            await newOrder.save();
        }
        res.json({message:"Items Purchased Successfully",totalPrice:totalPrice});
    }else{
        res.status(403).json({message:"User not found"});
    }
});

export default userRouter;