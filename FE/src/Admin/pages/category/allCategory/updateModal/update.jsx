import React, { useState } from 'react'
import APIapp from '../../../../../Client/APIS/APIapp.js'

const Update = (props) => {

    const [category, setCategory] = useState({
        name:'',
    })
    

    const handleChange = async (e) => {
        console.log(category)
        console.log(props)
        const selected = await APIapp.patch(`categories/${props.data.id}`,category)
        console.log(selected)
        window.location.reload()
    }

    return (
        <>
                <div className="modal">
                    <div onClick={props.clickMethod} className="overlay"></div>
                    <div className="modal-content">
                        <span className="inform">Create new category</span>
                        <div className="form">
                            <input type="text" placeholder={props.data.name} onChange={(e) => setCategory({...category, name:e.target.value})}/>
                        </div>
                        <div className="btn">
                            <button className="close-modal"  onClick={handleChange}>Update</button>
                            <button className="close-modal close" onClick={props.clickMethod}>Close</button>
                        </div>
                    </div>
              </div>
        </>
    )
}

export default Update