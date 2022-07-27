import { configureStore } from "@reduxjs/toolkit";
import bookReducer from './slice/bookSLice'
import userReducer from './slice/userSlice'
import orderReducer from './slice/orderSlice'
import authReducer from './slice/authSlice'
import categoryReducer from './slice/categorySlice'

export const store = configureStore({
    reducer: {
        book: bookReducer,
        user: userReducer,
        order: orderReducer,
        auth: authReducer,
        category: categoryReducer,
    },
})