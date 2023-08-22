import { Button } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { adminEmailSelector } from "../store/selectors/adminEmailSelector";
import { useRecoilValue } from "recoil";
export default function Landing() {
    const adminEmail = useRecoilValue(adminEmailSelector);
    const navigate = useNavigate();
    const handleSignupButton = () => navigate("/signup");
    const handleSigninButton = () => navigate("/signin");
    const handleHomeButton = () => navigate("/home");
    return (
        <div className="landing-container">
            <div>{(!adminEmail) ?
                <div className="landing-button-div">
                    <Button variant="contained" onClick={handleSignupButton}>Signup</Button>
                    <Button variant="contained" onClick={handleSigninButton} color="inherit" sx={{ color: "#000" }}>Signin</Button>
                </div> :<div className="landing-button-div"><Button variant="contained" color="inherit" onClick={handleHomeButton} sx={{color:"black"}}>Explore inventory</Button></div> 
            }</div>

        </div>
    )
}