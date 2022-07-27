import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Sidebar from "../../components/sidebar/Sidebar.js";
import Navbar from "../../components/navbar/Navbar";
import APIapp from "../../../Client/APIS/APIapp";
import "./HomeAdmin.scss";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  AttachMoneyOutlined,
  LocalShippingOutlined,
  PersonAddOutlined,
} from "@material-ui/icons";
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
      text: "Biểu đồ thống kê doanh thu",
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

const HomeAdmin = () => {
  const dayCurrent = new Date();
  const [revenueD, setRevenueD] = useState([
    {
        sumRevenue:0,
        day:1
     
    },
  ]);
  const [revenueM, setRevenueM]=useState([
      {
        numRevenue: 0,
        month: 1,
      }
  ])
  const [dataCard, setDataCard] = useState([
    {
      day: 1,
      detail: [
        {
          readingCard: "",
          count: 0,
        },
      ],
    },
  ]);
  const [allOrder, setAllOrder] = useState(0);
  const [labelDay, setLabelDay] = useState([]);
  const [lableMonth, setLableMonth]=useState([]);
  const [time, setTime]=useState('daily');
  const [month, setMonth]=useState(dayCurrent.getMonth() + 1);
  const listMonth=Array.from({length: 12}, (v, k) => `T ${k+1}`);  
  const [click, setClick]=useState(false);

  // get api doanh thu trong thang moi nhat
  useEffect(async () => {
    const res = await APIapp.get(
      `users/daily-revenue-stats/2022/${month}`
    );
    setRevenueD(res.data.data.stats);
    // console.log(res.data.data.stats);
    setLabelDay(
      Array.from(
        { length: new Date(2022, month, 0).getDate() },
        (v, k) => `D ${k + 1}`
      )
    ) 
  }, []);

  // get api doanh thu cu ca nam 
  useEffect(async () => {
    const res = await APIapp.get(
      `users/monthly-revenue-stats/2022`
    );
    setRevenueM(res.data.data.stats);
    // console.log(res.data.data.stats);
    setLableMonth(listMonth) 
  }, []);
  // get api card type
  useEffect(async () => {
    const res = await APIapp.get(
      `users/daily-user-stats/2022/${month}`
    );
    setDataCard(res.data.data.stats.newUserByCardType);
  }, []);

  // get tong order

  useEffect(async () => {
    const res = await APIapp.get("orders/today-orders");
    setAllOrder(res.data.result);
  }, []);

  // dua ra doanh thu trong ngay
  const revenueDisplay = revenueD.find((e) => e.day === dayCurrent.getDate());

  // dua ra so nguoi vip va normal trong ngay , test day=17, gan == dayCurrent.getDate()
  const numberCard = (str) => {
    const crr = dataCard.find((e) => e.day == dayCurrent.getDate());
    if (crr == undefined) return undefined;
    else return crr.detail.find((e) => e.readingCard == str);
  };
  const cardVip = numberCard("vip");
  const cardNormal = numberCard("normal");

  // bieu do
//   const [dataDisplay, setDataDisplay] = useState({
//     labels: [""],
//     datasets: [
//       {
//         label: "",
//         data: [],
//         backgroundColor: "",
//         stack: "",
//       },
//     ],
//   });
  // set dada cho bieu do
  // theo ngay trong thang moi nhat 
  const handleSetdataDay= ()=>{
      const x=Array(labelDay.length).fill(0);
      const d= revenueD.map((e)=>{
          x[e['day']-1] = e.sumRevenue ;
      })
    //   console.log("day",x)
      return x;
  }
  const handleSetdataYear= ()=>{
    const x=Array(labelDay.length).fill(0);
    const d= revenueM.map((e)=>{
        x[e['month']-1] = e.numRevenue ;
    })
    // console.log("year",x)
    return x;
}
  const dataRevenue ={
      labels: labelDay,
      datasets:[
          {
              label:"",
              data:handleSetdataDay(),
              backgroundColor:"#5089BC",
              stack:"Stack 0",
          }
      ]
  }
  const dataRevenueYear ={
    labels: lableMonth,
    datasets:[
        {
            label:"",
            data:handleSetdataYear(),
            backgroundColor:"#5089BC",
            stack:"Stack 0",
        }
    ]
}

  return (
    <div className="homepage">
      <Navbar />
      <div className="admin">
       <div className="sidebar">
          <Sidebar/>
        </div>
        <div className="contentHome">
          <div className="sumOrder">
            <h2>Thống kê theo ngày</h2>
            <div className="allBox">
              <div className="numberOrder">
                <div className="titleO">
                  <p>Số đơn theo ngày</p>
                  <p>{allOrder}</p>
                </div>
                <div className="iconO">
                  <LocalShippingOutlined />
                </div>
              </div>
              <div className="numberOrder">
                <div className="titleO">
                  <p>Đăng ký mới</p>
                  <p>Vip: {cardVip == undefined ? 0 : cardVip.count} </p>
                  <p>
                    Normal: {cardNormal == undefined ? 0 : cardNormal.count}
                  </p>
                </div>
                <div className="iconO">
                  <PersonAddOutlined />
                </div>
              </div>
              <div className="numberOrder">
                <div className="titleO">
                  <p>Doanh thu trong ngày</p>
                  <p>
                    {revenueDisplay == undefined
                      ? 0
                      : revenueDisplay.sumRevenue}
                    VNĐ
                  </p>
                </div>
                <div className="iconO">
                  <AttachMoneyOutlined />
                </div>
              </div>
            </div>
          </div>
          <div className="statisticAll">
            <h2>Biểu đồ doanh thu</h2>
            <select onChange={(e) => {
                const key=e.target.value;
                setTime(key);
                setClick(true);
            }}>
                <option value="daily">Thống kê theo ngày</option>
                <option value="monthly">Thống kê theo tháng</option>
            </select>
            <div className="statics">
              <Bar
                options={options}
                data= { time=='daily' ? dataRevenue : dataRevenueYear } 
                style={{ margin: "20px" }}
              />
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeAdmin;
