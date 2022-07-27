import React, { useState, useEffect } from "react";
import styled from "styled-components";
import APIapp from "../../APIS/APIapp";
import Navbar from "../../commonComponent/navbar/Navbar";
import './History.scss';

const History = () => {
  const [bookOrdered, setbookOrdered] = useState([]);
  useEffect(async () => {
    const response = await APIapp.get("/users/my-orders");
    setbookOrdered(response.data.data.orders);
  }, []);

 
  console.log(bookOrdered);
  return (
    <div className="containerHistory">
      <Navbar />
      <div className="Wrapper">
        <thead className="Trhead">
          <th>Sách</th>
          <th>Tên sách</th>
          <th>Ngày mượn</th>
          <th>Ngày trả</th>
          <th>Tình trạng</th>
        </thead>
        {bookOrdered.map((order) => (
          <tbody className="TrBody">
            <td>
              <img src={(`http://127.0.0.1:8000/img/books/${order.bookCopy.book.image}`)} />
            </td>
            <td>{order.bookCopy.name}({order.bookCopy.copyId})</td>
            <td>{order.createdAt.slice(0,10)}</td>
            <td>{(order.isReturned) ? (order.returnDate==undefined ? `DD-MM-YYY` : order.returnDate.slice(0,10)) : `DD-MM-YYY`}</td>
            <td> {(order.isReturned) ? `Đã trả`:`Đang mượn` }</td>
          </tbody>
        ))}
      </div>
    </div>
  );
};

export default History;
