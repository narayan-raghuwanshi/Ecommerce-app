import * as React from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";

/* MUI */
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Avatar from '@mui/material/Avatar';
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

/* Local Lirbrary */
import { userState } from "../store/atoms/user";
import { userEmailSelector } from "../store/selectors/userEmailSelector";
import { loadingSelector } from "../store/selectors/loadingSelector";

import logo from "./assets/logo.png";
import profilelogo from "./assets/profilelogo.png";
import Loader from "./Loader";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

/* Start */
export default function Appbar() {
    const loading = useRecoilValue(loadingSelector);
    const userEmail = useRecoilValue(userEmailSelector);
    const navigate = useNavigate();
    if(loading){
        return <Loader/>
    }
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ backgroundColor: "#f7f5f5", color: "black" }}>
                <Toolbar>
                    <div style={{ flexGrow: 1 }}>
                        <img onClick={() => {navigate("/")}} src={logo} style={{ width: "150px", margin: "5px 0 0 0" }}></img>
                    </div>
                    {(userEmail) ? <LoggedAppbar /> : <NotLoggedAppbar />}
                </Toolbar>
            </AppBar>
        </Box>
    )
}
function LoggedAppbar() {
    const navigate = useNavigate();
    const handleCart = () => navigate("/cart");
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <ShoppingCartOutlinedIcon onClick={handleCart}></ShoppingCartOutlinedIcon>
            <ToggleMenu></ToggleMenu>
        </div>
    );
}
function ToggleMenu() {
    const setUser = useSetRecoilState(userState);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleNavigation = (route: any) => {
        setAnchorEl(null);
        navigate(route);
    };
    const handleOrders = () => handleNavigation("/orders");
    const handleWishlist = () => handleNavigation("/wishlist");
    const handleHome = () => handleNavigation("/home");
    const handleLogout = () => {
        setAnchorEl(null);
        setUser({
            //@ts-ignore
            userEmail: null,
            loading:false
        });
        navigate("/signin");
        localStorage.removeItem("token");
    };

    return (
        <div>
            <Button onClick={handleClick}>
                <Avatar alt="toggle menu" src={profilelogo} />
            </Button>
            <Menu
                MenuListProps={{
                    "aria-labelledby": "fade-button"
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleHome}>Home</MenuItem>
                <MenuItem onClick={handleOrders}>My Orders</MenuItem>
                <MenuItem onClick={handleWishlist}>Wishlist</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </div>
    )
}
function NotLoggedAppbar() {
    const navigate = useNavigate();
    return (
        <div>
            <Button
                color="inherit"
                variant="outlined"
                sx={{ marginRight: "10px" }}
                onClick={() => navigate("/signup")}>
                Register
            </Button>
            <Button
                color="inherit"
                variant="outlined"
                onClick={() => navigate("/signin")}>
                Login
            </Button>
        </div>
    );
}
