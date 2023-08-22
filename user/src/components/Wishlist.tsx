import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* MUI */
import Typography from '@mui/material/Typography';
import { Button } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';

/* External Library */
import axios from "axios";

/* Local Imports */
import { BASE_URL } from "../config";
import Loader from "./Loader";

/* Start */
export default function Wishlist() {
    const [wishlist, setWishlist] = useState([]);
    const [loading,setLoading] = useState(true);
    useEffect(() => {
        const fetchWishlist = async () => {
            const response = await axios.get(`${BASE_URL}/user/wishlist`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setWishlist(response.data.wishlist);
            setLoading(false);
        };
        fetchWishlist();
    }, [wishlist])
    if(loading){return <Loader></Loader>}
    return (
        <div className="wishlist-container">
            <Typography variant="subtitle1">Wishlist</Typography>
            <div className="wishlist-item-container">
                {wishlist.map(item => <EachItem setWishlist={setWishlist} item={item}></EachItem>)}
            </div>
        </div>
    )
}

function EachItem({ item, setWishlist }: any) {
    const navigate = useNavigate();
    const authHeader = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    };
    const favouritesHandler = async () => {
        const response = await axios.patch(`${BASE_URL}/user/deleteFromWishlist/${item._id}`, {
        }, authHeader);
        setWishlist(response.data.wishlist);
    };
    const handleItemClick = () => navigate(`/item/${item._id}`)
    const handleBuyClick = () => navigate(`/buypage/${item._id}`)
    return (
        <div className="wishlist-item-div">
            <img className="wishlist-item-image" src={item.itemImageLink} onClick={handleItemClick}></img>
            <div className="wishlist-item-content-div" onClick={handleItemClick}>
                <Typography variant="caption">{item.title}</Typography>
                <Typography variant="subtitle1" sx={{ marginTop: "5px" }}><b>${item.price}</b></Typography>
            </div>
            <div className="wishlist-item-buttons-div">
                <Button variant="text" onClick={handleBuyClick} sx={{ width: "60px" }}>Buy</Button>
                <Button onClick={favouritesHandler} sx={{ color: "#d05260f1" }}><FavoriteIcon></FavoriteIcon></Button>
            </div>
        </div>
    )
}