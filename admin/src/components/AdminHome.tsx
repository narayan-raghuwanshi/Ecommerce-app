import { useEffect, useState } from "react";
import Typography from '@mui/material/Typography';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";
import Loader from "./Loader";
export default function AdminHome() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            const response = await axios.get(`${BASE_URL}/admin/items`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setItems(response.data.items);
            setLoading(false);
        };
        fetchItems();
    }, [])

    if (loading) {
        return (<Loader></Loader>)
    }

    return (
        <div className="home-container">
            {items.map(item => <EachItem item={item}></EachItem>)}
        </div>
    )
}

function EachItem({ item }: any) {
    const navigate = useNavigate();
    const handleItemClick = () => navigate(`/item/${item._id}`)

    return (
        <div className="home-item-main-div" onClick={handleItemClick}>
            <img className="home-item-image" src={item.itemImageLink}></img>
            <div className="home-item-details-div">
                <Typography variant="body1">{item.title}</Typography>
                <Typography variant="caption">{item.description}</Typography>
                <Typography variant="caption">$ {item.price}</Typography>
                <Typography variant="caption">Sizes: {item.sizes}</Typography>
            </div>
        </div>
    )
}