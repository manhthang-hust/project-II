import React, { useEffect, useState } from 'react'
import './BookStatistic.scss'
import { useDispatch } from 'react-redux'
import { top5Book, getBookStatistic } from '../../../../redux/slice/bookSLice.js'
import { getCategory } from '../../../../redux/slice/categorySlice'
import Sidebar from '../../../components/sidebar/Sidebar.js'
import Navbar from '../../../components/navbar/Navbar'
import Book from '../../../components/book/Book'
import { PieChart, Pie, Tooltip, Cell, Legend } from 'recharts'

const BookStatistic = () => {
    const dispatch = useDispatch()
    const [topBook, setTopBook] = useState([])
    const [statistic, setStatistic] = useState({})
    useEffect(async () => {
        const top = await dispatch(top5Book())
        const stat = await dispatch(getBookStatistic())
        setTopBook(top.payload)
        stat && setStatistic((stat.payload.data.bookStats)[0])
    }, [dispatch])

    let renderBooks = "";

    console.log('ts',((statistic)))
    renderBooks = topBook != null ? (
        topBook.map((book) => (
            <Book key = {book.book._id} data = {(book.book)} />
        ))
    ) : (
        <div className="error">
            <h3>{topBook.Error}</h3>
        </div>
    )

    const COLORS = ['#0088FE', '#00C49F']
    const COLORS1 = ['#FFBB28', '#FF8042']
    const COLORS2 = ['#00C49F', '#FF8042', '#AF19FF']
    const data_type = [
        {
            name: "Sách thường", 
            value: statistic.normalBooks ? (statistic.normalBooks)[0].numBooks : 0
        },
        {
            name: "Sách VIP", 
            value: statistic.vipBooks ? (statistic.vipBooks)[0].numBooks : 0
        }
    ]
    const data_new = [
        {
            name: "Sách mới", 
            value: statistic.newBooks ? (statistic.newBooks)[0].numBooks : 0
        },
        {
            name: "Sách cũ", 
            value: statistic.oldBooks ? (statistic.oldBooks)[0].numBooks : 0
        }
    ]
    const data_status = [
        {
            name: "Đang mượn", 
            value: statistic.borrowingBooks ? (statistic.borrowingBooks)[0].numBooks : 0
        },
        {
            name: "Đã mất", 
            value: statistic.lostBooks ? (statistic.lostBooks)[0].numBooks : 0
        },
        {
            name: "Có sẵn", 
            value: (statistic.allBooks) ? (statistic.allBooks)[0].numBooks - (statistic.borrowingBooks)[0].numBooks - (statistic.lostBooks)[0].numBooks : 0
        },
    ]

    return (
        <div className="bookStatistic">
            <Navbar/>
            <div className="admin">
                <div className="sidebar">
                    <Sidebar/>
                </div>
                <div className="content">
                    <div className="topBook">
                        <span className="title">Top 5 book</span>
                        <div className="book">
                            {renderBooks}
                        </div>
                    </div>
                    <span className="all">On Book ({(statistic.allBooks) ? (statistic.allBooks)[0].numBooks : 0})</span>
                    <div className="chart">
                        <div className="onType">
                            
                            <PieChart width={750} height={300} >
                                <Pie data={data_type} color="#000000" dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" >
                                    {
                                        data_type.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                                    }
                                </Pie>
                                <Tooltip  />
                                <Legend />
                            </PieChart>
                        </div>
                        <div className="onNew">
                            <PieChart width={750} height={300}>
                                <Pie data={data_new} color="#000000" dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" >
                                    {
                                        data_new.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS1[index % COLORS1.length]} />)
                                    }
                                </Pie>
                                <Tooltip  />
                                <Legend />
                            </PieChart>
                        </div>
                        <div className="onStatus">
                            <PieChart width={750} height={300}>
                                <Pie data={data_status} color="#000000" dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" >
                                    {
                                        data_status.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS2[index % COLORS2.length]} />)
                                    }
                                </Pie>
                                <Tooltip  />
                                <Legend />
                            </PieChart>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookStatistic
