import React, { useState } from 'react'
import APIapp from '../../../../../Client/APIS/APIapp.js'

const Modal = (props) => {
    const [category, setCategory] = useState({
        name:'',
    })
    

    const handleChange = async (e) => {
        const selected = await APIapp.post(`categories`, category)
        window.location.reload()
    }

    return (
        <>
                <div className="modal">
                    <div onClick={props.clickMethod} className="overlay"></div>
                    <div className="modal-content">
                        <span className="inform">Create new category</span>
                        <div className="form">
                            <input type="text" placeholder="Name" onChange={(e) => setCategory({...category, name:e.target.value})}/>
                        </div>
                        <div className="btn">
                            <button className="close-modal"  onClick={handleChange}>Create</button>
                            <button className="close-modal close" onClick={props.clickMethod}>Close</button>
                        </div>
                    </div>
              </div>
        </>
    )
}

export default Modal