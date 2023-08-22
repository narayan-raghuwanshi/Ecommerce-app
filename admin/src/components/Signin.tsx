import {useState} from "react";
import { useNavigate } from 'react-router-dom';
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { useSetRecoilState } from "recoil";
import { adminState } from "../store/atoms/admin";
import axios from "axios";
import { BASE_URL } from "../config";
function Signin(){
    const navigate = useNavigate();
    const setAdmin = useSetRecoilState(adminState);
    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");

    const usernameHandler = (event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.target.value)
    const passwordHandler = (event: React.ChangeEvent<HTMLInputElement>)=> setPassword(event.target.value)

    const handleSignin = async()=>{
        const response = await axios.post(`${BASE_URL}/admin/signin`,{
            username,
            password
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
    }
    return(
        <div className="mainParentDiv">
            <Typography style={{fontSize:"30px",marginBottom:"20px"}}>Sign In</Typography>
            <Card className="signupCard" style={{borderRadius:"11px",backgroundColor:"#f7f5f5"}}>
                <input className="inputField" placeholder="Email ID"type="email" onChange={usernameHandler}></input>
                <hr className="horizontalLine"></hr>
                <input className="inputField" placeholder="Password"type="password" onChange={passwordHandler}></input>
                <hr className="horizontalLine"></hr>
                <button className="signupButton" onClick={handleSignin}>Signin</button>
                <div className="bottomLink1">New user? <Button
                    color="primary"
                    onClick={() => navigate("/signup")}
                >
                    register
                </Button></div>
            </Card>
        </div>
    )
}

export default Signin ;