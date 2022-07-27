import React, { useEffect, useState } from "react";
import "./BookDetail.scss";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getSelectedBook, getBookDetail, getCopyOnBook, copyOnBook, addBookNotifications, removeBookNotifications } from "../../../redux/slice/bookSLice";
import Navbar from "../../commonComponent/navbar/Navbar";
import DataTable from './Table/Table'
import * as FcIcons from 'react-icons/fc'
import * as IoIcons from 'react-icons/io'
import { Notifications, DoNotDisturbOffOutlined } from "@material-ui/icons"
import { ToastContainer, toast } from 'react-toastify';

const BookDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [selectedBook, setSelectedBook] = useState({})
  const [copies, setCopies] = useState([])
  
  //const { selectedBook, copies } = useSelector((state) => state.book);

  useEffect(async () => {
    const book = await dispatch(getBookDetail(id));
    const copies = await dispatch(getCopyOnBook(id))
    dispatch(getSelectedBook(book.payload.data.book))
    dispatch(copyOnBook(copies.payload.data.bookCopies))
    book ? setSelectedBook(book.payload.data.book) : setSelectedBook({})
    copies ? setCopies(copies.payload.data.bookCopies) : setCopies([])
  }, [dispatch, id]);

  console.log(selectedBook)

  const handleTurnOnNotifications = async () => {
    const noti = await dispatch(addBookNotifications(id))
    console.log('noti', noti.payload)
    noti.payload==="User has already registered this book!" ? toast.error(noti.payload, {autoClose: 2000 }) : toast.success("success", {autoClose: 2000 });
  }
  const handleTurnOffNotifications = async () => {
    const noti = await dispatch(removeBookNotifications(id));
    toast.success("cancel notification successfully !!", {autoClose: 2000 })
  }

  return (
    <div className="bookDetail">
      <Navbar />
      <div className="container">
        <div className="wrapper">
          <div className="left">
            <img src={(`http://127.0.0.1:8000/img/books/${selectedBook.image}`)} alt="" />
          </div>
          <div className="right">
            <div className="up">
              <div className="name">
                <span className="title">{selectedBook.name}</span>
                {selectedBook.isVIP ? <FcIcons.FcVip className="vip"/> : <></>}
                
                  {selectedBook.available===0 ? <div className="btn"><button className="notification" onClick={handleTurnOnNotifications}><Notifications/></button> 
                  <button className="notification_off" onClick={handleTurnOffNotifications}><IoIcons.IoMdNotificationsOff className="icon"/></button></div>
                : <></>}
              </div>
              <div className="authorName">
                <span>Author: {selectedBook.author}</span>
              </div>
              <div className="category">
                <span>Category: {selectedBook.category ? selectedBook.category.name : ""}</span>
              </div>
              <div className="quantity">
                <span>{selectedBook.available} item(s) left</span>
              </div>
            </div>
            <div className="down">
              <p>{selectedBook.description}</p>
            </div>
          </div>
        </div>
        <div className="table">
          <DataTable data={copies} vip = {selectedBook.isVIP}/>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default BookDetail;
