import React from "react";
import { ImInfo } from "react-icons/im";
import Navbar from "../../../components/navbar/Navbar";
import Sidebar from "../../../components/sidebar/Sidebar";
import { useState, useEffect } from "react";
import APIapp from "../../../../Client/APIS/APIapp";
import "./AllUser.scss";
import Info from "../Info/Info";
import { EditOutlined } from "@material-ui/icons";
import EditStatus from "../Edit/EditStatus";
import Pagination from './PaginationUser/Pagination'

const AllUser = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [edit, setEdit] = useState(false);
  // search
  const [filterData, setFilterData] = useState([]);
  const [textInput, setTextInput] = useState("");
  const [editT, setEditT] = useState(false);
  const [dataqq, setDataqq]=useState([]);// data cua moi trang
  const [change, setChange]=useState(false);
  // phan trang 
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 68
  })
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
  })
  
  const handlePageChange=(newPage) => {
    console.log('page', newPage)
    setPagination({...pagination, page: newPage})
    setFilter({...filter, page: newPage})
}

  useEffect(async () => {
    const res = await APIapp.get("users?role=user");
    setData(res.data.data.users);
    console.log("get api data");
    setPagination({...pagination, totalBook: res.data.data.users.length})
    setEditT(!editT);
  }, [edit]);

  useEffect(async () => {
        
    const res = await APIapp.get(`users?page=${filter.page}&limit=${filter.limit}&role=user`)
    console.log("get api data pagination");
    setDataqq(res.data.data.users);
    setChange(!change);
}, [filter,edit])

  useEffect(async()=>{
    const newFilter = data.filter((value) => {
        return value.name.toLowerCase().includes(textInput.toLowerCase());
      });
      if (textInput ==='') {
        setFilterData(dataqq);
      } else {
        setFilterData(newFilter);
      }
  },[textInput,editT,change]);

  
  const togglePopup = () => {
    setOpen(!open);
  };
  const toggleEdit = () => {
    setOpenEdit(!openEdit);
  };

  
  
  // ham lay gia tri tim kiem 
  const handleSearch = (e) => {
    e.preventDefault();
    const searchWord = e.target.value;
    setTextInput(searchWord);
    
  };
  // console.log(data)
  return (
    <div>
      <Navbar />
      <div className="admin">
        <div className="sidebar">
          <Sidebar />
        </div>
        <div className="content">
          <h1>Tất cả người dùng</h1>
          <input
            type="text"
            placeholder="search here"
            onChange={handleSearch}
          />
          <div className="dataTable">
            <table>
              <thead>
                <tr>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>SĐT</th>
                  <th>Trạng thái</th>
                  <th>Loại thẻ</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filterData.map((user, index) => {
                  return (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>{user.status}</td>
                      <td>{user.readingCard.type}</td>
                      <td>
                        <EditOutlined
                          style={{
                            fontSize: "20px",
                            marginRight: "10px",
                            cursor: "pointer",
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            setInfo(user);
                            toggleEdit();
                          }}
                        />
                        <ImInfo
                          style={{ fontSize: "20px", cursor: "pointer" }}
                          onClick={(e) => {
                            //   e.preventDefault();
                            setInfo(user);
                            togglePopup();
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {open && <Info setOpen={togglePopup} data={info} />}
          {openEdit && (
            <EditStatus
              setOpenEdit={toggleEdit}
              data={info}
              setDataEdit={setEdit}
              edit={edit}
            />
          )}
          {textInput ==='' ? <Pagination pagination={pagination} onPageChange={handlePageChange} className="pagination"/> : <></>}
        </div>
      </div>
    </div>
  );
};
export default AllUser;
