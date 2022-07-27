
import React, { useEffect, useState } from 'react'
import './Home.scss'
import Navbar from '../../commonComponent/navbar/Navbar'
import TopBook from '../../commonComponent/top5book/TopBook'
import List from '../../commonComponent/bookList/list/List'
import { useDispatch, useSelector } from 'react-redux'
import { getRecentlyBook, RecentlyBook } from '../../../redux/slice/bookSLice.js'
import { fetchAsyncUser } from '../../../redux/slice/userSlice.js'
import { getUserProfile } from '../../../redux/slice/userAction'
import { getCategory, getCategorySuccess } from '../../../redux/slice/categorySlice'
import APIapp from '../../../Client/APIS/APIapp.js'
import Event from '../../commonComponent/event/Event'

const Home = () => {
    const [events, setEvent] = useState([])
    const dispatch = useDispatch();
    useEffect(async () => {
        await dispatch(fetchAsyncUser());
        await dispatch(getUserProfile())
        const recentlyBooks = await dispatch(getRecentlyBook())
        dispatch(RecentlyBook(recentlyBooks.payload.data.books))
        const categories = await dispatch(getCategory())
        dispatch(getCategorySuccess(categories.payload.data.categories))
        const events = await APIapp.get("events");
        console.log(events)
        setEvent(events.data.data.events)
    }, [dispatch])

    const { recentlyBook } = useSelector((state) => state.book)

    return (
        <div className="home">
            <Navbar />
            <TopBook/>
            <Event data={events} />
            <List title="Sách mới nhất" data = {recentlyBook} />
            
        </div>
    )
}

export default Home
