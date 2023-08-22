import { useEffect, useState } from "react";
import Typography from '@mui/material/Typography';
import axios from "axios";
import { Button } from "@mui/material";
import { BASE_URL } from "../config";
import Loader from "./Loader";
function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async() =>{
            const response = await axios.get(`${BASE_URL}/admin/adminOrders`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            })
            setOrders(response.data.orders);
            setLoading(false);
        }
        fetchOrders();
    }, [])

    if(loading){
        return <Loader></Loader>
    }
    return (
        <div className="order-container">
            {orders.map((order) => {
                return (<EachOrder order={order}></EachOrder>)
            })}
        </div>
    )
}

function EachOrder({ order }: any) {
    const [shipped, setShipped] = useState(order.shipped);
    const [delivered, setDelivered] = useState(order.delivered);

    const authHeader = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    };

    const shipHandler = async() => {
        const response = await axios.put(`${BASE_URL}/admin/ship/${order._id}`, {
        }, authHeader)
        if(response){
            setShipped(true);
            alert(response.data.message)
        }
    }

    const deliveryHandler = async() => {
        const response = await axios.put(`${BASE_URL}/admin/deliver/${order._id}`, {
        }, authHeader)
        if(response){
            setDelivered(true);
            alert(response.data.message)
        }
    }

    return (
        <div style={{ display: "flex", flexDirection: "row", margin: "20px" }}>

            <div className="order-item-main-div">
                <div className="order-item-imageside-div">
                    <img className="order-item-image" src={order.itemImageLink}></img>
                    {(shipped && delivered) ? (
                        <Button disabled style={{ width: "90px", height: "30px" }}>Delivered</Button>
                    ) : (
                        <div>
                            {(shipped) ? (
                                <Button onClick={deliveryHandler} variant="contained" color="success" style={{ width: "90px", height: "30px" }}>Deliver</Button>
                            ) : (
                                <Button onClick={shipHandler} variant="contained" style={{ width: "90px", height: "30px" }}>SHIP</Button>)}
                        </div>
                    )}
                </div>
                <div className="order-item-details-div">
                    <Typography variant="body1">{order.title}</Typography>
                    <Typography variant="caption">Email: {order.buyer}</Typography>
                    <Typography variant="caption">Phone: {order.phone}</Typography>
                    <Typography variant="caption">Address: {order.address}</Typography>
                    <Typography variant="caption">Price: ${order.price}</Typography>
                    <Typography variant="caption">Size: {order.size}</Typography>
                </div>
            </div>
        </div>
    )
}
export default Orders;