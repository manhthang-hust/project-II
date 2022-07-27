import React from 'react'
import './AllOrders.scss'
import {useState, useEffect} from 'react'
import Sidebar from '../../../components/sidebar/Sidebar.js'
import Navbar from '../../../components/navbar/Navbar'
import APIapp from '../../../../Client/APIS/APIapp'
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import AddOrder from '../../../components/modalAddOrder/AddOrder'
import ReturnCopy from '../../../components/modalReturnCopy/ReturnCopy'
const AllOrders = () => {
    const [data, setData] = useState([]);
    //const [option, setOption] = useState('all');
    const [addOrder, setAddOrder] = useState(false);
    const [returnCopy, setReturnCopy] = useState(false);
    const [change, setChange] = useState(false);
    const [option, setOption] = useState('all');
    useEffect(async () => {
        const res = await APIapp.get((option=='all')?"orders":"orders?isReturned=false")
        console.log(res.data)
        setData(res.data.data.orders);
    },[change, option])
    const toggleAddOrder = (event) => {
        event.preventDefault();
        setAddOrder(!addOrder);
    };
    // const toggleChange = (event) => {
    //     event.preventDefault();
    //     setChange(!change);
    // };

    const toggleReturnCopy = (event) => {
        event.preventDefault();
        setReturnCopy(!returnCopy);
    };
    const AllOrder = ()=>{
        return (
        
                    <table className="order-table" id="all-order-table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Người mượn</th>
                                <th>Email</th>
                                <th>Tên sách</th>
                                <th>Copy ID</th>
                                <th>Ngày mượn</th>
                                <th>Hình thức</th>
                                <th>Trạng thái</th>
                            </tr>

                        </thead>
                        <tbody>
                            {data.map((order, index)=>(
                            <tr key={order._id} >
                                <td>{index+1}</td>
                                <td>{order.user.name}</td>
                                <td>{order.user.email}</td>
                                <td>{order.bookCopy.name}</td>
                                <td>{order.bookCopy.copyId}</td>
                                {/* <td>{order.user.address}</td> */}
                                <td>{order.createdAt.slice(0,10)}</td>
                                <td>{order.online?"Online":"Offline"}</td>
                                <td>{order.isReturned?"Đã trả":"Đang mượn"}</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>

        )
    }

    return (
        <div className="addBook">
            <Navbar/>
            <div className="admin">
                <div className="sidebar">
                    <Sidebar/>
                </div>
                <div className="content">
                <h1>Orders</h1>
                {/* <select onChange={(e)=>setOption(e.target.value)}>
                    <option value="all">all</option>
                    <option value="today">today</option>
                </select> */}
                <div className="right">
                <button className="btn-order return" onClick={toggleReturnCopy}>Add returned copy</button>
                <button className="btn-order add" onClick={toggleAddOrder}>Add new order</button>
                
                </div>
                <select className="select-orders" onChange={(e)=>setOption(e.target.value)}>
                    <option value="all">All</option>
                    <option value="borrowing">Borrowing</option>
                </select>
                <ReactHTMLTableToExcel
                    id="table-xls-button"
                    className="btn-download"
                    table="all-order-table"
                    filename="orders"
                    sheet="all"
                    buttonText="Download Excel"/>
              
                <div className="table-space">
                    <AllOrder/>

                </div>
                
                
                </div>
            </div>
            {addOrder && <AddOrder clickMethod = {toggleAddOrder}  setChange = {setChange} change={change}/>}
            {returnCopy && <ReturnCopy clickMethod = {toggleReturnCopy} setChange = {setChange} change={change} />}
            
        </div>
    )
}

export default AllOrders