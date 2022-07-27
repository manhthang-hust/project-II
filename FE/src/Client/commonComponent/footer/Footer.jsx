import React from 'react'
import './Footer.scss'
import * as BsIcons from 'react-icons/bs'

const Footer = () => {
    return (
        <div>
            <div className="footer">
                <div className="footer-col1">
                    weRead
                </div>
                <div className="footer-col2">
                    <div>Contact us: 0399445566</div>
                    <div>Address: 31 Tràng Thi</div>
                    <div>Email: elibrary@gmail.com</div>
                </div>
                <div className="footer-col3">
                    <div>Follow us</div>
                    <div className="icons">
                        <a href="https://www.facebook.com/LocFuho94"><BsIcons.BsFacebook/></a>
                        <a href="https://www.facebook.com/LocFuho94"><BsIcons.BsInstagram/></a>
                        <a href="https://www.facebook.com/LocFuho94"><BsIcons.BsTwitter/></a>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default Footer
