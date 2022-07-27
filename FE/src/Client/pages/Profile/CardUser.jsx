import React, { useEffect, useState } from "react";
import "./CardUser.scss";
import QRcode from "qrcode";
const CardUser = (props) => {
  const { clickMethod, data ,handleToast} = props;
  
  const [src, setSrc] = useState("");
  useEffect(() => {
    QRcode.toDataURL(data.id).then(setSrc);
  },[]);
  const [card, setCard] = useState({
    name: "Nguyet",
    expiry: "20/12",
    number: "03432222222",
    type: "vip",
  });
  // const regex = /-/gm;
  // const subst = `/`;
 const dayexpire= data.readingCard.expireDate.slice(0,10);
 const day=`${dayexpire.slice(8,10)}/${dayexpire.slice(5,7)}/${dayexpire.slice(0,4)}`
//  console.log(day)
 
  return (
    <div className="modal">
      <div onClick={clickMethod} className="overlay"></div>
      <div className="cardContainer">
        <div className="cardD">
          <img
            src={src}
            style={{ width: "100px", height: "100px", objectFit: "none" }}
            className="qrCode"
          />
          <div className="nameType">{data.readingCard.type}</div>
          <div className="nameuser">{data.name}</div>
          <div className="valid">
            <div className="validXX">Ngày hết hạn</div>
            <div className="expiry">{day}</div>
          </div>
        </div>
        {/* <button onClick={()=>{
            clickMethod();
            handleToast();
        }}
        style={{
                  backgroundColor: "#6c63ff",
                  color: "white",
                  fontSize: "large",
                  borderRadius: "10px",
                  float: "right",
                  margin: "20px 10px",
                  cursor: "pointer",
                  border: "none",
                  padding: "5px"
                }} >Gia hạn thẻ</button> */}
      </div>
    </div>
  );
};

export default CardUser;
