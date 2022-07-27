import React, { useState } from 'react'
import './CopyTable.scss'
import { Link } from "react-router-dom"
import * as FiIcons from 'react-icons/fi'
import * as MdIcons from 'react-icons/md'
import UpdateCopy from '../../../../components/modalUpdateCopy/UpdateCopy'

const CopyTable = (props) => {
    const { data } = props;
    const [update, setUpdate] = useState(false);
    const [item, setItem] = useState({})
    const toggleUpdate = (event) => {
        setUpdate(!update);
    };
    const changeCopy = (copy) => {
        setUpdate(copy)
    }
    return (
        <div className="dataTable">
            <div className="container">
                <table>
                    <thead>
                        <tr>
                            <th>CopyID</th>
                            <th>State</th>
                            <th>Printed Year</th>
                            <th>Order turns</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr>
                                <td>{item.copyId}</td>
                                <td>{item.new ? "New" : "Old"}</td>
                                <td>{item.printedYear}</td>
                                <td>{item.ordersQuantity}</td>
                                <td>{item.status}</td>
                                <td>
                                    <FiIcons.FiEdit color="var(--purple)" onClick={(e) => {toggleUpdate(); setItem(item)}} className="icon" />
                                    
                                </td>
                                
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {update && <UpdateCopy clickMethod = {toggleUpdate} data = {item} handlerBook = {changeCopy}/>}
        </div>
    )
}

export default CopyTable
