import { useState } from "react";
import { useNavigate } from 'react-router-dom';

/* External Library */
import { useSetRecoilState } from "recoil";
import axios from "axios";

/* Local Imports */
import { userState } from "../store/atoms/user";
import "./styles/signup.css"
import { BASE_URL } from "../config";

/* MUI */
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

/* Start */
export default function Signin() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const setUser = useSetRecoilState(userState);

    const usernameHandler = (event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.target.value)
    const passwordHandler = (event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)
    const handleSignin = async () => {
        const response = await axios.post(`${BASE_URL}/user/signin`, {
            username: username,
            password: password
        });
        if (response.data.token) {
            localStorage.setItem("token", response.data.token)
            setUser({
                //@ts-ignore
                userEmail: username,
                loading:false
            });
            navigate('/home');
        }
    }
    return (
        <div className="mainParentDiv">
            <Typography style={{ fontSize: "30px", marginBottom: "20px" }}>Sign In</Typography>
            <Card className="signupCard" style={{ borderRadius: "11px", backgroundColor: "#f7f5f5" }}>
                <input className="inputField" placeholder="Email ID" type="email" onChange={usernameHandler}></input>
                <hr className="horizontalLine"></hr>
                <input className="inputField" placeholder="Password" type="password" onChange={passwordHandler}></input>
                <hr className="horizontalLine"></hr>
                <button className="signupButton" onClick={handleSignin}>Signin</button>
                <div className="bottomLink1">New user?
                    <Button
                        color="primary"
                        onClick={() => navigate("/signup")}>
                        register
                    </Button>
                </div>
            </Card>
        </div>
    )
}