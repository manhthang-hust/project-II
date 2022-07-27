import React, { useState } from 'react'
import './ResetPass.scss'
import { useDispatch, useSelector } from 'react-redux'
import { setPassword, resetPasswordSuccess } from '../redux/slice/authSlice.js'
import { useNavigate } from 'react-router-dom'
import { useParams } from "react-router"
import APIapp from '../Client/APIS/APIapp.js'
import { ToastContainer, toast } from 'react-toastify'

const ResetPass = () => {
    const { id } = useParams()
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [pass, setPass] = useState({
        password: '',
        passwordConfirm: ''
    })

    
    const handleResetPass = async (e) => {
        e.preventDefault();
        console.log(pass)
        try {
            const response = await APIapp.post(`users/resetPassword/${id}`, pass)
            toast.success("reset password successfully", {autoClose: 2000 })
            navigate("/login")
        } catch (err) {
            toast.error(err.response.data.message, {autoClose: 2000 })
        }
    }
    return (
        <div className="resetpass">

            <body className="body">
                <div className="intro">
                    <h1>weRead</h1>
                    <h3>Hãy đọc sách theo cách của bạn</h3>
                </div>
                <div className="form">
                    <input type="password" placeholder="Nhập mật khẩu mới" onChange={(e) => setPass({...pass, password: e.target.value})}/>
                    <input type="password" placeholder="Xác nhận mật khẩu mới" onChange={(e) => setPass({...pass, passwordConfirm: e.target.value})}/>
                    <button onClick={handleResetPass}>Hoàn tất</button>
                </div>
            </body>
            <ToastContainer />
        </div>
        
    )
}
export default ResetPass
