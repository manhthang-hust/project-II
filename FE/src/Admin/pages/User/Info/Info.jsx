import React from "react";
import "./Info.scss";
const Info = (props) => {
  // console.log("data click", props.data);
  return (
    <div className="popup">
      <div onClick={props.setOpen} className="overlay"></div>
      <div className="popup-content">
        <div className="form">
          <div className="column1">
            <div className="group">
              <label>Họ Tên</label>
              <input value={props.data.name} disabled />
            </div>
            <div className="group">
              <label>Email</label>
              <input value={props.data.email} disabled />
            </div>
            <div className="group">
              <label>SĐT</label>
              <input value={props.data.phone} disabled />
            </div>
            <div className="group">
              <label>Ngày sinh</label>
              <input value={props.data.birthday.slice(0,10)} disabled />
            </div>
            <div className="group">
              <label>Giới tính</label>
              <input value={props.data.gender} disabled />
            </div>
          </div>
          <div className="column2">
              <div className="image">
                  <img src={`http://127.0.0.1:8000/img/users/${props.data.photo}`}/>
              </div>
            <div className="group">
              <label>Địa chỉ</label>
              <input value={props.data.address} disabled />
            </div>
            <div className="group">
              <label>Loại thẻ</label>
              <input value={props.data.readingCard.type} disabled />
            </div>
            <div className="group">
              <label>Mức cảnh cáo</label>
              <input value={props.data.warningLevel} disabled />
            </div>
          </div>
        </div>
        {/* <div className="btn">
                            <button className="close-modal close" onClick={props.setOpen}>Close</button>
                        </div> */}
      </div>
    </div>
  );
};

export default Info;
