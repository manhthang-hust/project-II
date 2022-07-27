import React, { useState, useEffect } from 'react'
import './Modal.scss'
import { useSelector, useDispatch } from 'react-redux'
import { setSelectedBookAd, updateBook } from '../../../redux/slice/bookSLice'
import { useParams } from "react-router"
import APIapp from '../../../Client/APIS/APIapp'
import { getCategory } from '../../../redux/slice/categorySlice.js'

const Modal = (props) => {
    const { id } = useParams()
    const { selectedBook } = useSelector((state) => state.book)
    const dispatch = useDispatch()
    const [book, setBook] = useState({
        author: selectedBook.author,
        category: selectedBook.category.id,
        isVIP: true,
        name: selectedBook.name,
        publisher: selectedBook.publisher,
        description: selectedBook.description
    })

    const [categories, setCategories] = useState([])
    const [file, setFile] = useState(null)
    useEffect(async () => {
        const category = await dispatch(getCategory())
        setCategories(category.payload.data.categories)
        console.log('', category)
    }, [dispatch])
    

    const handleChange = async (e) => {
        dispatch(setSelectedBookAd(book))
        const formData = new FormData(); 
        if(file!=null) formData.append("image", file) ; 
        formData.append("name", book.name);
        formData.append("author", book.author);
        formData.append("publisher", book.publisher);
        formData.append("category", book.category);
        formData.append("isVIP", book.isVIP);
        formData.append("description", book.description);
        console.log(Array.from(formData));
        const selected = await APIapp.patch(`books/${id}`, formData) 
        console.log(selected)
        window.location.reload()
    }    

    return (
        <>
                <div className="modal">
                    <div onClick={props.clickMethod} className="overlay"></div>
                    <div className="modal-content">
                        <span className="inform">Thông tin người nhận</span>
                        <div className="form">
                            <input type="text" placeholder="Title" onChange={(e) => setBook({...book, name:e.target.value})}/>
                            <input type="text" placeholder="Author" onChange={(e) => setBook({...book, author:e.target.value})}/>
                            <input type="text" placeholder="Publisher" onChange={(e) => setBook({...book, publisher:e.target.value})}/>
                            <input type="text" placeholder="Description" onChange={(e) => setBook({...book, description:e.target.value})}/>
                            <select type="text" onChange={(e) => setBook({...book, category:e.target.value})}>
                                    {categories.map((category) => (
                                        <option value={category.id}>{category.name}</option>
                                    ))}
                            </select>
                            <select type="text" onChange={(e) => setBook({...book, isVIP:e.target.value})}>
                                <option value="true">VIP</option>
                                <option value="false">Normal</option>
                            </select>
                            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                        </div>
                        <div className="btn">
                            <button className="close-modal"  onClick={handleChange}>Update</button>
                            <button className="close-modal close" onClick={props.clickMethod}>Close</button>
                        </div>
                    </div>
              </div>
        </>
    )
}

export default Modal
