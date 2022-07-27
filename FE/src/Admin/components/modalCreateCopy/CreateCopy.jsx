import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from "react-router"
import APIapp from '../../../Client/APIS/APIapp'
import { ToastContainer, toast } from 'react-toastify'

const Modal = (props) => {
    const { id } = useParams()
    const dispatch = useDispatch()
    const [copy, setCopy] = useState({
        copyId: "",
        printedYear: 0,
    })

    const handleChange = async (e) => {
        let response = ""
        try {
            response = await APIapp.post(`books/${id}/bookCopies`, copy)
        } catch (err) {
            response = err.response.data
        }
        if(response.status === "error")  {
            toast.error("error", {autoClose: 2000 })
        } else {
            toast.success("success", {autoClose: 2000 })
            window.location.reload()
        }
    }

    return (
        <>
                <div className="modal">
                    <div onClick={props.clickMethod} className="overlay"></div>
                    <div className="modal-content">
                        <div className="form">
                            <input type="text" placeholder="copyId" onChange={(e) => setCopy({...copy, copyId:e.target.value})}/>
                            <input type="number" placeholder="printedYear" onChange={(e) => setCopy({...copy, printedYear:e.target.value})}/>
                        </div>
                        <div className="btn">
                            <button className="close-modal"  onClick={handleChange}>Update</button>
                            <button className="close-modal close" onClick={props.clickMethod}>Close</button>
                        </div>
                    </div>
                    <ToastContainer />
              </div>
        </>
    )
}

export default Modal
