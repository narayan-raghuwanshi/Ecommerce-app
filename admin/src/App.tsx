import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {useSetRecoilState} from "recoil";
import { useEffect } from "react";
import axios from "axios";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Appbar from "./components/Appbar";
import AdminHome from "./components/AdminHome";
import Item from "./components/Item";
import { adminState } from "./store/atoms/admin";
import AddItem from "./components/AddItem";
import Orders from "./components/Orders";
import Landing from "./components/Landing";
import { BASE_URL } from "./config";
function App() {
  return (
      <Router>
        <InitUser></InitUser>
        <Appbar></Appbar>
        <Routes>
          <Route path="/signin" element={<Signin></Signin>}></Route>
          <Route path="/signup" element={<Signup></Signup>}></Route>
          <Route path="/home" element={<AdminHome></AdminHome>}></Route>
          <Route path="/item/:itemId" element={<Item></Item>}></Route>
          <Route path="/additem" element={<AddItem></AddItem>}></Route>
          <Route path="/orders" element={<Orders></Orders>}></Route>
          <Route path="/" element={<Landing></Landing>}></Route>
        </Routes>
      </Router>
  );
}
function InitUser() {
  const setAdmin = useSetRecoilState(adminState);
  const init = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/me`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      });
      if (response.data.username) {
        setAdmin({
          adminEmail: response.data.username,
          loading: false
        })
      } else {
        setAdmin({
          adminEmail: null,
          loading: false
        })
      }
    } catch (e) {
      setAdmin({
        adminEmail: null,
        loading: false
      })
    }
  }
  useEffect(() => {
    init();
  }, []);

  return <></>
}
export default App;
