
import { ArrowForward } from "@material-ui/icons";
import * as React from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Navbar from "../../commonComponent/navbar/Navbar";
import "./Profile.scss";
import Update from "./Update";
import { useState, useEffect } from "react";
import APIapp from "../../APIS/APIapp";
import CardUser from "./CardUser";
import { toast, ToastContainer } from "react-toastify";
import RenewCard from "./RenewCard";
// dialog

const Profile = () => {
  // router history
  let navigate = useNavigate();

  const handleHistory = () => {
    console.log("click");
    navigate("/history");
  };

  // dialog edit
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const [openCard, setOpenCard]=useState(false);
  const [openRenew, setOpenRenew]=useState(false);
  const [renewSuccess, setRenewSucess]=useState(false)
  const toggleCard=() =>{
    setOpenCard(!openCard);
  }
  const toggleRenewCard=() =>{
    setOpenRenew(!openRenew)
  }
  const [dataUser, setDataUser] = useState({
    name: "",
    phone: "",
    email: "",
    gender:"",
    birthday: "YYYY-MM-DD",
    address: "",
    readingCard: {},
    photo:""
  });
const handleToast=()=>{
  toast.success("Extend successfully !!", {autoClose: 2000 });
}

// get api user 

useEffect( async () =>{
  const res= await APIapp.get('/users/me')
  setDataUser(res.data.data.user);
  // console.log(res.data.data.user);
},[renewSuccess])

  return (
    <div className="profile">
      <Navbar/>
      <div className="wrapper">
        <div className="pro_container">
          <div className="form">
          {/* <Form.Group className="mb-3">
              <Form.Label className="labelImg" style={{padding:"5px", flex:"3"}}>Ảnh đại diện</Form.Label>
              <div style={{  flex:"7"}}>
              <img src={(`http://127.0.0.1:8000/img/users/${dataUser.photo}`)} style={{height:"50px", maxWidth:"50px", objectFit: "contain"}}  />
              </div>
            </Form.Group> */}
            <Form.Group className="mb-3">
              <Form.Label className="label">Họ tên</Form.Label>
              <Form.Control className="control" value={dataUser.name} disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="label">Số điện thoại</Form.Label>
              <Form.Control className="control" value={dataUser.phone} disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="label">Ngày sinh</Form.Label>
              <Form.Control
                className="control"
                // value={dataUser.birthday.slice(0,10) }
                value={`${dataUser.birthday.slice(0,10).slice(8,10)}/${dataUser.birthday.slice(0,10).slice(5,7)}/${dataUser.birthday.slice(0,10).slice(0,4)}`}
                disabled
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="label">Địa chỉ</Form.Label>
              <Form.Control className="control" value={dataUser.address} disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="label">Giới tính</Form.Label>
              <Form.Control className="control" value={dataUser.gender} disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="label">Cảnh cáo</Form.Label>
              <Form.Control
                className="control"
                value={`Mức ${dataUser.warningLevel}`}
                disabled
                style={{
                  backgroundColor: "rgba(47, 46, 65, 0.4)",
                  color: "white",
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3" style={{position:"relative"}}>
              <Form.Label className="label">Loại thẻ</Form.Label>
              <Button type="button" className="button type" onClick={toggleCard} 
               >
                {dataUser.readingCard.type}
              </Button>
            </Form.Group>
            
            <Form.Group className="mb-3" style={{position:"relative"}}>
              <Form.Label className="label">Lịch sử</Form.Label>
              <Button type="button" className="button" onClick={handleHistory}>
                <ArrowForward />
              </Button>
            </Form.Group>
            <Form.Group className="mb-3" style={{position:"relative"}}>
              <Form.Label className="label">Gia hạn thẻ </Form.Label>
              <Button type="button" className="button" onClick={toggleRenewCard} >
                Gia hạn
              </Button>
            </Form.Group>
          </div>
          <div className="updatecontainer">
            <Button
              type="button"
              className="buttonupdate"
              onClick={handleClickOpen}
            >
              {" "}
              EDIT
            </Button>
            <Update
            open={open}
            setOpen={setOpen}
            data={dataUser}
            setData={setDataUser}
            
            />
            <ToastContainer />
            {openCard && <CardUser clickMethod = {toggleCard} 
              data = {dataUser}/>}
            {openRenew && <RenewCard clickOpenRenew={toggleRenewCard} handleToast={handleToast}
            dataUser={dataUser} setSuccess={setRenewSucess}  success={renewSuccess}/>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
