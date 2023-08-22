import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* MUI */
import Typography from '@mui/material/Typography';
import { Button } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

/* External Library */
import axios from "axios";

/* Local Imports */
import { BASE_URL } from "../config";
import Loader from "./Loader";

/* Start */
export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [loading,setLoading] = useState(true);
    useEffect(() => {
        const fetchCart = async () => {
            const response = await axios.get(`${BASE_URL}/user/cart`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setCartItems(response.data.cartItems);
            setLoading(false);
        };
        fetchCart();
    }, [cartItems])
    if(loading){return <Loader></Loader>}
    return (
        <div className="cart-container">
            <Typography variant="subtitle1">Cart</Typography>
            <div className="cart-item-container">
                {cartItems.map(item => <EachItem setCartItems={setCartItems} item={item}></EachItem>)}
            </div>
        </div>
    )
}

function EachItem({ item, setCartItems }: any) {
    const navigate = useNavigate();
    const authHeader = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    };
    const cartHandler = async () => {
        const response = await axios.patch(`${BASE_URL}/user/deleteFromCart/${item._id}`, {
        }, authHeader);
        setCartItems(response.data.cartItems);
    };
    const handleItemClick = () => navigate(`/item/${item._id}`)
    const handleBuyClick = () => navigate(`/buypage/${item._id}`)
    return (
        <div className="cart-item-div">
            <img className="cart-item-image" src={item.itemImageLink} onClick={handleItemClick}></img>
            <div className="cart-item-content-div" onClick={handleItemClick}>
                <Typography variant="caption">{item.title}</Typography>
                <Typography variant="subtitle1" sx={{ marginTop: "5px" }}><b>${item.price}</b></Typography>
            </div>
            <div className="cart-item-buttons-div">
                <Button variant="text" onClick={handleBuyClick} sx={{ width: "60px" }}>Buy</Button>
                <Button onClick={cartHandler} variant="text" color="error"><DeleteIcon /></Button>
            </div>
        </div>
    )
}