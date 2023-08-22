import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom";

/* External Library */
import axios from "axios";

/* MUI */
import { Button, TextField, Typography } from "@mui/material";
import Avatar from '@mui/material/Avatar';

/* Local Imports */
import { BASE_URL } from "../config";
import Loader from "./Loader";

/* Start */
export default function Buypage() {
    const [item, setItem] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const { itemId } = useParams();
    useEffect(() => {
        const fetchItem = async () => {
            const response = await axios.get(`${BASE_URL}/user/item/${itemId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setItem(response.data.item);
            setLoading(false);
        }
        fetchItem();
    }, [itemId])
    if(loading){return <Loader></Loader>}
    let sizesArray: string[] = [];
    if (item.sizes) {
        sizesArray = item.sizes.split(",");
    }
    return (
        <div className="buypage-conatiner">
            <img className="buypage-item-image" src={item.itemImageLink}></img>
            <OrderBox sizesArray={sizesArray} item={item}></OrderBox>
        </div>
    )
}
function OrderBox({ sizesArray, item }: any) {
    const navigate = useNavigate();
    const [size, setSize] = useState(sizesArray[0]);
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const handleAddressChange = (event: React.ChangeEvent<{ value: string }>) => setAddress(event.target.value as string)
    const handlePhoneChange = (event: React.ChangeEvent<{ value: string }>) => setPhone(event.target.value as string)
    const authHeader = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    };
    const handleOrder = async () => {
        const response = await axios.post(`${BASE_URL}/user/purchaseOne/${item._id}`, {
            size,
            address,
            phone
        }, authHeader);
        alert(response.data.message);
        navigate("/orders");
    }
    return (
        <div className="buypage-orderbox-main-div">
            <Typography variant="h6">{item.title}</Typography>
            <div className="buypage-orderbox-sizeselector-div">
                <Typography>Size: </Typography>
                {sizesArray.map((s: any) => <Avatar onClick={()=>{
                    setSize(s as string);
                }} sx={{width:"35px",height:"35px",fontSize:"15px",backgroundColor:s===size?"black":"rgb(220, 214, 214)",color:s===size?"white":"black",border:s===size?"1px solid black":"none"}}>{s}</Avatar>)}
            </div>
            <TextField
                multiline
                label="Address"
                onChange={handleAddressChange}
                rows={2}
            />
            <TextField
                label="Phone"
                onChange={handlePhoneChange}
            />
            <div className="buypage-orderbox-orderdetails-div">
                <Typography variant="subtitle2">Address: {address}</Typography>
            <Typography variant="subtitle2">Size:{size}</Typography>
                <Typography variant="subtitle2">Payment mode: Cash on delivery</Typography>
                <Typography variant="subtitle2">Total Price: ${item.price}</Typography>
            </div>
            <Button variant="contained" onClick={handleOrder}>Order</Button>
        </div>
    );
}