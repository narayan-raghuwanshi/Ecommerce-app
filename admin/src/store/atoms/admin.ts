import {atom} from "recoil";

export const adminState = atom({
    key:"adminState",
    default:{
        adminEmail: null,
        loading: true
    }
})