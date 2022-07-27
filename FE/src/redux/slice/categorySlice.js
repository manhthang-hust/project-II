import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import APIapp from '../../Client/APIS/APIapp'

export const getCategory = createAsyncThunk('user/getCategory', async () => {
    try {
        const response = await APIapp.get('categories')
        return response.data
    } catch (err) {
        console.log(err.response)
        return err.response.data
    }
})

export const getBookOnCategory = createAsyncThunk('user/getBookOnCategory', async (category_id) => {
    try {
        const response = await APIapp.get(`categories/${category_id}/books`)
        return response.data
    } catch (err) {
        console.log(err.response)
        return err.response.data
    }
})

const initialState = {
    categories: [],
    categoryBooks: [],
}

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        getCategorySuccess: (state, { payload }) => {
            state.categories = payload;
        },
        getCategoryBooksSuccess: (state, { payload }) => {
            state.categories = payload;
        },
    }
})

const { reducer, actions } = categorySlice;

export const { getCategorySuccess, getCategoryBooksSuccess } = actions;

export default categorySlice.reducer;