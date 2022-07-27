import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import APIapp from '../../Client/APIS/APIapp'

export const postUser = createAsyncThunk('user/postUser', async (user) => {
    try {
        const response = await APIapp.post('users/login', user)
        localStorage.setItem('token', JSON.stringify(response.data.token))
        localStorage.setItem('role', JSON.stringify(response.data.data.user.role))
        console.log('role ',response.data.data.user.role)
        return response.data
    } catch (err) {
        return err.response.data.message
    }
})
export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
    try {
        const response = await APIapp.post('users/logout')
        return response.data
    } catch (err) {
        return err.response.data.message
    }
})

export const signUpUser = createAsyncThunk('user/signUpUser', async (user) => {
    try {
        const response = await APIapp.post('users/signup', user)
        return response.data
    } catch (err) {
        return err.response.data
    }
})

export const forgotPassword = createAsyncThunk('user/forgotPassword', async (email) => {
    try {
        const response = await APIapp.post('users/forgotPassword', email)
        console.log(response.data)
        return response.data
    } catch (err) {
        console.log(err.response)
        return err.response.data
    }
})

export const setPassword = createAsyncThunk('user/setPassword', async (resetToken, password) => {
    try {
        const response = await APIapp.post(`users/resetPassword/${resetToken}`, password)
        console.log(`users/resetPassword/${resetToken}`)
        console.log(response.data)
        return response.data
    } catch (err) {
        console.log(`users/resetPassword/${resetToken}`)
        console.log(err.response)
        return err.response.data
    }
})



const initialState = {
    isLoading: false,
    isAuth: false,
    error: "",
    resetToken: "",
}

const authSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        loginPending: (state) => {
            state.isLoading = true;
        },
        loginSuccess: (state) => {
            state.isLoading = false;
            state.isAuth = true;
            state.error = "";
        },
        loginFail: (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        },
        logout: (state) => {
            state.isLoading = false;
            state.isAuth = false;
        },
        resetPassword: (state, { payload }) => {
            state.resetToken = payload;
        }, 
        resetPasswordSuccess: (state) => {
            state.resetToken = "";
        }
    }
})

const { reducer, actions } = authSlice;

export const { loginPending, loginSuccess, loginFail, logout,  resetPassword, resetPasswordSuccess} = actions;

export default authSlice.reducer;