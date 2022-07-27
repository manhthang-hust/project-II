import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import APIapp from '../../Client/APIS/APIapp'

export const addOrder = createAsyncThunk('order/addOrder', async (id,order) => {
    try {
        const response = await APIapp.post(`orders/${id}`, order)
        return response.data
    } catch (err) {
        return err.response.data
    }
})

const initialState = {
    orders: [],
}

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {

    },
    extraReducers: {
    }
})

export const getUser = (state) => state.user.user;
export default ordersSlice.reducer;