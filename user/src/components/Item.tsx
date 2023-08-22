import { useEffect, useState } from "react";
import Typography from '@mui/material/Typography';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Button } from "@mui/material";
import { BASE_URL } from "../config";
import Loader from "./Loader";
export default function Item() {
    const [item, setItem] = useState<any>({});
    const [favourites, setFavourites] = useState(Boolean);
    const { itemId } = useParams();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchWishlist = async () => {
            const response = await axios.get(`${BASE_URL}/user/wishlist`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            })
            const itemIndex = response.data.wishlist.findIndex((d: any) => d._id === itemId);
            (itemIndex !== -1) ? setFavourites(true) : setFavourites(false);
        }
        const fetchItem = async () => {
            const response = await axios.get(`${BASE_URL}/user/item/${itemId}`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            })
            setItem(response.data.item);
            setLoading(false);
        }
        fetchWishlist();
        fetchItem();
    }, [])

    if (loading) {
        return <Loader></Loader>
    }

    return (
        <div className="item-container">
            <img src={item.itemImageLink} className="item-item-image"></img>
            <div>
                <ItemDetails item={item}></ItemDetails>
                <Buttons favourites={favourites} setFavourites={setFavourites} itemId={itemId}></Buttons>
            </div>
        </div>
    )
}

function ItemDetails({ item }: any) {
    return (
        <div className="item-itemdetails-main-div">
            <Typography sx={{ margin: "5px 5px 5px 0px" }}><b>Name:</b> {item.title}</Typography>
            <Typography sx={{ margin: "5px 0" }}><b>Description:</b> {item.description}</Typography>
            <Typography sx={{ margin: "5px 0" }}><b>Category:</b> {item.category}</Typography>
            <Typography sx={{ margin: "5px 0" }}><b>Price:</b> ${item.price}</Typography>
            <Typography sx={{ margin: "5px 0" }}><b>Rating:</b> {item.rating}</Typography>
            <Typography sx={{ margin: "5px 0" }}><b>Sizes:</b> {item.sizes}</Typography>
            <Typography sx={{ margin: "5px 0" }}><b>Color:</b> {item.color}</Typography>
        </div>
    )
}

function Buttons({ favourites, setFavourites, itemId }: any) {
    const navigate = useNavigate();

    const authHeader = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    };

    const favouritesHandler = async () => {
        if (!favourites) {
            const response = await axios.post(`${BASE_URL}/user/wishlist/${itemId}`, {
            }, authHeader)
            if (response) {
                setFavourites(true);
                alert(response.data.message);
            }
        } else {
            const response = await axios.patch(`${BASE_URL}/user/deleteFromWishlist/${itemId}`, {
            }, authHeader)
            if (response) {
                setFavourites(false);
                alert(response.data.message);
            }
        }
    }

    const cartHandler = async () => {
        const response = await axios.post(`${BASE_URL}/user/cart/${itemId}`, {
        }, authHeader)
        if (response) alert(response.data.message);
    }

    return (
        <div className="item-buttons-main-div">
            <Button variant="contained" style={{ width: "215px" }} onClick={() => navigate(`/buypage/${itemId}`)}>BUY NOW</Button>
            <div className="item-buttons-fav-cart-buttons-div">
                <Button onClick={cartHandler} variant="outlined">ADD to cart</Button>
                {favourites ? (
                    <Button onClick={favouritesHandler} sx={{ color: "#d05260f1" }}><FavoriteIcon></FavoriteIcon></Button>
                ) : (
                    <Button onClick={favouritesHandler}><FavoriteBorderOutlinedIcon></FavoriteBorderOutlinedIcon></Button>
                )}
            </div>
        </div>
    )
}