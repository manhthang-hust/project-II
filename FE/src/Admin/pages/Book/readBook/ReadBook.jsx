import React, { useEffect, useState } from 'react'
import './ReadBook.scss'
import Sidebar from '../../../components/sidebar/Sidebar.js'
import Navbar from '../../../components/navbar/Navbar'
import { getBookDetail, getCopyOnBook, setSelectedBookAd } from '../../../../redux/slice/bookSLice.js'
import { useDispatch } from 'react-redux'
import { useParams } from "react-router"
import CopyTable from './copyTable/CopyTable'
import * as FiIcons from 'react-icons/fi'
import * as FcIcons from 'react-icons/fc'
import Modal from '../../../components/modal/Modal'
import CreateCopy from '../../../components/modalCreateCopy/CreateCopy'

const ReadBook = () => {
    const { id } = useParams()
    const dispatch = useDispatch()
    const [modal, setModal] = useState(false);
    const [createCopy, setCreateCopy] = useState(false);
    const [selectedBook, setSelectedBook] = useState({
        author: "",
        available: 0,
        category: "",
        id: "",
        image: "https://i.pinimg.com/564x/f8/9b/3a/f89b3ad4b5ba91b279f158da84c339a7.jpg",
        isVIP: false,
        name: "",
        publisher: "",
        quantity: 0,
        registerUsers: [],
        slug: "",
        __v: 0,
        _id: "",
    })
    const [copies, setCopies] = useState([])
    const [file, setFile] = useState({})
    useEffect(async () => {
        const book = await dispatch(getBookDetail(id))
        console.log('book', book)
        const copies = await dispatch(getCopyOnBook(id))
        dispatch(setSelectedBookAd(book.payload.data.book))
        setCopies(copies.payload.data.bookCopies)
        setSelectedBook(book.payload.data.book)
    }, [dispatch, id, setSelectedBook, setCreateCopy])

    const toggleModal = (event) => {
        event.preventDefault();
        setModal(!modal);
    };

    const toggleCreateCopy = (event) => {
        event.preventDefault();
        setCreateCopy(!createCopy);
    };

    return (
        <div className="readBook">
            <Navbar/>
            <div className="admin">
                <div className="sidebar">
                    <Sidebar/>
                </div>
                <div className="content">
                    <div className="up">
                        <div className="left">
                            <img src={`http://127.0.0.1:8000/img/books/${selectedBook.image}`} alt="" />
                        </div>
                        <div className="right">
                            <div className="name">
                                <span className="title">{selectedBook.name}</span>
                                {selectedBook.isVIP ? <FcIcons.FcVip className="vip"/> : <></>}
                            </div>
                            <span>BookID: {selectedBook._id}</span>
                            <span>Author: {selectedBook.author}</span>
                            <span>Publisher: {selectedBook.publisher}</span>
                            <span>Category: {selectedBook.category.name}</span>
                            <span>Quantity: {selectedBook.quantity}</span>
                            <span>{selectedBook.available != 0 ? `Available: ${selectedBook.available}` : `In queue: ${selectedBook.registerUsers.length}`}</span>
                            <span className="description">{selectedBook.description}</span>
                        </div>
                        <FiIcons.FiEdit color="var(--purple)" className="edit" onClick={toggleModal}/>
                    </div>
                    <div className="down">
                        <CopyTable data={copies} />
                        <button className="newCopy" onClick={toggleCreateCopy}>Create new copy</button>
                    </div>
                    {modal && <Modal clickMethod = {toggleModal} />}
                    {createCopy && <CreateCopy clickMethod = {toggleCreateCopy} />}
                </div>
            </div>
            
        </div>
    )
}

export default ReadBook
