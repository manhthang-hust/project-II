import React, { useEffect, useState } from 'react'
import './eventdetail.scss'
import Sidebar from '../../../components/sidebar/Sidebar.js'
import Navbar from '../../../components/navbar/Navbar'
import { useDispatch } from 'react-redux'
import { useParams } from "react-router"
import * as FiIcons from 'react-icons/fi'
import * as FcIcons from 'react-icons/fc'
import APIapp from '../../../../Client/APIS/APIapp.js'
import Update from '../updateModal/update.jsx'


const EventDetail = () => {
    const { id } = useParams()
    const dispatch = useDispatch()
    const [update, setUpdate] = useState(false);
    const [startdate,setStartdate]=useState()
    const [enddate,setEnddate]=useState()
    const [info,setInfo] =useState()
    const [minage, setMinage] =useState()
    const [maxage, setMaxage] =useState()
    let today= new Date()
    const [selectedEvent, setSelectedEvent] = useState({

    })
    useEffect(async () => {
        const res = await APIapp.get(`events/${id}`)
        setSelectedEvent((res.data.data.event))
        setStartdate((res.data.data.event.startDate.slice(0,10)))
        setEnddate((res.data.data.event.endDate.slice(0,10)))
        let num1 =(res.data.data.event.maxAge.slice(0,4))
        let num2 =(res.data.data.event.minAge.slice(0,4))
        setMinage((Number(today.getFullYear())-Number(num1)))
        setMaxage((Number(today.getFullYear())-Number(num2)))
        console.log(res)
    }, [setSelectedEvent])

    const toggleModal = (e) => {
        setUpdate(!update);
    };

    return (
        <div className="eventdetail">
            <Navbar/>
            <div className="admin">
                <div className="sidebar">
                    <Sidebar/>
                </div>
                <div className="content">
                    <div className="up">
                        <div className="left">
                            <img src={`http://127.0.0.1:8000/img/events/${selectedEvent.image}`} alt="" />
                        </div>
                        <div className="right">
                            <div className="name">
                                <span className="title">{selectedEvent.name} </span>
                            </div>
                            <span>Startdate: {startdate}</span>
                            <span>Enddate: {enddate}</span>
                            <span>Sale off: {selectedEvent.discount*100}%</span>
                            <span>Customers: {selectedEvent.gender}</span>
                            <span>Age from: {minage} to {maxage}</span>
                            <span>Content: {selectedEvent.content}</span>
                        </div>
                        <FiIcons.FiEdit color="var(--purple)" className="edit" onClick={(e) => {e.preventDefault(); toggleModal(); setInfo(selectedEvent) }}/>
                    </div>
                </div>
                {update && <Update clickMethod={toggleModal} data={info}/>}
            </div>
            
        </div>
    )
}

export default EventDetail