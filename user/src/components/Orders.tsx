import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* MUI */
import Typography from '@mui/material/Typography';
import { Button } from "@mui/material";

/* External Library */
import axios from "axios";

/* Local Imports */
import { BASE_URL } from "../config";
import Loader from "./Loader";

/* Start */
function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchOrders = async () => {
            const response = await axios.get(`${BASE_URL}/user/orders`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setOrders(response.data.orders);
            setLoading(false);
        };
        fetchOrders();
    }, [])
    if(loading){return <Loader></Loader>}
    return (
        <div className="orders-container">
            <Typography variant="subtitle1">Orders</Typography>
            <div className="orders-item-container">
                {orders.map(order => <EachOrder order={order}></EachOrder>)}
            </div>
        </div>
    )
}
function EachOrder({ order }: any) {
    const [shipped] = useState(order.shipped);
    const [delivered] = useState(order.delivered);
    const navigate = useNavigate();
    const handleItemClick = () => navigate(`/item/${order.itemId}`)
    return (
        <div className="orders-item-div" onClick={handleItemClick}>
            <img className="orders-item-image" src={order.itemImageLink}></img>
            <div className="orders-item-content-div">
                <Typography variant="subtitle1"><b>{order.title}</b></Typography>
                <Typography variant="subtitle2"><b>Size: {order.size}</b></Typography>
                <Typography variant="subtitle2"><b>Price: ${order.price}</b></Typography>
                <Typography variant="subtitle2">{order.date}</Typography>
                <Typography variant="subtitle2">{order.address}</Typography>
                <Typography variant="subtitle2">{order.phone}</Typography>
                <hr />
                {delivered ? (
                    <Button disabled>Delivered</Button>
                ) : (
                    <>{shipped ? (
                        <Button disabled style={{color:"#de840d"}}>Shipped</Button>
                    ) : (
                        <Button disabled style={{color:"#0cc057"}}>Order Received</Button>
                    )}</>
                )}
            </div>
        </div>
    )
}
export default Orders;