import React, { useState, useEffect } from 'react'
import './AddBook.scss'
import Sidebar from '../../../components/sidebar/Sidebar.js'
import Navbar from '../../../components/navbar/Navbar'
import { getCategory } from '../../../../redux/slice/categorySlice.js'
import { createBook, getAllBook } from '../../../../redux/slice/bookSLice'
import { useDispatch } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify'
import * as XLSX from "xlsx"
import APIapp from '../../../../Client/APIS/APIapp'

const AddBook = () => {
    const dispatch = useDispatch()
    const [book, setBook] = useState({
        name: "",
        publisher: "",
        isVIP: true,
        description: "",
        category: "",
        author: ""
    })
    const [categories, setCategories] = useState([])
    const [file, setFile] = useState({})
    const [items, setItems] = useState([])
    const [books, setBooks] = useState([])
    useEffect(async () => {
        const category = await dispatch(getCategory())
        setCategories(category.payload.data.categories)
        const books = await dispatch(getAllBook())
        setBooks(books.payload.data.books)
    }, [dispatch])
    
    
    const handleCreate = async (e) => {
        e.preventDefault()
        const formData = new FormData(); 
        formData.append("image", file); 
        formData.append("name", book.name);
        formData.append("author", book.author);
        formData.append("publisher", book.publisher);
        formData.append("category", book.category);
        formData.append("isVIP", book.isVIP);
        formData.append("description", book.description);
        console.log(Array.from(formData));
        const newBook = await dispatch(createBook(formData));
        newBook.payload.data != null ? toast.success("success", {autoClose: 2000 }) : toast.error(newBook.payload.error.message, {autoClose: 4000 }) 
        // newBook.payload.error.status === "error" && 
        // newBook.payload.data.status === "success"&&
    }

    const readExcel = (file) => {
        const promise = new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.readAsArrayBuffer(file);
    
          fileReader.onload = (e) => {
            const bufferArray = e.target.result;
    
            const wb = XLSX.read(bufferArray, { type: "buffer" });
    
            const wsname = wb.SheetNames[0];
    
            const ws = wb.Sheets[wsname];
    
            const data = XLSX.utils.sheet_to_json(ws);
    
            resolve(data);
          };
    
          fileReader.onerror = (error) => {
            reject(error);
          };
        });
    
        promise.then((d) => {
          setItems(d);
        });
      }

    const handleAddCopy = async(e) => {
        e.preventDefault();
        items.length!=0&&items.map(async(item) => {
            let copy = ""
            if(books.length!=0){
                copy = books.filter((book) => {
                if(book.name === item.book) {
                    return book.id
                }
            })}
            const id = copy[0].id
            delete item.book
            console.log('copy',item)
            try {
                const newCopy = await APIapp.post(`books/${id}/bookCopies`, item)
                toast.success("success", {autoClose: 2000 })
            } catch (err) {
                toast.error(err.response.data.message, {autoClose: 2000 })
            }
        })
    }

    return (
        <div className="addBook">
            <Navbar/>
            <div className="admin">
                <div className="sidebar">
                    <Sidebar/>
                </div>
                <div className="content">
                    <div className="form">
                                <span>Add book</span>
                                <input type="text" placeholder="Name" onChange={(e) => setBook({...book, name:e.target.value})}/>
                                <input type="file" onChange={(e) =>setFile(e.target.files[0])}/>
                                <input type="text" placeholder="Author" onChange={(e) => setBook({...book, author:e.target.value})}/>
                                <input type="text" placeholder="Publisher" onChange={(e) => setBook({...book, publisher:e.target.value})}/>
                                <select type="text" onChange={(e) => setBook({...book, category:e.target.value})}>
                                    {categories.map((category) => (
                                        <option value={category.id}>{category.name}</option>
                                    ))}
                                </select>
                                <input type="text" placeholder="Description" onChange={(e) => setBook({...book, description:e.target.value})}/>
                                <select type="text" onChange={(e) => setBook({...book, isVIP:e.target.value})}>
                                    <option value="true">VIP</option>
                                    <option value="false">Normal</option>
                                </select>
                                <button onClick = {handleCreate}>create</button>
                                <span>Add copy</span>
                                <input className="excelFile" type="file" placeholder="import your file here" onChange={(e) => {const file = e.target.files[0];readExcel(file);}}/>
                                <button className="btn_add" onClick={handleAddCopy}>send</button>
                    </div>
                    
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default AddBook
