import React from 'react'
import './TodayOrder.scss'
import { useState, useEffect } from 'react'
import Sidebar from '../../../components/sidebar/Sidebar.js'
import Navbar from '../../../components/navbar/Navbar'
import APIapp from '../../../../Client/APIS/APIapp'
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
const TodayOrder = () => {
    const [data, setData] = useState([]);
    useEffect(async () => {
        const res = await APIapp.get('orders/today-orders')
        console.log(res.data)
        setData(res.data.data.todayOrders);
    },[])
   
    return (
        <div className="addBook">
            <Navbar/>
            <div className="admin">
                <div className="sidebar">
                    <Sidebar/>
                </div>
                <div className="content">
                    <h1>Online Orders Today</h1>
                    <ReactHTMLTableToExcel
                    id="table-xls-button"
                    className="btn-download"
                    table="today-order-table"
                    filename="online-orders"
                    sheet="online-today"
                    buttonText="Download Excel"/>
                    <div className="table-space">
                    <table id="today-order-table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Người nhận</th>
                                <th>SĐT</th>
                                <th>Địa chỉ</th>
                                <th>Tên sách</th>
                                <th>Copy ID</th>
                            </tr>

                        </thead>
                        <tbody>
                            {data.map((order, index)=>(
                            <tr key={order._id}>
                                <td>{index+1}</td>
                                <td>{order.receiverName}</td>
                                <td>{order.receiverPhone}</td>
                                <td>{order.receiverAddress}</td>
                                <td>{order.bookCopy.name}</td>
                                <td>{order.bookCopy.copyId}</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>

                    </div>
                   

                </div>
                    
            </div>
            
        </div>
    )
}

export default TodayOrder