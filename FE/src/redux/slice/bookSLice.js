import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import APIapp from '../../Client/APIS/APIapp'

// export const fetchAsyncBooks = createAsyncThunk('books/fetchAsyncBooks', async () => {
//     const response = await APIapp.get(`books?category_like=Metal`)
//     console.log(response.data)
//     return response.data;
// })

// export const fetchAsyncBookDetail = createAsyncThunk('books/fetchAsyncBookDetail', async (id) => {
//     const response = await APIapp.get(`books?id=${id}`)
//     return response.data;
// })

// export const fetchAsyncSelectedCopy = createAsyncThunk('books/fetchAsyncSelectedCopy', async (id) => {
//     const response = await APIapp.get(`bookCopies?_id=${id}`)
//     return response.data;
// })

// export const fetchAsyncSearch = createAsyncThunk('books/fetchAsyncSearch', async (title) => {
//     const response = await APIapp.get(`books`)
//     return response.data;
// })

// export const fetchAsyncCopies = createAsyncThunk('books/fetchAsyncCopies', async () => {
//     const response = await APIapp.get(`bookCopies?new=true`)
//     return response.data;
// })

//admin
export const updateBook = createAsyncThunk('user/updateBook', async (id, book) => {
    try {
        const response = await APIapp.patch(`books/${id}`, book)
        return response
    } catch (err) {
        return err.response.data.message
    }
})

export const deleteCopy = createAsyncThunk('user/deleteCopy', async (id, book) => {
    try {
        const response = await APIapp.delete(`books/${id}`, book)
        return response.data
    } catch (err) {
        return err.response.data.message
    }
})

export const createCopy = createAsyncThunk('user/createCopy', async (id, copy) => {
    try {
        const response = await APIapp.post(`books/${id}/bookCopies`, copy)
        return response.data
    } catch (err) {
        return err.response.data.message
    }
})

export const createBook = createAsyncThunk('user/createBook', async (book) => {
    try {
        const response = await APIapp.post(`books`, book)
        return response.data
    } catch (err) {
        return err.response.data
    }
})

export const getBookStatistic = createAsyncThunk('user/getBookStatistic', async () => {
    try {
        const response = await APIapp.get(`bookCopies/book-stats`)
        return response.data
    } catch (err) {
        return err.response.data.message
    }
})

//user
export const top5Book = createAsyncThunk('user/top5Book', async () => {
    try {
        const response = await APIapp.get('bookCopies/top-5-books')
        return response.data.data.topBooks
    } catch (err) {
        return err.response.data.message
    }
})

export const getRecentlyBook = createAsyncThunk('user/getRecentlyBook', async () => {
    try {
        const response = await APIapp.get('books?sort=-createdAt&limit=24')
        return response.data
    } catch (err) {
        return err.response.data.message
    }
})

export const getAllBook = createAsyncThunk('user/getAllBook', async () => {
    try {
        const response = await APIapp.get('books')
        return response.data
    } catch (err) {
        return err.response.data.message
    }
})

export const getBookDetail = createAsyncThunk('user/getBookDetail', async (id) => {
    try {
        const response = await APIapp.get(`books/${id}`)
        return response.data
    } catch (err) {
        return err.response.data.message
    }
})

export const getCopyOnBook = createAsyncThunk('user/getCopyOnBook', async (id) => {
    try {
        const response = await APIapp.get(`books/${id}/bookCopies`)
        return response.data
    } catch (err) {
        return err.response.data.message
    }
})

export const getSelectedCopy = createAsyncThunk('user/getSelectedCopy', async (id) => {
    try {
        const response = await APIapp.get(`bookcopies/${id}`)
        return response.data
    } catch (err) {
        return err.response.data.message
    }
})

export const addBookNotifications = createAsyncThunk('user/addBookNotifications', async (id) => {
    try {
        const response = await APIapp.patch(`books/${id}/notification`)
        return response.data
    } catch (err) {
        return err.response.data.message
    }
})

export const removeBookNotifications = createAsyncThunk('user/removeBookNotifications', async (id) => {
    try {
        const response = await APIapp.delete(`books/${id}/notification`)
        return response
    } catch (err) {
        return err.response.data
    }
})

const initialState = {
    topBook: [],
    books: [],
    selectedBook: {},
    copies: [],
    selectedCopy: {},

    recentlyBook:[],
}

const bookSlice = createSlice({
    name: "book",
    initialState,
    reducers: {
        getTop5: (state, { payload }) => {
            state.topBook = payload;
        },
        RecentlyBook: (state, { payload }) => {
            state.recentlyBook = payload;
        },
        getSelectedBook: (state, { payload }) => {
            state.selectedBook = payload;
        },
        copyOnBook: (state, { payload }) => {
            state.copies = payload;
        },
        setSelectedCopy: (state, { payload }) => {
            state.selectedCopy = payload;
        },
        setSelectedBookAd: (state, { payload }) => {
            state.selectedBook = payload;
        },
        removeCopyOnBook: (state) => {
            state.copies = [];
        },
        removeSelectedBook: (state) => {
            state.selectedBook = {};
        },
    },
})

export const { getTop5, RecentlyBook, getSelectedBook, copyOnBook, removeSelectedBook, removeCopyOnBook, setSelectedCopy, setSelectedBookAd } = bookSlice.actions;
export const getCopies = (state) => state.book.copies;
export default bookSlice.reducer;