import React,{useEffect,useState} from 'react'
import './Event.scss'
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/Navbar'
import APIapp from '../../../Client/APIS/APIapp.js'
import * as MdIcons from 'react-icons/md'
import * as FiIcons from 'react-icons/fi'
import * as IoIcons from 'react-icons/io5'
import Create from '../event/createModal/create.jsx'
import { Link } from 'react-router-dom'


const Event = () => {
    const [data, setData] = useState([]);
    const [create, setCreate] = useState(false);
    useEffect(async () => {
        const res = await APIapp.get('events')
        console.log(res.data)
        setData(res.data.data.events);
    },[])
    console.log(data)
    const toggleCreate = (event) => {
        event.preventDefault();
        setCreate(!create);
    };
    return (
        <div className='events'>
            <Navbar/>
            <div className="admin">
                <div className="sidebar">
                    <Sidebar/>
                </div>
                <div className="content">
                    <h1>Events</h1>  
                    <div>
                        <button className="createbtn" onClick={toggleCreate}>Create new event</button>
                        <table className="table">
                            <thead className="tablehead">
                                <tr>
                                    <th>Event</th>
                                    <th>Sale off</th>
                                    <th>Start date</th>
                                    <th>Days occur</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody className="tablebody">
                                {data.map((events) =>(
                                    <tr key={events._id} className='tb-row'>
                                        <td>{events.name}</td>
                                        <td>{events.discount*100}%</td>
                                        <td>{events.startDate.slice(0,10)}</td>
                                        <td>{events.dayCounter}</td>
                                        <td>
                                            <Link to={`/event/allEvents/${events._id}`} className="link">
                                                <IoIcons.IoInformationCircleOutline className="icon3"/>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {create && <Create clickMethod={toggleCreate}/>}
                </div>
            </div>
        </div>
    )
}

export default Event