import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import './AllBook.scss'
import Sidebar from '../../../components/sidebar/Sidebar.js'
import Navbar from '../../../components/navbar/Navbar'
import { getAllBook } from '../../../../redux/slice/bookSLice.js'
import Book from '../../../components/book/Book'
import Pagination from './Pagination/Pagination'
import APIapp from '../../../../Client/APIS/APIapp'

const AllBook = () => {
    const [allBookLib, setAllBookLib] = useState([])
    const [allBook, setAllBook] = useState([])
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 18,
        total: 0
    })
    const [filter, setFilter] = useState({
        page: 1,
        limit: 18,
        allBook: allBook
    })
    const[textInput, setTextInput] = useState("")
    const dispatch = useDispatch()
    useEffect(async () => {
        const allBookLib = await dispatch(getAllBook())
        setAllBookLib(allBookLib.payload.data.books)
        setPagination({...pagination, total: (allBookLib.payload.data.books).length})
    }, [dispatch])

    useEffect(async () => {
        
        const allBook = await APIapp.get(`books?page=${filter.page}&limit=${filter.limit}`)
        setAllBook(allBook.data.data.books)
    }, [filter])
    let renderBooks = "";

    useEffect(async()=>{
        const newFilter = allBook.filter((value) => {
            return value.name.toLowerCase().includes(textInput.toLowerCase());
          });
          if (textInput ==='') {
            setAllBook(allBook);
          } else {
            setAllBook(newFilter);
          }
      },[textInput]);


    renderBooks = allBook.length != 0 ? (
        allBook.map((book) => (
            <Book key = {book._id} data = {book} />
        ))
    ) : (
        <div className="error">
            <h3>Not found</h3>
        </div>
    )

    const handlePageChange=(newPage) => {
        setPagination({...pagination, page: newPage})
        setFilter({...filter, page: newPage})
    }

    const handleSearch = (e) => {
        e.preventDefault();
        const searchBook = e.target.value;
        setTextInput(searchBook);
        setAllBook(allBookLib)
    };

    return (
        <div className="allBook">
            <Navbar/>
            <div className="admin">
                <div className="sidebar">
                    <Sidebar/>
                </div>
                <div className="content">
                    <input type="text" placeholder="search here" onChange={handleSearch}/>
                    <div className="bookPage">
                        {renderBooks}
                    </div>
                    {textInput ==='' ? <Pagination pagination={pagination} onPageChange={handlePageChange} className="pagination"/> : <></>}
                </div>
            </div>
        </div>
    )
}

export default AllBook
