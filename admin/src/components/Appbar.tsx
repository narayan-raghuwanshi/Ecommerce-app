import { useSetRecoilState, useRecoilValue } from "recoil";
import { adminEmailSelector } from "../store/selectors/adminEmailSelector";
import { useNavigate } from "react-router-dom";
import { adminState } from "../store/atoms/admin";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import logo from "./assets/logo.png";
import profilelogo from "./assets/profilelogo.png"
import React from "react";
import { Avatar, Menu, MenuItem } from "@mui/material";
function Appbar() {
    const adminEmail = useRecoilValue(adminEmailSelector);
    const navigate = useNavigate();
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ backgroundColor: "#f7f5f5", color: "black" }}>
                <Toolbar>
                    <div style={{ flexGrow: 1 }}>
                        <img onClick={() => { navigate("/") }} src={logo} style={{ width: "150px", margin: "5px 0 0 0" }}></img>
                    </div>
                    {(adminEmail) ? <LoggedAppbar /> : <Button variant="outlined" color="inherit" onClick={()=>navigate("/signin")}>login</Button>}
                </Toolbar>
            </AppBar>
        </Box>
    )
}

function LoggedAppbar() {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <ToggleMenu></ToggleMenu>
        </div>
    );
}

function ToggleMenu() {
    const setAdmin = useSetRecoilState(adminState);
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
    const handleAddItem = () => handleNavigation("/additem");
    const handleHome = () => handleNavigation("/home");
    const handleLogout = () => {
        setAnchorEl(null);
        setAdmin({
            //@ts-ignore
            adminEmail: null,
            loading: false
        });
        navigate("/");
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
                <MenuItem onClick={handleOrders}>Orders</MenuItem>
                <MenuItem onClick={handleAddItem}>Add Item</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </div>
    )
}
export default Appbar;
