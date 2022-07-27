import React, {useState, useEffect} from 'react'
import APIapp from '../../APIS/APIapp';
import './RenewCard.scss'
const RenewCard = (props) => {
    const {clickOpenRenew, handleToast, dataUser, setSuccess,success}= props;
    const [allEvents, setAllEvents]= useState([{
        minAge:'',
        maxAge:'',
        discount:0,
        startDate:'',
        endDate:'',
        gender:'male'
    }])
    const dayNow= new Date();
    const [userCard, setUserCard]=useState({
        type:dataUser.readingCard.type,
        price:dataUser.readingCard.price,
        gender: dataUser.gender,
        birthday: dataUser.birthday
    })
    const [type, setType]=useState("month");
    const [priceC, setPriceC]=useState(dataUser.readingCard.price);

    // path gia han the
    const handleRenew= async (e) =>{
        const req= await APIapp.patch('users/renewalReadingCard',{
            paymentType: type
        })
        // console.log(req);
        setSuccess(!success);
        clickOpenRenew();
        handleToast();
    }

    // get event 
    useEffect( async () =>{
        const req= await APIapp.get('events');
        setAllEvents(req.data.data.events)
        // console.log(req.data.data.events)
    },[])
    
    useEffect( ()=>{
        (type=='year' ? setPriceC(userCard.price*10) : setPriceC(userCard.price) )
    },[type])
    // set gia

    // xu ly
    const handleEvent=()=>{
        const x= allEvents.find((e)=>{
            const start= new Date(e.startDate.slice(0,10));
            const end = new Date(e.endDate.slice(0,10));
            return (dayNow.getTime()>= start.getTime() && dayNow.getTime()<= end.getTime())
        })
        
        if(x==undefined) return 0;
        else {
            if(x.gender==userCard.gender  || x.gender=='all') {
                const x1= new Date(x.minAge.slice(0,10)).getTime()
                const x2= new Date(x.maxAge.slice(0,10)).getTime()
                const x0= new Date(userCard.birthday.slice(0,10)).getTime()
                
                if(x0 >=x1 && x0 <=x2 ) { 
                    return x.discount}
                else return 0
            }
            else return 0
        }
    }

   console.log( "discount",handleEvent());
    return (
        <div className='modal'>
            <div onClick={clickOpenRenew} className="overlay"></div>
            <div className='cardRenew'>
                <div className='cardC'>
                    <h1>Gia hạn thẻ đọc </h1>
                    <div className='selectCard'>
                        <select style={{height:"40px"}} onChange={(e)=>{
                            setType(e.target.value)
                        }} >
                            <option value="month">Tháng</option>
                            <option value="year">Năm</option>
                        </select>
                        <div className='pricecard'>
                         <p>Giá:</p> 
                         <span>{ handleEvent() == 0 ? <span>{priceC}</span> : 
                         <p style={{display:"flex"}}>
                             <span style={{textDecoration: "line-through",color: "#929292", fontSize: "13px",marginTop: "8px"}}>
                                {priceC}</span>
                            <p>{priceC*(1-handleEvent())} </p>
                        </p> }
                        </span>
                        <span>VND</span>
                        </div>
                    </div>
                    <div className='buttonS'>
                        <button onClick={handleRenew} style={{background:"#6c63ff", color:"white"}}>Xác nhận</button>
                        <button onClick={clickOpenRenew}>Hủy</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RenewCard
