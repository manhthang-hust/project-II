import React, { useEffect, useState } from 'react'
import Slider from '../../commonComponent/slider/Slider'
import './Intro.scss'
import Event from '../../commonComponent/event/Event'
import {useNavigate} from 'react-router-dom'
import APIapp from '../../../Client/APIS/APIapp.js'

const Intro = () => {
    let navigate= useNavigate();
    const [events, setEvent] = useState([])
    useEffect(async () => {
        const events = await APIapp.get("events");
        setEvent(events.data.data.events)
    }, []);
    return (
        <div className="intro">
            <div className="header">
                <div className="option-login" onClick={()=>{navigate('/login')}}>Login</div>
            </div>
            
            <div className="content-1">
                <div className="intro-1">
                    <h1>weRead</h1>
                    <p>Hệ thống thư viện quốc gia với hàng triệu đầu sách và luôn được cập nhật mỗi ngày.</p>
                    <p>Với sứ mệnh mang sách đến gần hơn với người đọc, chúng tôi mang đến cho độc giả nhưng dịch vụ tiện ích nhất. 
                        weRead cung cấp cho người đọc những hình thức mượn sách online và offline phù hợp với thời gian, hoàn cảnh của mọi đối tượng độc giả.</p>
                    <button onClick={()=>{navigate('/signup')}}>Trải nghiệm ngay</button>

                </div>
                <div className="slider-container">
                    <Slider/>

                </div>         
                
            </div>
            <Event data={events}/>
            <div className="policy">
                <div className="policy-title">Chính sách đăng ký thẻ đọc</div>
                <div className="policy-container">
                    <div className="vip-user user-container">
                        <h3>Người dùng VIP</h3>
                        <div>Có thể mượn tối ta 8 quyển sách</div>
                        <div>Thời hạn mượn tối đa là 60 ngày</div>
                        <div>Có thể được mượn những sách hiếm</div>
                        <div>Đăng kí thẻ tháng với giá 150k/tháng</div>
                        <div>Đăng kí thẻ năm với giá 1500k/năm</div>

                    </div>
                    <div className="normal-user user-container">
                        <h3>Người dùng thường</h3>
                        <div>Có thể mượn tối ta 5 quyển sách</div>
                        <div>Thời hạn mượn tối đa là 45 ngày</div>
                        <div>Đăng kí thẻ tháng với giá 100k/tháng</div>
                        <div>Đăng kí thẻ năm với giá 1000k/năm</div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Intro

