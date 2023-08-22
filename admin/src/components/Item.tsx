import { useEffect, useState } from "react";
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Button } from "@mui/material";
import Loader from "./Loader";
import { itemTitle } from "../store/selectors/itemSelector";
import { itemDescription } from "../store/selectors/itemSelector";
import { itemPrice } from "../store/selectors/itemSelector";
import { itemItemImageLink } from "../store/selectors/itemSelector";
import { itemSizes } from "../store/selectors/itemSelector";
import { itemCategory } from "../store/selectors/itemSelector";
import { itemRating } from "../store/selectors/itemSelector";
import { itemColor } from "../store/selectors/itemSelector";
import { itemState } from "../store/atoms/item";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { BASE_URL } from "../config";
import DeleteIcon from '@mui/icons-material/Delete';
function Item() {
    const [loading, setLoading] = useState(true);
    const setItem = useSetRecoilState(itemState);
    const { itemId } = useParams();
    useEffect(() => {
        axios.get(`${BASE_URL}/admin/item/${itemId}`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        }).then((response) => {
            let data = response.data;
            setItem({item:data.item});
            setLoading(false);
        }).catch(()=>{
            setItem({item:null});
            setLoading(false);
        })
    }, [])
    if (loading) {
        return <Loader></Loader>
    }

    return (
        <div className="item-container">
            <DetailsCard></DetailsCard>
            <UpdateBox></UpdateBox>
        </div>
    )
}

function UpdateBox() {
    const [itemDetails, setItem] = useRecoilState(itemState);
    const item: any = itemDetails.item;
    const navigate = useNavigate();

    const [title, setTitle] = useState(item.title);
    const [description, setDescription] = useState(item.description);
    const [category, setCategory] = useState(item.category);
    const [itemImageLink, setImageLink] = useState(item.itemImageLink);
    const [price, setPrice] = useState(item.price);
    const [sizes, setSizes] = useState(item.sizes);
    const [rating, setRating] = useState(item.rating);
    const [color, setColor] = useState(item.color);
    const itemId = item._id;

    const titleChange = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)
    const descriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)
    const imageChange = (e: React.ChangeEvent<HTMLInputElement>) => setImageLink(e.target.value)
    const categoryChange = (e: React.ChangeEvent<HTMLInputElement>) => setCategory(e.target.value)
    const priceChange = (e: React.ChangeEvent<HTMLInputElement>) => setPrice(e.target.value)
    const sizesChange = (e: React.ChangeEvent<HTMLInputElement>) => setSizes(e.target.value)
    const ratingChange = (e: React.ChangeEvent<HTMLInputElement>) => setRating(e.target.value)
    const colorChange = (e: React.ChangeEvent<HTMLInputElement>) => setColor(e.target.value)

    const authHeader = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    };

    const handleUpdate = async () => {
        const response = await axios.patch(`${BASE_URL}/admin/updateItem/${itemId}`, {
            title,
            description,
            price,
            itemImageLink,
            category,
            rating,
            sizes,
            color
        }, authHeader)
        let data = response.data;
        setItem({item:data.item});
    }

    const handleDelete = () => {
        axios.delete(`${BASE_URL}/admin/deleteItem/${itemId}`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        }).then((response) => {
            let data = response.data;
            setItem({item:data.item});
            navigate('/home');
        })
    }

    return (
        <div>
            <div className="item-updatecard-main-div">
                <TextField style={{ margin: "6px" }} label="Title" onChange={titleChange} value={title} variant="outlined" />
                <TextField style={{ margin: "6px" }} label="Description" onChange={descriptionChange} value={description} variant="outlined" />
                <TextField style={{ margin: "6px" }} label="Image Link" onChange={imageChange} value={itemImageLink} variant="outlined" />
                <TextField style={{ margin: "6px" }} label="Category" onChange={categoryChange} value={category} variant="outlined" />
                <TextField style={{ margin: "6px" }} label="Color" onChange={colorChange} value={color} variant="outlined" />
                <TextField style={{ margin: "6px" }} label="Price" onChange={priceChange} value={price} variant="outlined" />
                <TextField style={{ margin: "6px" }} label="Rating" onChange={ratingChange} value={rating} variant="outlined" />
                <TextField style={{ margin: "6px" }} label="sizes( separated by comma )" onChange={sizesChange} value={sizes} variant="outlined" />
                <div className="item-updatecard-button-div">
                    <Button variant="contained" onClick={handleUpdate}>Save</Button>
                    <Button variant="outlined" onClick={handleDelete} startIcon={<DeleteIcon />}>DELETE</Button>
                </div>
            </div>
        </div>
    )
}

function DetailsCard() {

    const title = useRecoilValue(itemTitle);
    const description = useRecoilValue(itemDescription);
    const itemImageLink = useRecoilValue(itemItemImageLink);
    const category = useRecoilValue(itemCategory);
    const price = useRecoilValue(itemPrice);
    const rating = useRecoilValue(itemRating);
    const sizes = useRecoilValue(itemSizes);
    const color = useRecoilValue(itemColor);

    return (
        <div>
            <div className="item-detailscard-main-div">
                <img src={itemImageLink} className="item-detailscard-item-image"></img>
                <div className="item-detailscard-details-div">
                    <Typography sx={{ margin: "25px 5px 5px 0px" }}><b>Name:</b> {title}</Typography>
                    <Typography sx={{ margin: "5px 0" }} variant="caption"><b>Description:</b> {description}</Typography>
                    <Typography sx={{ margin: "5px 0" }} variant="caption"><b>Category:</b> {category}</Typography>
                    <Typography sx={{ margin: "5px 0" }} variant="caption"><b>Price:</b> ${price}</Typography>
                    <Typography sx={{ margin: "5px 0" }} variant="caption"><b>Rating:</b> {rating}</Typography>
                    <Typography sx={{ margin: "5px 0" }} variant="caption"><b>Sizes:</b> {sizes}</Typography>
                    <Typography sx={{ margin: "5px 0" }} variant="caption"><b>Color:</b> {color}</Typography>
                </div>
            </div>
        </div>
    )
}
export default Item;