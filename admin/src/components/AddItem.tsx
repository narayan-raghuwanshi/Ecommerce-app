import { useState } from "react";
import TextField from '@mui/material/TextField';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@mui/material";
import { BASE_URL } from "../config";
function AddItem() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [itemImageLink, setImageLink] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [rating, setRating] = useState("");
    const [sizes, setSizes] = useState("");
    const [color, setColor] = useState("");
    const navigate = useNavigate();

    const authHeader = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    };

    const handleSave = async() => {
        const response = await axios.post(`${BASE_URL}/admin/addItem`,{
            title,
            description,
            price,
            itemImageLink,
            category,
            rating,
            sizes,
            color
        },authHeader)
        let data = response.data;
        alert(data.message);
        navigate('/home');
    }

    const titleChange=(e:React.ChangeEvent<HTMLInputElement>)=>setTitle(e.target.value)
    const descriptionChange=(e:React.ChangeEvent<HTMLInputElement>)=>setDescription(e.target.value)
    const imageChange=(e:React.ChangeEvent<HTMLInputElement>)=>setImageLink(e.target.value)
    const categoryChange=(e:React.ChangeEvent<HTMLInputElement>)=>setCategory(e.target.value)
    const priceChange=(e:React.ChangeEvent<HTMLInputElement>)=>setPrice(e.target.value)
    const sizesChange=(e:React.ChangeEvent<HTMLInputElement>)=>setSizes(e.target.value)
    const ratingChange=(e:React.ChangeEvent<HTMLInputElement>)=>setRating(e.target.value)
    const colorChange=(e:React.ChangeEvent<HTMLInputElement>)=>setColor(e.target.value)

    return (
        <div className="additem-container">
            <div className="additem-main-div">
                <TextField style={{ margin: "6px" }} label="Title" onChange={titleChange} variant="outlined" />
                <TextField style={{ margin: "6px" }} label="Description" onChange={descriptionChange} variant="outlined" />
                <TextField style={{ margin: "6px" }} label="Image Link" onChange={imageChange} variant="outlined" />
                <TextField style={{ margin: "6px" }} label="Category" onChange={categoryChange} variant="outlined" />
                <TextField style={{ margin: "6px" }} label="Price" onChange={priceChange} variant="outlined" />
                <TextField style={{ margin: "6px" }} label="Rating" onChange={ratingChange} variant="outlined" />
                <TextField style={{ margin: "6px" }} label="sizes( separated by comma )" onChange={sizesChange} variant="outlined" />
                <TextField style={{ margin: "6px" }} label="Color" onChange={colorChange} variant="outlined" />
                <Button  sx={{width:"150px",margin:"10px 7px"}} variant="contained" onClick={handleSave}>Save</Button>
            </div>
        </div>
    )
}
export default AddItem;