import React from 'react'
import Home from '../Client/pages/homepage/Home.jsx'
import BookDetail from '../Client/pages/bookDetail/BookDetail'
import Payment from '../Client/pages/payment/Payment.jsx'
import Login from '../login/Login.jsx'
import SignUp from '../signUp/SignUp.jsx'
import ForgotPass from '../forgotPass/ForgotPass.jsx'
import ResetPass from '../resetPassword/ResetPass.jsx'
import Search from '../Client/pages/Search/Search'
import Profile from '../Client/pages/Profile/Profile.jsx'
import Category from '../Client/commonComponent/category/Category'
import HomeAdmin from '../Admin/pages/homeAdmin/HomeAdmin.jsx'
import History from '../Client/pages/Profile/History'
import AddBook from '../Admin/pages/Book/addNewBook/AddBook.jsx'
import AllBook from '../Admin/pages/Book/allBook/AllBook.jsx'
import BookStatistic from '../Admin/pages/Book/bookStatistic/BookStatistic.jsx'
import ReadBook from '../Admin/pages/Book/readBook/ReadBook.jsx'
import AllOrders from '../Admin/pages/Orders/allOrders/AllOrders'
import TodayOrder from '../Admin/pages/Orders/todayOrder/TodayOrder'
import AllUser from "../Admin/pages/User/allUser/AllUser";
import UserStatistic from "../Admin/pages/User/UserStatistic/UserStatistic";
import AllCategories from '../Admin/pages/category/allCategory/allCategory.jsx'
import BookofCategory from '../Admin/pages/category/bookofCategory/BookofCategory.jsx'
import Events from '../Admin/pages/event/Event.jsx'
import EventDetail from '../Admin/pages/event/eventDetail/eventDetail.jsx'
import Intro from '../Client/pages/intro/Intro.js'

const routes = [
  {
    path: "/",
    element: <Intro />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgot",
    element: <ForgotPass />,
  },
  {
    path: "/reset-password/:id",
    element: <ResetPass />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/userHome",
    element: <Home />,
  },
  {
    path: "/bookDetail",
    element: <BookDetail />,
  },
  {
    path: "/payment",
    element: <Payment />,
  },
  {
    path: "/search",
    element: <Search />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/categories/:id",
    element: <Category />,
  },
  {
    path: "/book/:id",
    element: <BookDetail />,
  },
  {
    path: "/payment/:id",
    element: <Payment />,
  },
  {
    path: "/history",
    element: <History />,
  },
  {
    path: "/adminHome",
    element: <HomeAdmin />,
  },
  {
    path: "/book/allbook",
    element: <AllBook />,
  },
  {
    path: "/book/newBook",
    element: <AddBook />,
  },
  {
    path: "/book/statistic",
    element: <BookStatistic />,
  },
  {
    path: "/book/allbook/:id",
    element: <ReadBook />,
  },
  {
    path: '/order/allOders',
    element: <AllOrders/>
  },
  {
    path: '/order/onlineToday',
    element: <TodayOrder/>
  },
  {
    path: "/user/allUser",
    element: <AllUser />,
  },
  {
    path: "/user/statistic",
    element: <UserStatistic />,
  },
  {
    path: '/category/allCategory',
    element: <AllCategories/>
  },
  {
      path: '/category/allCategory/:id',
      element: <BookofCategory/>
  },
  {
      path: '/event/allEvents',
      element: <Events/>
  },
  {
      path: '/event/allEvents/:id',
      element: <EventDetail/>
  }
];

export default routes;
