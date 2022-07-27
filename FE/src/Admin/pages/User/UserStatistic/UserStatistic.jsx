import React from "react";
import Sidebar from "../../../components/sidebar/Sidebar.js";
import Navbar from "../../../components/navbar/Navbar";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import APIapp from "../../../../Client/APIS/APIapp.js";
import './UserStatistic.scss'
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  plugins: {
    title: {
      display: true,
      text: "Biểu đồ thống kê người dùng",
    },
  },
  responsive: true,
  interaction: {
    mode: "index",
    intersect: false,
  },
  scales: {
    x: {
      stacked: true,
    },
    y: {
      beginAtZero: true,
      stacked: true,
    },
  },
};

const UserStatistic = () => {
  const [time, setTime] = useState("");
  const [style, setStyle] = useState("");
  const [dataDisplay, setDataDisplay] = useState({
    labels: [""],
    datasets: [
      {
        label: "",
        data: [],
        backgroundColor: "",
        stack: "",
      },
    ],
  });
  const [dataUser, setDataUser] = useState({
    newUserByCardType: [],
    byWarningLevel: [],
    byStatus: [],
  });

  // khai bao thang, nam, va kieu thong ke
  const [month, setMonth]=useState('');
  const [year, setYear]=useState('');
  const [lables, setLables]=useState([]);

  
// get data theo thoi gian chon
  useEffect(async () => {
    
    const res = await APIapp.get(`users/${time}-user-stats/${year}/${month}`);
    setDataUser(res.data.data.stats);
    console.log(`users/${time}-user-stats/${year}/?${month}`);
    // console.log("time", time, "year", year,"month", month);
    (time=='daily' ? setLables(Array.from({length: new Date(year,month,0).getDate() }, (v, k) =>`D ${k+1}`)) : setLables(listMonth));
  }, [time, setTime,year, setYear, month, setMonth]);

  
  useEffect(() => {
    if (style == "byStatus") setDataDisplay(dataChangeStatus);
    else if (style == "byWarningLevel") setDataDisplay(dataChangeWarning);
    else if (style == "newUserByCardType") setDataDisplay(dataChangeCard);
  }, [style, setStyle]);

  const dataStatus = dataUser.byStatus;

  // let listDay=Array.from({length: new Date(year,month,0).getDate() }, (v, k) =>`D ${k+1}`)
  const listMonth=Array.from({length: 12}, (v, k) => `T ${k+1}`);  

  // set dataDisplay

  // ham de set data
  const handleSetdataStatus = (str) =>
  {
    const x =Array(lables.length).fill(0);
    const y= (time==='daily'?'day':'month');
    const d= dataStatus.map((e) => {
      const find = e.detail.find((a) => a.status === str);
      if (find == undefined) return 0;
      else x[e[y]-1]=find.count;
    });
    return x;
  }
    // set data cho status

  const dataChangeStatus = {
    labels:lables,
    datasets: [
      {
        label: "active",
        data: handleSetdataStatus("active"),
        backgroundColor: "rgb(255, 99, 132)",
        stack: "Stack 0",
      },
      {
        label: "inactive",
        data: handleSetdataStatus("inactive"),
        backgroundColor: "rgb(75, 192, 192)",
        stack: "Stack 0",
      },
      {
        label: "blocked",
        data: handleSetdataStatus("blocked"),
        backgroundColor: "#FFFF00",
        stack: "Stack 0",
      },
    ],
  };

  // set data cho warning
  const handleSetdataWarning = (str) =>
  {
    const x =Array(lables.length).fill(0);
    const y= (time==='daily'?'day':'month');
    const d= dataUser.byWarningLevel.map((e) => {
      const find = e.detail.find((a) => a.level === str);
      if (find == undefined) return 0;
      else x[e[y]-1]=find.count;
    });
    return x;
  }
  const dataChangeWarning = {
    labels:lables,
    datasets: [
      {
        label: "Mức 0",
        data: handleSetdataWarning(0),
        backgroundColor: "rgb(255, 99, 132)",
        stack: "Stack 0",
      },
      {
        label: "Mức 1",
        data: handleSetdataWarning(1),
        backgroundColor: "rgb(75, 192, 192)",
        stack: "Stack 0",
      },
      {
        label: "Mức 2",
        data: handleSetdataWarning(2),
        backgroundColor: "#FFFF00",
        stack: "Stack 0",
      },
    ],
  };

  // set data cho card
  const handleSetdataCard =  (str) =>
  {
    const x =Array(lables.length).fill(0);
    const y= (time==='daily'?'day':'month');
    const d= dataUser.newUserByCardType.map((e) => {
      const find = e.detail.find((a) => a.readingCard === str);
      if (find == undefined) return 0;
      else x[e[y]-1]=find.count;
    });
    return x;
  }

  const dataChangeCard = {
    labels:lables,
    datasets: [
      {
        label: "normal",
        data: handleSetdataCard("normal"),
        backgroundColor: "rgb(255, 99, 132)",
        stack: "Stack 0",
      },
      {
        label: "vip",
        data: handleSetdataCard("vip"),
        backgroundColor: "rgb(75, 192, 192)",
        stack: "Stack 0",
      },
    ],
  };

  // time, style
  // console.log("time", time, "style", style);
  return (
    <div>
      <Navbar />
      <div className="admin">
        <div className="sidebar">
          <Sidebar />
        </div>
        <div className="content">
          <h1>Statistic</h1>
          <div className="AllSelect">
          <select onChange={(e) =>{
            setMonth(e.target.value);
          }}>
            <option>Chọn tháng</option>
            {listMonth.map((m,index)=>(
              <option value={index+1}>Tháng {index+1}</option>
            ) )}
          </select>
          <select onChange={(e)=>{
            const key=e.target.value;
            setYear(key);
          }}>
            <option>Chọn Năm</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
          </select>
          <select
            onChange={(e) => {
              const key=e.target.value;
              if(key==="monthly") setMonth('');
              setTime(e.target.value)
            }}
          >
            <option>Chọn kiểu thống kê</option>
            <option value="daily">Thống kê theo ngày</option>
            <option value="monthly">Thống kê theo tháng</option>
          </select>
          
          <select
            onChange={(e) => {
              setStyle(e.target.value);
            }}
          >
            <option>Thể loại so sánh</option>
            <option value="newUserByCardType">Thẻ</option>
            <option value="byStatus">Trạng thái</option>
            <option value="byWarningLevel">Mức cảnh cáo</option>
          </select>
          </div>
          <Bar options={options} data={dataDisplay} style={{margin:"20px"}} />
        </div>
      </div>
    </div>
  );
};

export default UserStatistic;
