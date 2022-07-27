import React, { useState } from 'react'
import './Modaluser.scss'

const Modal = (props) => {

    const [address, setAddress] = useState({
        receiverName:'',
        receiverAddress:'',
        receiverPhone:'',
    });

    const handeChange = (e) => {
        e.preventDefault();
        props.handlerAddr(address)
    }

    return (
        <>
                <div className="modal">
                    <div onClick={props.clickMethod} className="overlay"></div>
                    <div className="modal-content">
                        <span className="inform">Thông tin người nhận</span>
                        <div className="form">
                            <input type="text" placeholder="Ho va ten" onChange={(e) => setAddress({...address, receiverName:e.target.value})}/>
                            <input type="text" placeholder="So dien thoai nguoi nhan" onChange={(e) => setAddress({...address, receiverPhone:e.target.value})}/>
                            <input type="text" placeholder="Dia chi" onChange={(e) => setAddress({...address, receiverAddress:e.target.value})}/>
                        </div>
                        <div className="btn">
                            <button className="close-modal"  onClick={handeChange}>Update</button>
                            <button className="close-modal close" onClick={props.clickMethod}>Close</button>
                        </div>
                    </div>
              </div>
        </>
    )
}

export default Modal
