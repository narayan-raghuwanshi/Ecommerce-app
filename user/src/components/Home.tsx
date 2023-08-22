import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* External Library */
import axios from "axios";

/* MUI */
import Typography from '@mui/material/Typography';
import { Button } from "@mui/material";

/* Local Imports */
import { BASE_URL } from "../config";
import Loader from "./Loader";

/* Start */
export default function UserHome() {
    const [items, setItems] = useState([]);
    const [loading,setLoading] = useState(true);
    useEffect(() => {
        const fetchItems = async () => {
            const response = await axios.get(`${BASE_URL}/user/items`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setItems(response.data.items);
            setLoading(false);
        };
        fetchItems();
    }, [])
    if(loading){return <Loader></Loader>}
    return (
        <div className="home-container">
            {items.map(item => <EachItem item={item}></EachItem>)}
        </div>
    )
}
function EachItem({ item }: any) {
    const navigate = useNavigate();
    const handleItemClick=()=>navigate(`/item/${item._id}`)
    const handleBuyClick=()=>navigate(`/buypage/${item._id}`)
    return (
        <div className="home-item-div">
            <img className="home-item-image" onClick={handleItemClick} src={item.itemImageLink}></img>
            <div className="home-item-content-div">
                <Typography variant="caption">{item.title}</Typography>
                <div className="home-item-content-button-div">
                    <Typography variant="subtitle1" sx={{ marginTop: "5px" }}><b>${item.price}</b></Typography>
                    <Button variant="text" onClick={handleBuyClick}>Buy</Button>
                </div>
            </div>
        </div>
    )
}