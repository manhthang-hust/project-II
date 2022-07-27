import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import './create.scss'
import { useParams } from "react-router"
import APIapp from '../../../../Client/APIS/APIapp.js'

const Modal = (props) => {
    const [file, setFile] = useState(null)
    const [event, setEvent] = useState({
        name:"",
        content:"",
        image:"",
        discount:"",
        startDate:"",
        dayCounter:"",
        gender:"",
        minAge:"",
        maxAge:"",
    })
    console.log(event)

    const handleChange = async (e) => {
        const formData = new FormData(); 
        if(file!=null) formData.append("image", file) ; 
        formData.append("name", event.name) ;
        formData.append("content", event.content) ;
        formData.append("discount", event.discount) ;
        formData.append("startDate", event.startDate) ;
        formData.append("dayCounter", event.dayCounter) ;
        if(event.gender!= "") formData.append("gender", event.gender) ; 
        formData.append("minAge", event.minAge) ;
        formData.append("maxAge", event.maxAge) ; 
        console.log(Array.from(formData));  
        const selected = await APIapp.post('events', formData)
        window.location.reload()
    }

    return (
        <>
                <div className="event">
                    <div onClick={props.clickMethod} className="overlay"></div>
                    <div className="modal-content">
                        <span className="inform">Create new event</span>
                        <div className="form">
                            <input type="text" placeholder="Name" onChange={(e) => setEvent({...event, name:e.target.value})}/>
                            <input type="text" placeholder="Content" onChange={(e) => setEvent({...event, content:e.target.value})}/>
                            <span>Choose image for the event:</span>
                            <input type="file" onChange={(e) => setFile(e.target.files[0])}/>
                            <input type="number" placeholder="Sale off" onChange={(e) => setEvent({...event, discount:e.target.value})}/>
                            <span>Choose the start date:</span>
                            <input type="date" onChange={(e) => setEvent({...event, startDate:e.target.value})}/>
                            <input type="number" placeholder="Days occur" onChange={(e) => setEvent({...event, dayCounter:e.target.value})}/>
                            <select type="text" onChange={(e) => setEvent({...event, gender:e.target.value})}>
                                <option value="">Gender</option>
                                <option value="all">Both male and female</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="undefined">Undefined</option>
                            </select>
                            <span>Choose the birthday of oldest customer:</span>
                            <input type="date" onChange={(e) => setEvent({...event, minAge:e.target.value})}/>
                            <span>Choose the birthday of youngest customer:</span>
                            <input type="date" onChange={(e) => setEvent({...event, maxAge:e.target.value})}/>
                        </div>
                        <div className="btn">
                            <button className="close-modal"  onClick={handleChange}>Create</button>
                            <button className="close-modal close" onClick={props.clickMethod}>Close</button>
                        </div>
                    </div>
              </div>
        </>
    )
}

export default Modal