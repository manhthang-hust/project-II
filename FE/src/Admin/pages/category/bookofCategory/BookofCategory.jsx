import React,{useEffect,useState} from 'react'
import Sidebar from '../../../components/sidebar/Sidebar.js'
import Navbar from '../../../components/navbar/Navbar'
import Book from '../../../components/book/Book'
import APIapp from '../../../../Client/APIS/APIapp.js'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import './BookofCategory.scss'

const BookofCategory = () => {
    const { id } = useParams()
    const dispatch= useDispatch()
    const [allBook, setAllBook] = useState([])
    const [category,setCategory]= useState()
    useEffect(async () =>{
        const res = await APIapp.get(`categories/${id}/books`)
        const category= await APIapp.get(`categories/${id}`)
        console.log(res.data)
        setCategory((category.data.data.category.name)) 
        setAllBook((res.data.data.books))    
    }, [dispatch])
    let renderBooks = "";
    
    renderBooks = allBook != null ? (
        allBook.map((book) => (
            <Book key = {book._id} data = {book} />
        ))
    ) : (
        <div className="error">
            <h3>{allBook.Error}</h3>
        </div>
    )

    return (
        <div>
            <Navbar/>
            <div className="admin">
                <div className="sidebar">
                    <Sidebar/>
                </div>
                <div className="content">
                    <h3>{category}</h3>
                    <div className='renderbook'>{renderBooks}</div>
                </div>
            </div>
        </div>
    )
}

export default BookofCategory