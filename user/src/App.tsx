import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {useSetRecoilState} from "recoil";
import { useEffect } from "react";
import axios from "axios";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Appbar from "./components/Appbar";
import Home from "./components/Home";
import Item from "./components/Item";
import Landing from "./components/Landing";
import { userState } from "./store/atoms/user";
import Cart from "./components/Cart";
import Wishlist from "./components/Wishlist";
import Orders from "./components/Orders";
import Buypage from "./components/Buypage";
import Footer from "./components/Footer";
import { BASE_URL } from "./config";
function App() {
  return (
      <Router>
        <Appbar></Appbar>
        <InitUser></InitUser>
        <Routes>
          <Route path="/signin" element={<Signin></Signin>}></Route>
          <Route path="/signup" element={<Signup></Signup>}></Route>
          <Route path="/home" element={<Home></Home>}></Route>
          <Route path="/item/:itemId" element={<Item></Item>}></Route>
          <Route path="/cart" element={<Cart></Cart>}></Route>
          <Route path="/wishlist" element={<Wishlist></Wishlist>}></Route>
          <Route path="/orders" element={<Orders></Orders>}></Route>
          <Route path="/buypage/:itemId" element={<Buypage></Buypage>}></Route>
          <Route path="/" element={<Landing></Landing>}></Route>
        </Routes>
        <Footer></Footer>
      </Router>
  );
}
function InitUser() {
  const setUser = useSetRecoilState(userState);
  const init = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/me`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      });
      if (response.data.username) {
        setUser({
          userEmail: response.data.username,
          loading: false
        })
      } else {
        setUser({
          userEmail: null,
          loading: false
        })
      }
    } catch (e) {
      setUser({
        userEmail: null,
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
