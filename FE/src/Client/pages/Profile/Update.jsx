import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import "./Update.scss";
import axios from "axios";
import APIapp from "../../APIS/APIapp";

const Update = (props) => {
  // khai bao
  const { open, setOpen, data, setData } = props;
  const [name, setName] = useState(data.name);
  const [phone, setPhone] = useState(data.phone);
  const [birthday, setBirthday] = useState(data.birthday);
  const [address, setAddress] = useState(data.address);

  const [user, setUser]=useState({
    name: data.name,
    phone: data.phone,
    birthday: data.birthday,
    address: data.address
  })
  const [file, setFile]= useState(null);

  const handleClose = (e) => {
    e.preventDefault();
    console.log("cancle");
    setOpen(false);
  };

  //update data

  // const handleUpdate = (e) => {
  //   e.preventDefault();
  //   (async () => {

  //     try {
  //       const response = await APIapp.patch("users/updateMe", {
  //         name: name,
  //         phone: phone,
  //         address: address,
  //         birthday: birthday,
  //       });
  //       // set new data
  //       setData(response.data);
  //       setOpen(false);
  //       // alert("deee");
  //     } catch (e) {
  //       console.log(e);
       
  //       alert("vui long nhap du thong tin");
  //     }
  //   })();
  // };

  const handleUpdate= async (e) =>{
    // e.preventDefault();
    const formData= new FormData();
    if(file!=null) formData.append("photo", file);
    formData.append("name", user.name);
    formData.append("phone", user.phone);
    formData.append("address", user.address);
    formData.append("birthday", user.birthday);
    // console.log(Array.from(formData));
    const rep= await APIapp.patch('users/updateMe', formData)
    // console.log(rep);

  }


  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md">
      <DialogTitle>EDIT PROFILE</DialogTitle>
      <DialogContent>
        <form className="update-container">
          <div className="form-update">
          <Form.Group className="mb-3">
              <Form.Label className="label">Image</Form.Label>
              <Form.Control
                className="control"
                name="photo"
                type="file"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="label">NAME</Form.Label>
              <Form.Control
                className="control"
                name="name"
                placeholder={data.name}
                onChange={(e) => {
                  setUser({...user, name: e.target.value});
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="label">PHONE</Form.Label>
              <Form.Control
                className="control"
                name="phone"
                placeholder={data.phone}
                onChange={(e) => {
                  setUser({...user, phone: e.target.value});
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="label">BIRTHDAY</Form.Label>
              <Form.Control
                className="control date"
                type="date"
                onChange={(e) => {
                  setUser({...user, birthday: e.target.value});
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="label">ADDRESS</Form.Label>
              <Form.Control
                className="control"
                placeholder={data.address}
                onChange={(e) => {
                  setUser({...user, address: e.target.value});
                }}
              />
            </Form.Group>
            <div className="buttons">
              <button
                onClick={handleClose}
                style={{
                  fontSize: "large",
                  borderRadius: "10px",
                  float: "right",
                  margin: "-10px 10px",
                  cursor: "pointer",
                  border: "none",
                  padding: "5px"
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="butonC"
                style={{
                  backgroundColor: "#6c63ff",
                  color: "white",
                  fontSize: "large",
                  borderRadius: "10px",
                  float: "right",
                  margin: "-10px 10px",
                  cursor: "pointer",
                  border: "none",
                  padding: "5px"
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Update;
