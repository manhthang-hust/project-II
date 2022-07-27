import React, { useState, useEffect } from "react";
import "./Navbar.scss";
import { Notifications, ArrowDropDown, Search } from "@material-ui/icons";
import CatType from "./catType/CatType";
import { createGlobalStyle } from "styled-components";

import { useDispatch, useSelector } from "react-redux";

import { fetchAsyncSearch } from "../../../redux/slice/bookSLice";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser, logout } from "../../../redux/slice/authSlice";
import { Scrollbars } from 'react-custom-scrollbars';
import APIapp from '../../APIS/APIapp.js'

const Navbar = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [search, setSearch] = useState("");
  const [isNotification, setIsNotification] = useState(false);
  const [numNotifications, setNumNotifications] = useState(0)
  const [textInput, setTextInput] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const[notifications, setNotifications] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [img, setImg]=useState(null)

  useEffect( async () =>{
    const res= await APIapp.get('/users/me')
    setImg(res.data.data.user.photo);
    // console.log(res.data.data.user.photo);
  },[])

  const user = useSelector(state => state.user)
  // console.log(user);
  const book = useSelector(state => state.book)
  const listbooks= book.recentlyBook ;

  // category options
  const handleOnClicked = () => {
    setIsClicked(!isClicked);
    if(isNotification) setIsNotification(!isNotification);
  };
  // to profile page
  const handleProfile = () => {
    navigate("/profile");
  };

  const handleHome = () => {
    navigate("/userHome");
  };
  //notifications
  const handleNotificationClick = async () => {
    setIsNotification(!isNotification);
    if(isClicked) setIsClicked(!isClicked);
    try {
      const response = await APIapp.get("users/notifications")
      console.log(response.data.data.notifications)
      setNotifications(response.data.data.notifications)
    } catch (err) {
        console.log(err.response.data.message)
    }
    setNumNotifications(0)
  }

  // navigate
  const handleSearch = () => {
    setFilterData([]);
    navigate("/search", { state: { text: textInput, data: filterData } });
  };
  // search


  const handleFilter = (e) => {
    e.preventDefault();
    const searchWord = e.target.value;
    setTextInput(searchWord);
    const newFilter = listbooks.filter((value) => {
      return value.name.toLowerCase().includes(searchWord.toLowerCase());
    });
    if (searchWord === "") {
      setFilterData([]);
    } else {
      setFilterData(newFilter);
    }
  };

  const handleLogout = async (e) => {
    localStorage.removeItem("token");
    const isAuth = await dispatch(logoutUser());
    dispatch(logout());
    window.location.assign("/login");
  };

  
  let renderNotifications = ""
  renderNotifications = notifications!=null? (notifications.map((notification) => (
    <p>{notification.message}</p>
  ))) : (
    <p>wait a minute</p>
  )

  const { numUnreadNotifications } = useSelector((state) => state.user.user)
  useEffect( () => {
    setNumNotifications(numUnreadNotifications)
  }, [numUnreadNotifications])
  

  return (
    <div className="navbar">
      <div className="container">
        <div className="left">
        <Link to ="/userHome" className="home" style={{textDecoration: "none"}}>
          <div className="logo" >
            weRead
          </div>
          </Link>
          <div className="search">
            <div className="searchInput">
              <input
                type="text"
                placeholder="Enter a book name..."
                onChange={handleFilter}
              />
              <Search className="icon" onClick={handleSearch} />
            </div>
            {filterData.length !== 0 && (
              <div className="dataResult">
                {filterData.map((book) => {
                  return (
                  <Link to={`/book/${book._id}`} style={{textDecoration:"none", color:"black"}} className="link">
                  <p className="result">{book.name}</p>
                  </Link>)
                })}
              </div>
            )}
          </div>
        </div>
        <div className="right">
          <div className="category">
            <p onClick={handleOnClicked}>category</p>
            <div className={isClicked ? "catType clicked" : "catType"}>
              <CatType />
            </div>
          </div>
          <div className="notification"onClick={handleNotificationClick}>
            <Notifications />
            {numNotifications ? <span className="badge">{numNotifications}</span> : <></>}
            <div className={isNotification ? "notificationTable clicked" : "notificationTable"}>
              <Scrollbars className="scrollbar">
                    {renderNotifications}
              </Scrollbars>
            </div>
          </div>
          <div className="user">
            <img
              // src="https://i.pinimg.com/564x/01/37/28/01372823cc87dda1d08bc1529163e9e1.jpg"
              src={img == undefined ? "https://i.pinimg.com/564x/01/37/28/01372823cc87dda1d08bc1529163e9e1.jpg" : `http://127.0.0.1:8000/img/users/${img}`}
              alt=""
            />
            <div className="profile">
              <ArrowDropDown />
              <div className="options">
                <span onClick={handleProfile}>profile</span>
                <span onClick={handleLogout}>sign out</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
