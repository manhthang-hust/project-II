import React, { useEffect } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { loginSuccess } from '../redux/slice/authSlice'
import { useDispatch } from 'react-redux'
import ResetPass from '../redux/slice/authSlice'
// import ResetPass from '../resetPassword/ResetPass'

const PrivateRoute = () => {
    const { isAuth, resetToken } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    console.log(isAuth)
    const roleAccess=JSON.parse(localStorage.getItem('role'))
    console.log(roleAccess)
    
    useEffect(() =>{
        !isAuth && localStorage.getItem('token') &&dispatch(loginSuccess())
    },[isAuth, dispatch])
    return (
        resetToken ? <ResetPass/> : (localStorage.getItem('token') ? <Outlet /> : <Navigate to="/login" />)
    )
}

export default PrivateRoute
