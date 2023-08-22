import { userState } from "../atoms/user";
import {selector} from "recoil";

export const userEmailSelector = selector({
    key:"userEmailState",
    get:({get})=>{
        const state = get(userState);
        return state.userEmail;
    }
});