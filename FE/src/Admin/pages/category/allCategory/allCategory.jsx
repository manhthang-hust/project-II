import React,{useEffect,useState} from 'react'
import './allCategory.scss'
import Sidebar from '../../../components/sidebar/Sidebar.js'
import Navbar from '../../../components/navbar/Navbar'
import APIapp from '../../../../Client/APIS/APIapp.js'
import * as MdIcons from 'react-icons/md'
import * as FiIcons from 'react-icons/fi'
import * as IoIcons from 'react-icons/io5'
import Modal from './createModal/create.jsx'
import { Link } from 'react-router-dom'
import Update from '../../category/allCategory/updateModal/update.jsx'


const AllCategories = () => {
    const [data, setData] = useState([]);
    const [modal, setModal] = useState(false);
    const [update, setUpdate] = useState(false)
    const [info, setInfo] = useState()
    useEffect(async () => {
        const res = await APIapp.get('categories')
        console.log(res.data)
        setData(res.data.data.categories);
    },[])
    console.log(data)
    const toggleCreate = (event) => {
        event.preventDefault();
        setModal(!modal);
    };
    const toggleUpdate = () =>{
        setUpdate(!update)
    }
    return (
        <div className='category'>
            <Navbar/>
            <div className="admin">
                <div className="sidebar">
                    <Sidebar/>
                </div>
                <div className="content">
                    <div>
                        <h1>Categories</h1>
                        <button onClick={toggleCreate} className="createbtn">Create new categories</button>
                    </div>
                    <table className="table">
                        <thead className="tablehead">
                            <tr>
                                <th>Name</th>
                                <th className='bookquantity'>Books Quantity</th>
                                <th className='action'>Action</th>
                            </tr>
                        </thead>
                        <tbody className="tablebody">
                            {data.map((categories) =>(
                                <tr key={categories.id } className="row-tb">
                                    <td>{categories.name}</td>
                                    <td>{categories.booksQuantity}</td>
                                    <td>
                                        {/* <MdIcons.MdDeleteOutline className="icon1"/>
                                        <FiIcons.FiEdit className="icon2"/> */}
                                        <FiIcons.FiEdit className="icon2" onClick={(e) => {e.preventDefault(); toggleUpdate(); setInfo(categories);}}/>
                                        <Link to={`/category/allCategory/${categories.id}`} className="link">
                                            <IoIcons.IoInformationCircleOutline className="icon3"/>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {modal && <Modal clickMethod = {toggleCreate}/>}
                    {update && <Update clickMethod ={toggleUpdate} data ={info}/>}
                </div>
            </div>
        </div>
    )
}

export default AllCategories