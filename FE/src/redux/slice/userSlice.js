import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import APIapp from '../../Client/APIS/APIapp'
import axios from "axios"

export const fetchAsyncUser = createAsyncThunk('user/fetchAsyncUser', async () => {
    
    try {
        const accessToken = JSON.parse(localStorage.getItem('token'));
        if (!accessToken) {
            return("token not found");
        }
        const response = await APIapp.get('users/me')
        return response.data
    } catch (e) {
        console.log('error',e.message);
        return e.message;
    }
})

export const deleteUser = createAsyncThunk('user/deleteUser', async (user) => {
    try {
        const response = await axios.post('http://127.0.0.1:8000/api/v1/users/logout')
    } catch (e) {
        console.log('error',e.message)
    }
})

const initialState = {
    user: {},
    isLoading: false,
    error: "",
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        getUserPending: (state) => {
            state.isLoading = true;
        },
        getUserSuccess: (state, { payload }) => {
            state.isLoading = false;
            state.user = payload;
            state.error = "";
        },
        getUserFail: (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        },
    },
})

const { reducer, actions } = userSlice;

export const {getUserPending, getUserSuccess, getUserFail} = userSlice.actions;

export const getUser = (state) => state.user.user;
export default userSlice.reducer;