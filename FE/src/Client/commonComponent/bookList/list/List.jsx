import React, { useEffect } from 'react'
import './List.scss'
import Book from '../book/Book'
import { useSelector, useDispatch } from 'react-redux'
import { getAllBook } from '../../../../redux/slice/bookSLice.js'
import Slider from "react-slick"
import { getBookOnCategory } from '../../../../redux/slice/categorySlice.js'

const List = (props) => {
    const { data } = props;
    const dispatch = useDispatch()
    
    // const settings = {
    //     dots: true,
    //     infinite: true,
    //     speed: 500,
    //     slidesToShow: 5,
    //     slidesToScroll: 3
    // };

    let renderBooks = "";

    renderBooks = data != null ? (
        data.map((book) => (
            <Book key = {book._id} data = {book} />
        ))
    ) : (
        <div className="error">
            <h3>{data.Error}</h3>
        </div>
    )

    return (
        <div className="list">
            <div className="container">
                <div className="wrap">
                    <div className="title">
                        {props.title}
                    </div>
                    <div className="bookList">

                        {renderBooks}

                    </div>
                </div>
            </div>
        </div>
    )
}

export default List
