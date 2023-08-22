import { Button } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { userEmailSelector } from "../store/selectors/userEmailSelector";
import { useRecoilValue } from "recoil";
export default function Landing(){
    const userEmail = useRecoilValue(userEmailSelector);
    const navigate = useNavigate();
    const handleShop = () => (userEmail)? navigate("/home"): navigate("/signin");
    const handleSigninButton = () => navigate("/signin");
    return (
        <div className="landing-container">
            <div className="landing-button-div">
                <Button variant="contained" onClick={handleShop}>Shop now</Button>
                {!userEmail && <Button variant="outlined" onClick={handleSigninButton} color="inherit" sx={{color:"#ffffff"}}>Signin</Button>}
            </div>
        </div>
    )
}