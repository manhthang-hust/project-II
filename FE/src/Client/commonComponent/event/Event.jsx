import React from 'react'
import './Event.scss'
import EventBox from './eventBox/EventBox' 
import Slider from "react-slick"
const Event = (props) => {
    const { data } = props
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3
      };

    let renderEvents = ""
    renderEvents = data.map((event) => (
        <EventBox data={event} />
    ))
    return (
        <div className="event">
            <div className="container">
                <span className="titleEvent">Sự kiện đang diễn ra</span>
                <div className="allEvents">
                    <Slider {...settings}>
                        {renderEvents}
                    </Slider>
                </div>
            </div>
        </div>
    )
}

export default Event
