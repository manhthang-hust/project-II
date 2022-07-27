import { Select } from "@material-ui/core";
import React ,{useState} from "react";
import "./EditStatus.scss";
import { Form } from "react-bootstrap";
import APIapp from "../../../../Client/APIS/APIapp";
const EditStatus = (props) => {
  const statusOptions = ["active","blocked"];
  const [statusClick, setstatusClick] = useState(null);
  const {data, setDataEdit, setOpenEdit,edit}=props; 
// const [dataEdit, setData]=useState({ 

// })

  // patch api
  const handleEdit = () => {
    (async () => {
      try {
        const response = await APIapp.patch(`users/${props.data._id}`, {
          status: statusClick
        });
        // console.log(response);
        // props.setDataEdit({...data, status : response.data.data.user.status});
        setDataEdit(!edit);
      } catch (e) {
        console.log(e);
        setDataEdit(false);
      }
    })();
  };

  return (
    <div className="popup">
      <div onClick={props.setOpenEdit} className="overlay"></div>
      <div className="popup-content">
        <div className="formEdit">
          <h2>Chọn trạng thái</h2>
          <div className="selectStatus">
            <select onChange={(e)=>{
                setstatusClick(e.target.value);
            }} >
                <option>Open this select menu</option>
              {statusOptions.map((status) => (
                  <option value={status}>{status}  </option>
              ))}
              
            </select>
          </div>
          <button onClick={() =>{
              handleEdit();
              props.setOpenEdit();
              
          }} >Update</button>
        </div>
      </div>
    </div>
  );
};

export default EditStatus;
