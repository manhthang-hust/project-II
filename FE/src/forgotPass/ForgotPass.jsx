import React, {useState} from 'react'
import './ForgotPass.scss'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { forgotPassword, resetPassword } from '../redux/slice/authSlice.js'
import { ToastContainer, toast } from 'react-toastify'

const ForgotPass = () => {
    const [email, setEmail] = useState({
        email:'',
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleForgot = async (e) => {
        const res = await dispatch(forgotPassword(email));
        if(res.payload.status === "success") toast.success("Token sent to your email !!", {autoClose: 2000 });
        else toast.error("email not found !!", {autoClose: 2000 });
        console.log('res',res.payload.status)
    }
    return (
        <div className="forgotpass">

            <body className="body">
                <div className="intro">
                    <h1>weRead</h1>
                    <h3>Hãy đọc sách theo cách của bạn</h3>
                </div>
                <div className="form">
                    <input type="email" placeholder="Nhập email của bạn ở đây" onChange={(e) => setEmail({...email, email:e.target.value})}/>
                    <button onClick={handleForgot}>Lấy lại mật khẩu</button>
                </div>
            </body>
            <ToastContainer />
        </div>
    )
}

export default ForgotPass
