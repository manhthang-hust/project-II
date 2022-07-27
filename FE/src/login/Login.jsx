import React, { useState, useEffect } from 'react'
import './Login.scss'
import { useDispatch, useSelector } from 'react-redux'
import { postUser, loginPending, loginSuccess, loginFail } from '../redux/slice/authSlice.js'
import { useNavigate } from 'react-router-dom';
import APIapp from '../Client/APIS/APIapp';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Login = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    var today =new Date()
    console.log(today)
    function isLater(date){
        console.log((date.slice(8,10) >"11"))
        if( today.getFullYear() == date.slice(0,4)){
            if((today.getMonth()+1) == date.slice(5,7)){
                if(today.getDate() < date.slice(8,10)) return true
                else return false 
            } else if((today.getMonth()+1) < date.slice(5,7)) return true
            else return false
        }else if(today.getFullYear() < date.slice(0,4)) return true
        else return false
    }
    console.log((isLater("2022-01-20")))

    const { isAuth } = useSelector((state) => state.auth)
    const role = JSON.parse(localStorage.getItem('role'))
    useEffect(() => {
        (isAuth || localStorage.getItem('token')) && ((role === "user") ? navigate('/userHome') : navigate('/adminHome'))
    }, [isAuth, navigate]);
    const [events, setEvents]=useState([])
    useEffect(async () =>{
        try{
            const res = await APIapp.get('events')
            console.log(res)
            setEvents((res.data.data.events))
        }catch(err){
            console.log(err.response.data)
        }
        
    },[setEvents] )
    console.log(events)
    const [user, setUser] = useState({
        email:'',
        password:'',
    });

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!user.email || !user.password) {
            toast.error("please fill the form", {autoClose: 2000 })
			return dispatch(loginFail("please fill the form"));
		}

        dispatch(loginPending());

        try {
            const isAuth = await dispatch(postUser(user))
            console.log('auth', isAuth);

            if (isAuth.payload === "Incorrect email or password") {
                toast.error(isAuth.payload, {autoClose: 2000 })
                return dispatch(loginFail(isAuth.payload));
            }
            if (isAuth.payload === "Your account has been blocked for some reasons. Please contact us for supports or create a new account") {
                toast.error(isAuth.payload, {autoClose: 5000 })
                return dispatch(loginFail(isAuth.payload));
            }
            console.log(isAuth.payload)
            dispatch(loginSuccess())
            if(role === "user") {
                navigate('/userHome')
            } else {
                navigate('/adminHome')
            }
            window.location.reload()
            
        } catch (error) {
            dispatch(loginFail(error.message));
        }
    }

    const handleForgot = (e) => {
        e.preventDefault();
        navigate('/forgot')
    }

    const handleSignUp = (e) => {
        e.preventDefault();
        navigate('/signup');
    }

    return (
        <div className="Login">
            <body className="body">
                <div className="intro">
                    <h1>weRead</h1>
                    <h3>Hãy đọc sách theo cách của bạn</h3>
                </div>
                <div className="loginform">
                    <input type="email" placeholder="Email" onChange={(e) => setUser({ ...user, email: e.target.value })} />
                    <input type="password" placeholder="Mật khẩu" onChange={(e) => setUser({ ...user, password: e.target.value })} />
                    <button className="loginbut" onClick={handleLogin}>Đăng nhập</button>
                    <span onClick={handleForgot} className='quenmk'>Quên mật khẩu?</span>
                    <button className="signupbut" onClick={handleSignUp}>Đăng ký</button>
                    <img src="" alt="" />
                </div>
            </body>
            <ToastContainer />
        </div>
    )
}

export default Login
