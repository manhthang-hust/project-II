import React, { useState, useEffect } from 'react'
import './Slider.scss'
import lib1 from '../../store/lib1.jpg'
import lib2 from '../../store/lib2.jpg'
import lib3 from '../../store/lib3.jpg'
import lib4 from '../../store/lib4.jpg'
import lib5 from '../../store/lib5.jpg'

function Slider(){
    let [counter, setCounter] = useState(1);


    useEffect(() => {
        console.log("thaydoi")
        let timerID = setInterval(() => {
            if (counter < 5) {
                counter = counter + 1;
                setCounter(counter);
            } else {
                counter = 1;
                setCounter(counter)
            }
        }, 5000)

        return () => {
            console.log('clear')
            clearInterval(timerID);
        }
    }, [counter])
    return (
        
                <div className="slider-wrapper">
                    
                    <div className="slides">
                        <input type="radio" checked={counter === 1 ? true : false} name="radio-btn" id="radio1" />
                        <input type="radio" checked={counter === 2 ? true : false} name="radio-btn" id="radio2" />
                        <input type="radio" checked={counter === 3 ? true : false} name="radio-btn" id="radio3" />
                        <input type="radio" checked={counter === 4 ? true : false} name="radio-btn" id="radio4" />
                        <input type="radio" checked={counter === 5 ? true : false} name="radio-btn" id="radio5" />

                        <div className="slide first">
                            <img src={lib1} alt="" />
                        </div>
                        <div className="slide">
                            <img src= {lib2} alt="" />
                        </div>
                        <div className="slide">
                            <img src={lib3} alt="" />
                        </div>
                        <div className="slide">
                            <img src={lib4} alt="" />
                        </div>
                        <div className="slide">
                            <img src={lib5} alt="" />
                        </div>

                        <div className="navigation-auto">
                            <div className="navigation-auto1"></div>
                            <div className="navigation-auto2"></div>
                            <div className="navigation-auto3"></div>
                            <div className="navigation-auto4"></div>
                            <div className="navigation-auto5"></div>
                        </div>

                        <div className="navigation-manual">
                            <label htmlFor="radio1" className="manual-btn" onClick={() => { counter = 1; setCounter(counter) }}></label>
                            <label htmlFor="radio2" className="manual-btn" onClick={() => { counter = 2; setCounter(counter) }}></label>
                            <label htmlFor="radio3" className="manual-btn" onClick={() => { counter = 3; setCounter(counter) }}></label>
                            <label htmlFor="radio4" className="manual-btn" onClick={() => { counter = 4; setCounter(counter) }}></label>
                            <label htmlFor="radio5" className="manual-btn" onClick={() => { counter = 5; setCounter(counter) }}></label>
                        </div>
                    </div>
                </div>
   
    )
}
export default Slider;