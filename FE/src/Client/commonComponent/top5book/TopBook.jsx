import React, { useEffect } from 'react'
import './TopBook.scss'
import {top5Book, getTop5 } from '../../../redux/slice/bookSLice'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from "react-router-dom"

const TopBook = () => {

    const dispatch = useDispatch();
    useEffect( async () => {
        const topBook = await dispatch(top5Book());
        if(topBook) dispatch(getTop5(topBook.payload))
    }, [dispatch])

    const { topBook } = useSelector((state) => state.book)
    
    return (
        <div className="topBook">
            <div className="container">
                <div className="left">
                    <Link to={`/book/${(topBook.length!=0) ? topBook[1].book._id : ""}`} className="link up">
                        <div className="up">
                            <img src={(topBook.length!=0) ? (`http://127.0.0.1:8000/img/books/${(topBook[1].book).image}`) : "https://i.pinimg.com/564x/95/6d/6f/956d6f1eaf62bfb585749c2457bfcae0.jpg"} alt="" />
                        </div>
                    </Link>
                    <Link to={`/book/${(topBook.length!=0) ? topBook[2].book._id : ""}`} className="link down">
                        <div className="down">
                            <img src={(topBook.length!=0) ? (`http://127.0.0.1:8000/img/books/${(topBook[2].book).image}`) : "https://i.pinimg.com/564x/95/6d/6f/956d6f1eaf62bfb585749c2457bfcae0.jpg"} alt="" />
                        </div>
                    </Link>
                </div>
                <div className="center">
                    <Link to={`/book/${(topBook.length!=0) ? topBook[0].book._id : ""}`} className="link">
                        <img src={(topBook.length!=0) ? (`http://127.0.0.1:8000/img/books/${(topBook[0].book).image}`) : "https://i.pinimg.com/564x/95/6d/6f/956d6f1eaf62bfb585749c2457bfcae0.jpg"} alt="" />
                        <div className="bookinfo">
                            <div className="wrap">
                                <span className="title">{(topBook.length!=0) ? (topBook[0].book).name : ""}</span>
                                <span>Author: {(topBook.length!=0) ? (topBook[0].book).author : ""}</span>
                                <span>Category: {(topBook.length!=0) ? (topBook[0].book).category : ""}</span>
                                <span className="desc">{(topBook.length!=0) ? (topBook[0].book).description : ""}</span>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="right">
                    <Link to={`/book/${(topBook.length!=0) ? topBook[3].book._id : ""}`} className="link">
                        <div className="up">
                            <img src={(topBook.length!=0) ? (`http://127.0.0.1:8000/img/books/${(topBook[3].book).image}`) : "https://i.pinimg.com/564x/95/6d/6f/956d6f1eaf62bfb585749c2457bfcae0.jpg"} alt="" />
                        </div>
                    </Link>
                    <Link to={`/book/${(topBook.length!=0) ? topBook[4].book._id : ""}`} className="link">
                        <div className="down">
                            <img src={(topBook.length!=0) ? (`http://127.0.0.1:8000/img/books/${(topBook[4].book).image}`) : "https://i.pinimg.com/564x/95/6d/6f/956d6f1eaf62bfb585749c2457bfcae0.jpg"} alt="" />
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default TopBook
