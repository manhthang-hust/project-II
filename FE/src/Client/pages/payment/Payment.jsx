import React, { useEffect, useState } from 'react'
import './Payment.scss'
import { useParams } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import { getSelectedCopy, setSelectedCopy } from '../../../redux/slice/bookSLice.js'
import { getUser } from '../../../redux/slice/userSlice'
import Navbar from '../../commonComponent/navbar/Navbar'
import { LocationOnOutlined, EditOutlined } from '@material-ui/icons'
import { addOrder, postAsyncOrder } from '../../../redux/slice/orderSlice'
import { Link } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from './Modal/Modal'
import APIapp from '../../APIS/APIapp.js'

const Payment = () => {
    const [modal, setModal] = useState(false);
    const { id } = useParams();
    const dispatch = useDispatch();

    const { selectedCopy, selectedBook } = useSelector((state) => state.book)
    const { user } = useSelector((state) => state.user)

    const [address, setAddress] = useState({
        receiverName: user.user.name,
        receiverAddress: user.user.address,
        receiverPhone: user.user.phone,
    });
    
    const toggleModal = (event) => {
        event.preventDefault();
        setModal(!modal);
    };

    useEffect(async () => {
        const copy = await dispatch(getSelectedCopy(id))
        dispatch(setSelectedCopy(copy.payload.data.bookCopy))
    }, [dispatch, id]);
    
    const handleOrder = async(e) => {
        e.preventDefault()
        if(address.receiverAddress === "" || address.receiverName === "" || address.receiverPhone === "") {
            return toast.error("Address invalid !!", {autoClose: 2000 });
        }
        console.log(address)
        try {
            const response = await APIapp.post(`orders/${id}`, address)
            console.log('res',response.data)
            toast.success("Order successfully !!", {autoClose: 2000 });
        } catch (err) {
            console.log('err',err.response.data)
            toast.error(err.response.data.message, {autoClose: 3000 })
        }
        // if(od.payload.status === "fail") toast.error(od.payload.message, {autoClose: 3000 })
        // else toast.success("Order successfully !!", {autoClose: 2000 });
    }

    const changeAddr = (address) => {
        setAddress(address)
    }

    return (
        <div className="payment">
            <div className="wrapper">
                <Navbar />
                <div className="body">
                    <div className="addr">
                        <div className="title">
                            <LocationOnOutlined />
                            <span>Your Address</span>
                        </div>
                        <div className="info">
                            <div className="user">
                                <span>{address.receiverName}</span>
                                <span>{address.receiverPhone}</span>
                                <span>{address.receiverAddress}</span>
                            </div>
                            <EditOutlined className="icon" onClick={toggleModal}/>
                        </div>
                    </div>
                    <div className="copy">
                        <div className="book">
                            <img src={(`http://127.0.0.1:8000/img/books/${selectedBook.image}`)} alt="" />
                            <div className="bookInfo">
                                <span className="bn">{selectedBook.name}</span>
                                <span>Copy No: {selectedCopy.copyId}</span>
                                <span>Category: {selectedBook.category ? selectedBook.category.name : ""}</span>
                                <span>Author: {selectedBook.author}</span>
                                <span>Publisher: {selectedBook.publisher}</span>
                            </div>
                        </div>
                        <Link to="/" className="link">
                            <button onClick={handleOrder}>Check out</button>
                        </Link>
                    </div>
                </div>
                <ToastContainer />
            </div>
            {modal && <Modal clickMethod = {toggleModal} handlerAddr = {changeAddr} address = {address}/>}
        </div>
    )
}

export default Payment
