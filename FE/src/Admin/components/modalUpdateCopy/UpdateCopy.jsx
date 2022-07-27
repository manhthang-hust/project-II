import React, { useState, useEffect } from 'react'
import APIapp from '../../../Client/APIS/APIapp'
import './UpdateCopy.scss'

const Modal = (props) => {
    const { data } = props
    const [copy, setCopy] = useState({
        new: data.new,
        status: data.status
    })
    
    const handleChange = async (e) => {
        props.handlerBook(copy)
        const selected = await APIapp.patch(`bookcopies/${data._id}`, copy) 
        window.location.reload()
        console.log('selected', selected)
    }

    return (
        <>
                <div className="modal">
                    <div onClick={props.clickMethod} className="overlay"></div>
                    <div className="modal-content">
                        <span className="inform">Thay đổi thông tin book copy</span>
                        <div className="form">
                            <select type="text" onChange={(e) => setCopy({...copy, new:e.target.value})}>
                                <option value="true">New</option>
                                <option value="false">Old</option>
                            </select>
                            <div className="isLost">
                                <input type="checkbox" onChange={(e) => {if (e.target.checked) setCopy({...copy, status:"isLost"}) }} className="checkbox"/>
                                <span>Is lost?</span>
                            </div>
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
