import React from "react";
import "./Book.scss";
import { Link } from "react-router-dom";

const Book = (props) => {
  const { data } = props;
  return (
    <div className="book">
      <Link to={`/book/${data._id}`} className="link">
        <div className="inner">
          <div className="top">
            <img src={(`http://127.0.0.1:8000/img/books/${data.image}`)} alt="" />
          </div>
          <div className="bottom">
            <div className="info">
              <p>{data.name}</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Book;
