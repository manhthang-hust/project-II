import React from "react";
import {useState, useEffect} from 'react'
import './Category.scss';
import Navbar from '../navbar/Navbar'
import { useParams } from "react-router";
import { useDispatch } from 'react-redux'
import {getBookOnCategory} from '../../../redux/slice/categorySlice'
import {Link} from 'react-router-dom'
function Category(){
    
    const dispatch = useDispatch()
    const {id} = useParams();
    const[books, setBooks] = useState([]);
    
    useEffect(async () => {
            const res = await dispatch(getBookOnCategory(id))
            setBooks(res.payload.data.books)
        },[id])
    return(
        <div className="category">
            <Navbar/>
            <div className="books-list">
            {books.map ((book) => (
                <div className="book" key={book._id}>
                    <Link to={`/book/${book._id}`} className="link">
                        <div className="inner">
                        <div className="top">
                            <img src={(`http://127.0.0.1:8000/img/books/${book.image}`)} alt="" />
                        </div>
                        <div className="bottom">
                            <div className="info">
                            <p>{book.name}</p>
                            </div>
                        </div>
                        </div>
                    </Link>
                    </div>
            ))}
    
            </div>
        </div>
        
        
    )

}
export default Category;