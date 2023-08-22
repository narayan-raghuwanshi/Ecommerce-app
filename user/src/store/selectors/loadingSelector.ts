import { userState } from "../atoms/user";
import {selector} from "recoil";

export const loadingSelector = selector({
    key:"loadingState",
    get:({get})=>{
        const state = get(userState);
        return state.loading;
    }
});