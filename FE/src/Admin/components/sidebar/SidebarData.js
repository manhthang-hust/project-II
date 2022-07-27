import React from 'react';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import * as ImIcons from 'react-icons/im'
import * as BiIcons from 'react-icons/bi'
import * as BsIcons from 'react-icons/bs'
import * as GrIcons from 'react-icons/gr'

export const SidebarData = [
  {
    title: 'Book',
    path: '/book',
    icon: <ImIcons.ImBook color="var(--black)" />,
    iconClosed: <RiIcons.RiArrowDownSFill color="var(--black)"/>,
    iconOpened: <RiIcons.RiArrowUpSFill color="var(--black)"/>,

    subNav: [
      {
        title: 'All book',
        path: '/book/allbook',
        icon: <BsIcons.BsBookshelf color="var(--black)"/>,
        cName: 'sub-nav'
      },
      {
        title: 'Add new book',
        path: '/book/newBook',
        icon: <GrIcons.GrChapterAdd color="var(--black)"/>,
        cName: 'sub-nav'
      },
      {
        title: 'Statistic',
        path: '/book/statistic',
        icon: <RiIcons.RiNumbersLine color="var(--black)" />
      }
    ]
  },
  {
    title: 'Category',
    path: '/category',
    icon: <BiIcons.BiCategory color="var(--black)"/>,
    iconClosed: <RiIcons.RiArrowDownSFill color="var(--black)"/>,
    iconOpened: <RiIcons.RiArrowUpSFill color="var(--black)"/>,
    subNav: [
      {
        title: 'All category',
        path: '/category/allCategory',
        icon: <IoIcons.IoIosPaper color="var(--black)"/>,
        cName: 'sub-nav'
      },
    ]
  },
  {
    title: 'User',
    path: '/user',
    icon: <IoIcons.IoMdPeople color="var(--black)"/>,
    iconClosed: <RiIcons.RiArrowDownSFill color="var(--black)"/>,
    iconOpened: <RiIcons.RiArrowUpSFill color="var(--black)"/>,
    subNav: [
        {
          title: 'All user',
          path: '/user/allUser',
          icon: <IoIcons.IoIosPaper color="var(--black)"/>,
          cName: 'sub-nav'
        },
        {
          title: 'Statistic',
          path: '/user/statistic',
          icon: <IoIcons.IoIosPaper color="var(--black)"/>,
          cName: 'sub-nav'
        }
      ]
  },
  {
    title: 'Event',
    path: '/event',
    icon: <BsIcons.BsCalendar2EventFill color="var(--black)"/>,
    iconClosed: <RiIcons.RiArrowDownSFill color="var(--black)"/>,
    iconOpened: <RiIcons.RiArrowUpSFill color="var(--black)"/>,
    subNav: [
      {
        title: 'Events',
        path: '/event/allEvents',
        icon: <IoIcons.IoIosPaper color="var(--black)"/>,
        cName: 'sub-nav'
      },
    ]
  },
  {
    title: 'Order',
    path: '/order',
    icon: <BsIcons.BsFillCartFill color="var(--black)"/>,
    iconClosed: <RiIcons.RiArrowDownSFill color="var(--black)"/>,
    iconOpened: <RiIcons.RiArrowUpSFill color="var(--black)"/>,
    subNav: [
        {
          title: 'All orders',
          path: '/order/allOders',
          icon: <IoIcons.IoIosPaper color="var(--black)"/>,
          cName: 'sub-nav'
        },
        {
          title: 'Online orders today',
          path: '/order/onlineToday',
          icon: <IoIcons.IoIosPaper color="var(--black)"/>,
          cName: 'sub-nav'
        }
      ]
  }
];