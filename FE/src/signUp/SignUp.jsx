import React, { useState } from 'react'
import './SignUp.scss'
import { useDispatch, useSelector } from 'react-redux'
import { signUpUser } from '../redux/slice/authSlice.js'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { useForm } from "react-hook-form";
import {yupResolver} from '@hookform/resolvers/yup'
import { ToastContainer, toast } from 'react-toastify'


const SignUp = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const formSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email address').required('Email is required'),
        phone: Yup.string().required('Phonenumber is required'),
        password: Yup.string().min(8,'password is too short').required('Password is required'),
        passwordConfirm: Yup.string().required('Repeat password is required').oneOf([Yup.ref('password')], 'Passwords must match'),
        dob: Yup.date(),
        gender: Yup.string().required('Gender is required'),
        address: Yup.string().required('Address is required'),
        paymentType: Yup.string().required('Paytype is required'),
    })
    const validationOpt = { resolver: yupResolver(formSchema) }

    const { register, handleSubmit, reset, formState } = useForm(validationOpt)

    const { errors } = formState

    const handleSignUp = async (data,e) => {
        e.preventDefault();
        console.log(data)
        const res = await dispatch(signUpUser(data));
        console.log(res)
        if(res.payload.status === 'success') {
            toast.success("Sign up success", {autoClose: 2000 })
            navigate('/login')
        }
        if(res.payload.status === 'error') {
            toast.error(res.payload.message, {autoClose: 3000 })
        }
    }
    
    return (
        <div className="signup">
            <header className="header">
                <h1>.weRead</h1>
            </header>
            <body className="body">
                <div className="form"  >
                    <div className="col1">
                        <input type="text" name="name" id="name" placeholder="Họ và tên"
                            {...register("name")}></input>
                        <p>{errors.name?.message}</p>
                        <input type="tel" name="phonenumber" id="phonenumber" placeholder="Số điện thoại"
                            {...register("phone")}></input>
                        <p>{errors.phone?.message}</p>
                        <input type="email" name="email" id="email" placeholder="email"
                            {...register("email", )}></input>
                        <p>{errors.email?.message}</p>
                        <input type="password" name="password" id="password" placeholder="Mật khẩu"
                            {...register("password")}></input>
                        <p>{errors.password?.message}</p>
                        <input type="password" name="repassword" id="repassword" placeholder="Nhập lại mật khẩu"
                            {...register("passwordConfirm")}></input>
                        <p>{errors.passwordConfirm?.message}</p>
                    </div>
                    <div className="col2">
                        <input type="date" name="dob" id="dob" placeholder="Ngày sinh"
                            {...register("birthday")}></input>
                        <p>{errors.dob?.message}</p>
                        <select type="text" name="gender" id="gender"
                            {...register("gender")}>
                            <option value="">Giới tính</option>
                            <option value="male">male</option>
                            <option value="female">female</option>
                            <option value="undefine">undefined</option>
                        </select>
                        <p>{errors.gender?.message}</p>
                        <input type="text" name="address" id="address" placeholder="Địa chỉ"
                            {...register("address")}></input>
                        <p>{errors.address?.message}</p>
                        <select type="text" name="readingCard" id="readingCard"
                            {...register("readingCard.type",{required: true})}>
                            <option value="vip">vip</option>
                            <option value="normal">normal</option>
                        </select>
                        <p>{errors.type?.message}</p>
                        <select type="text" name="paytype" id="paytype"
                            {...register("paymentType")}>
                            <option value="">Loại hình trả phí</option>
                            <option value="month">month</option>
                            <option value="year">year</option>
                        </select>
                        <p>{errors.paymentType?.message}</p>
                        <button onClick={handleSubmit(handleSignUp)}>Đăng ký</button>
                    </div>
                </div>
            </body>
            <ToastContainer />
        </div>
    )

}

export default SignUp
