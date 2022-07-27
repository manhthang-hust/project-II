import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from "react-router"
import APIapp from '../../../Client/APIS/APIapp'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddOrder = (props) => {
    
    const [newOrder, setNewOrder] = useState({
        email: '',
        copyId: '',
    })

    const handleAddOrder=(e)=>{
        e.preventDefault();
        (async() => {
        try{
            const res = await APIapp.post('orders', newOrder)
            toast.success("Add new order successfully!!!", {autoClose: false})
            props.setChange(!props.change);
                //window.location.reload()
        }catch(e){
            toast.error(e.response.data.message, {autoClose: false})

        }
                    
        })();

    }

    return (
        <>
                <div className="modal">
                    <div onClick={props.clickMethod} className="overlay"></div>
                    <div className="modal-content">
                        <div className="form">
                            <input type="text" placeholder="Email " onChange={(e) => setNewOrder({...newOrder, email:e.target.value})}/>
                        <input type="text" placeholder="Copy Id" onChange={(e) => setNewOrder({...newOrder, copyId:e.target.value})}/>
                        </div>
                        <div className="btn">
                            <button className="close-modal"  onClick={handleAddOrder}>Add</button>
                            <button className="close-modal close" onClick={props.clickMethod}>Close</button>
                        </div>
                       
                    </div>
                    <ToastContainer/>
              </div>
        </>
    )
}

export default AddOrder