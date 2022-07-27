import React from 'react'
import './Table.scss'
import { Link } from "react-router-dom"
import { useSelector } from 'react-redux'


const DataTable = (props) => {
    const { data, vip } = props;

    const { user } = useSelector((state) => state.user)
    const type = (user.user.readingCard.type)
   console.log(user.user.readingCard.type)
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
                                <td>
                                    {item.status != "available" || (vip === true && type === "normal") ? (
                                        <button className="notAllow">Mượn ngay</button>
                                    ) : (
                                        <Link to={`/payment/${item._id}`} className="link">
                                            <button>Mượn ngay</button>
                                        </Link>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default DataTable
