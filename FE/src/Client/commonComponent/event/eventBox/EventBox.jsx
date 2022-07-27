import React from 'react'
import './EventBox.scss'

const EventBox = (props) => {
    const { data } = props
    const handleDate = (date) => {
        return `${date.slice(8,10)}/${date.slice(5,7)}/${date.slice(0,4)}`
    }
    let today= new Date()
    return (
        <div className="EventBox">
            <img src={(`http://127.0.0.1:8000/img/events/${data.image}`)} alt="" className="banner"/>
            <span className="title">{data.name}</span>
            <p>Giảm giá: {data.discount*100}%</p>
            <p>Từ ngày: {handleDate(data.startDate.slice(0,10))} đến ngày {handleDate(data.endDate.slice(0,10))}</p>
            <div className="eventInfo">
                <div className="wrap">
                    <p>Đối tượng: {data.gender}</p>
                    <p>Độ tuổi: từ {Number(today.getFullYear()) - Number(data.maxAge.slice(0,4))} đến {Number(today.getFullYear()) - Number(data.minAge.slice(0,4))}</p>
                    <p>Nội dung: {data.content}</p>
                </div>
            </div>
        </div>
    )
}

export default EventBox
