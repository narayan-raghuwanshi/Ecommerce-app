import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { adminState } from "../store/atoms/admin";
import './styles/signup.css';
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { BASE_URL } from "../config";
export default function Signup() {
    const navigate = useNavigate();
    const setAdmin = useSetRecoilState(adminState);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [companyName, setcompanyName] = useState("");
    const [fullName, setFullName] = useState("");

    const fullNameHandler = (event: React.ChangeEvent<HTMLInputElement>) => setFullName(event.target.value)
    const usernameHandler = (event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.target.value)
    const passwordHandler = (event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)
    const companyNameHandler = (event: React.ChangeEvent<HTMLInputElement>) => setcompanyName(event.target.value)

    const handleSignup = async() => {
        const response = await axios.post(`${BASE_URL}/admin/signup`,{
            fullName,
            username,
            password,
            companyName
        })
        if (response.data.token) {
            localStorage.setItem("token", response.data.token)
            setAdmin({
                //@ts-ignore
                adminEmail: username,
                loading:false
            });
            navigate('/home');
        }
    };
    return (
        <div className="mainParentDiv">
            <Typography style={{ fontSize: "30px", marginBottom: "20px" }}>Create account</Typography>
            <Card className="signupCard" style={{ borderRadius: "11px",backgroundColor:"#f7f5f5"}}>
                <input className="inputField" placeholder="Full name" onChange={fullNameHandler}></input>
                <hr className="horizontalLine"></hr>
                <input className="inputField" placeholder="Email ID" type="email" onChange={usernameHandler}></input>
                <hr className="horizontalLine"></hr>
                <input className="inputField" placeholder="Brand name" type="email" onChange={companyNameHandler}></input>
                <hr className="horizontalLine"></hr>
                <input className="inputField" placeholder="Password" type="password" onChange={passwordHandler}></input>
                <hr className="horizontalLine"></hr>
                <button className="signupButton" onClick={handleSignup}>Signup</button>
                <div className="bottomLink1">Already user? <Button
                    color="primary"
                    onClick={() => navigate("/signin")}
                >
                    Signin
                </Button></div>
            </Card>
        </div>
    );
}
