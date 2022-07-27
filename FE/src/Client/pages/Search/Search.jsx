import React from "react";
import { useLocation } from "react-router-dom";
import Book from "../../commonComponent/bookList/book/Book";

import Navbar from "../../commonComponent/navbar/Navbar";
import TopBook from "../../commonComponent/top5book/TopBook";
import "./Search.scss";

const Search = () => {
  const location = useLocation();
  const searchWord = location.state.text;
  const resultBooks = location.state.data;
  // console.log("text", searchWord, "books", resultBooks);
  return (
    <div>
      <Navbar />
      <TopBook />
      <div className="container">
        <h1>Result for: {searchWord}</h1>
        <div className="listbook">
          {resultBooks.map((book) => {
            return (
              <Book key={book._id} data={book}/>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Search;
