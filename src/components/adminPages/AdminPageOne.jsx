import React, { useEffect, useState } from 'react'
import Layout from '../Layout/Layout'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-hot-toast';
import logo from '../../assets/img/logo.png';
import { toast } from 'react-toastify';
import Imgupload from '../Imgupload';
import PondDetailsModel from './PondDetailsModel';
import URL from '../../URL';
import PondDetails from './PondDetails';

const AdminPageOne = () => {
    const [userList, setUserList] = useState([]);
    const [userCount, setUserCount] = useState();
    const [isDeleted, setIsDeleted] = useState(false);
    const [pondCounts, setPondCounts] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    // const [currentUsers, setCurrentUsers] = useState([]);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const [openSideNav, setOpenSideNav] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState()
  const [userName,setUserName] = useState()
  const [userEmail,setUserEmail] = useState()
  const [openUserPondsModel, setOpenUserPondsModel] = useState(false)
  const [userPonds, setUserPonds] = useState()

  const BASEURL = URL();


  useEffect(()=>{
    console.log(BASEURL);
  },[])

    // VIewUser Data
    const viewUser = async () => {
        const authString = localStorage.getItem('auth');
        const auth = JSON.parse(authString);
        try {
            const res = await axios.get(`${BASEURL}/viewuser/ `);
            setUserList(res.data);
            setUserCount(res.data.length);
            const totalPondCount = res.data.reduce((acc, user) => acc + user.pond_count, 0);
            setPondCounts(totalPondCount);

        } catch (error) {
            console.log(error);
        }
    };

    //  Delete User
    const handleDelete = async () => {
        setIsDeleted(false);

        try {
            const res = await axios.delete(`${BASEURL}/deleteuser/${selectedUser}/`);
            if (res.data && res.data.message) {
                toast.success(res.data.message);
            }
            setShowModal(false);
            viewUser();
        } catch (error) {
            console.log(error);
        }
    }


    const openModal = (user) => {
        setSelectedUser(user);
        setShowModal(true);
      };
    
    const addPond = (id) => {
        navigate(`/admin-add-pond/${id}`);
    };
    // Filter users based on search query
    // const filteredUsers = userList.filter((user) =>
    // user.name.toLowerCase().includes(search.toLowerCase())
    // );

    // useEffect(() => {
    //     setCurrentUsers(userList.slice(indexOfFirstUser, indexOfLastUser));
    // }, [userList, currentPage]);

    useEffect(() => {
        viewUser();
    }, []);
    useEffect(() => {
        const authString = localStorage.getItem('auth');
        const auth = JSON.parse(authString);
        setUserName(auth.name);
        setUserEmail(auth.email);
        setUserId(auth.Mob)
    }, []);


    // Filter users based on search query
    const filteredUsers = userList.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase())
    );

    // Logic for displaying current users based on search results
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    // Change page
    const paginate = (pageNumber) => {
        if (pageNumber !== currentPage) {
            setCurrentPage(pageNumber);
        }
    };

    // Handle search query change
    const handleSearchChange = (event) => {
        setSearch(event.target.value);
        setCurrentPage(1); // Reset pagination when search query changes
    };
    // Logout User
    const handleLogOut = () => {
        localStorage.removeItem('auth');
        navigate('/');
    };
    // mobileview navebar
    const handleOpenSideNav = () => {
        setOpenSideNav(!openSideNav)
    };
    // toggle Setting && view user ponds
    const viewUserPonds = async(user) => {
        setOpenUserPondsModel(!openUserPondsModel)
        setUserPonds(user)
        // console.log(user);
    }

    return (
        <Layout title={"Admin Dashboard"}>
            <div className='flex'>
                <aside style={{ backgroundColor: 'rgba(65, 148, 94, 1)' }} className="hidden  md:flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700">
                    <div className='flex flex-col justify-center mb-0 items-center'>
                        <img src={logo} alt="logo" className='w-1/4' />
                        <p className='text-md font-semibold leading-tight tracking-tight text-white md:text-md dark:text-gray-500 text-center' style={{ paddingTop: "0px" }}>Aquabotics Account</p>
                    </div>

                    <div className="flex flex-col items-center mt-6 -mx-2">
                        <Imgupload id={userId}/>
                        <h4 className="mx-2 mt-2 font-medium text-white dark:text-gray-200">{userName}</h4>
                        <p className="mx-2 mt-1 text-sm font-medium text-white dark:text-gray-400 text-white">{userEmail}</p>
                    </div>

                    <div className="flex flex-col justify-between flex-1 mt-6 text-white">
                        <nav>
                            <a className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg dark:bg-gray-800 dark:text-gray-200" href="#">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>

                                <span className="mx-4 font-medium">Dashboard</span>
                            </a>

                            <a className="flex items-center px-4 py-2 mt-5 text-white transition-colors duration-300 transform rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700" href="#">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>

                                <span className="mx-4 font-medium">Accounts</span>
                            </a>


                            <a className="flex items-center px-4 py-2 mt-5 text-white transition-colors duration-300 transform rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700" href="#">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.3246 4.31731C10.751 2.5609 13.249 2.5609 13.6754 4.31731C13.9508 5.45193 15.2507 5.99038 16.2478 5.38285C17.7913 4.44239 19.5576 6.2087 18.6172 7.75218C18.0096 8.74925 18.5481 10.0492 19.6827 10.3246C21.4391 10.751 21.4391 13.249 19.6827 13.6754C18.5481 13.9508 18.0096 15.2507 18.6172 16.2478C19.5576 17.7913 17.7913 19.5576 16.2478 18.6172C15.2507 18.0096 13.9508 18.5481 13.6754 19.6827C13.249 21.4391 10.751 21.4391 10.3246 19.6827C10.0492 18.5481 8.74926 18.0096 7.75219 18.6172C6.2087 19.5576 4.44239 17.7913 5.38285 16.2478C5.99038 15.2507 5.45193 13.9508 4.31731 13.6754C2.5609 13.249 2.5609 10.751 4.31731 10.3246C5.45193 10.0492 5.99037 8.74926 5.38285 7.75218C4.44239 6.2087 6.2087 4.44239 7.75219 5.38285C8.74926 5.99037 10.0492 5.45193 10.3246 4.31731Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>

                                <span className="mx-4 font-medium">Settings</span>
                            </a>
                            <a className="flex items-center px-4 py-2 mt-5 text-white transition-colors duration-300 transform rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700" href="#" onClick={handleLogOut}>
                                <i className="fa-solid fa-arrow-right-from-bracket"></i>

                                <span className="mx-4 font-medium">Logout</span>
                            </a>
                        </nav>
                    </div>
                </aside>
                <aside className='absolute p-2 ml-3 md:hidden'>
                    <div className='w-max text-2xl bg-green-600 p-2 px-4 rounded-md text-white dark:bg-green-500 dark:text-gray-200 cursor-pointer hover:bg-green-700 shadow-lg shadow-green-500' onClick={handleOpenSideNav}>
                        <i className="fa-solid fa-bars-staggered animate-bounce"></i>
                    </div>
                    {
                        openSideNav ? <div className='flex flex-col justify-between mt-2 bg-green-600 p-2 rounded-md dark:bg-green-600 transition-all'>
                            <nav>
                                <a className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg dark:bg-gray-800 dark:text-gray-200" href="">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>

                                    <span className="mx-4 font-medium">Dashboard</span>
                                </a>

                                <a className="flex items-center px-4 py-2 mt-5 text-white transition-colors duration-300 transform rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700" href="#">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>

                                    <span className="mx-4 font-medium">Accounts</span>
                                </a>

                                <a className="flex items-center px-4 py-2 mt-5 text-white transition-colors duration-300 transform rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700" href="#">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10.3246 4.31731C10.751 2.5609 13.249 2.5609 13.6754 4.31731C13.9508 5.45193 15.2507 5.99038 16.2478 5.38285C17.7913 4.44239 19.5576 6.2087 18.6172 7.75218C18.0096 8.74925 18.5481 10.0492 19.6827 10.3246C21.4391 10.751 21.4391 13.249 19.6827 13.6754C18.5481 13.9508 18.0096 15.2507 18.6172 16.2478C19.5576 17.7913 17.7913 19.5576 16.2478 18.6172C15.2507 18.0096 13.9508 18.5481 13.6754 19.6827C13.249 21.4391 10.751 21.4391 10.3246 19.6827C10.0492 18.5481 8.74926 18.0096 7.75219 18.6172C6.2087 19.5576 4.44239 17.7913 5.38285 16.2478C5.99038 15.2507 5.45193 13.9508 4.31731 13.6754C2.5609 13.249 2.5609 10.751 4.31731 10.3246C5.45193 10.0492 5.99037 8.74926 5.38285 7.75218C4.44239 6.2087 6.2087 4.44239 7.75219 5.38285C8.74926 5.99037 10.0492 5.45193 10.3246 4.31731Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>

                                    <span className="mx-4 font-medium">Settings</span>
                                </a>
                                <a className="flex items-center px-4 py-2 mt-5 text-white transition-colors duration-300 transform rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700" href="#" onClick={handleLogOut}>
                                    <i className="fa-solid fa-arrow-right-from-bracket"></i>

                                    <span className="mx-4 font-medium">Logout</span>
                                </a>
                            </nav>
                        </div> : null
                    }

                </aside>
                {/* list table */}
                <section className='container px-2 mx-auto w-full mt-[5%]'>
                    <div className='w-full md:flex justify-between mb-7 flex-col md:flex-row'>
                        <div className="w-full md:max-w-xs overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 mb-3" style={{ backgroundColor: 'rgb(238, 255, 239)' }}>
                            <div className="py-5 text-center">
                                <p className="block text-5xl font-bold text-gray-800 dark:text-white" tabIndex="0" >{userCount ? userCount : 0}</p>
                                <span className="text-sm text-gray-700 dark:text-gray-200">Number of registered Account</span>
                            </div>
                        </div>
                        <div className="w-full md:max-w-xs overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 mb-3" style={{ backgroundColor: 'rgb(238, 255, 239)' }}>
                            <div className="py-5 text-center">
                                <p className="block text-5xl font-bold text-gray-800 dark:text-white" tabIndex="0" >{pondCounts ? pondCounts : 0}</p>
                                <span className="text-sm text-gray-700 dark:text-gray-200">Total Number of Ponds Created</span>
                            </div>
                        </div>
                        <div className="w-full md:max-w-xs overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 mb-3" style={{ backgroundColor: 'rgb(238, 255, 239)' }}>
                            <div className="py-5 text-center">
                                <a href="#" className="block text-xl font-bold text-gray-800 dark:text-white" tabIndex="0" role="link">{userName}</a>
                                <span className="text-sm text-gray-700 dark:text-gray-200">Admin</span>
                            </div>
                        </div>
                    </div>
                    <div className='flex sm:items-center justify-between flex-col md:flex-row'>
                        <h2 className="text-lg font-medium text-gray-800 dark:text-white">Aquabotics Account Lists</h2>
                        <div className="relative flex items-center mt-4 md:mt-0 mb-2">
                            <span className="absolute">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mx-3 text-gray-400 dark:text-gray-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                            </span>

                            <input type="text" placeholder="Search User" className="block w-full py-1.5 pr-5 text-gray-700 bg-white border border-gray-200 rounded-lg md:w-80 placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" value={search}
                                onChange={handleSearchChange} />
                        </div>
                    </div>

                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-4 w-full">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400" >
                            <thead className="text-xs text-white uppercase dark:bg-gray-700 dark:text-gray-400" style={{ backgroundColor: 'rgba(65, 148, 94, 1)' }}>
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        User name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Mobile number
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Email Id
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Password
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody style={{ backgroundColor: 'rgb(238, 255, 239)' }}>
                                {

                                    userList && userList.length > 0 ? (currentUsers?.map((user, index) => {

                                        return (<tr className="border-b dark:bg-gray-800 dark:border-gray-700" key={index}>
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {user.name}
                                                {user.pond_count ? <span className="bg-red-600 text-red-100 px-2 py-1 ml-2 rounded text-xs font-bold ">{user.pond_count}</span> : null}
                                            </th>
                                            <td className="px-6 py-4">
                                                {user.Mob}
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.password}
                                            </td>
                                            <td className="px-4 py-4 text-sm whitespace-nowrap">
                                                <div className="flex items-center gap-x-6">
                                                    <button className="text-gray-500 transition-colors duration-200 dark:hover:text-red-500 dark:text-gray-300 hover:text-red-500 focus:outline-none" onClick={() => openModal(user.Mob)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                        </svg>
                                                    </button>

                                                    <button className="text-gray-500 transition-colors duration-200 dark:hover:text-yellow-500 dark:text-gray-300 hover:text-yellow-500 focus:outline-none" onClick={() => addPond(user.Mob)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                        </svg>
                                                    </button>
                                                    <button className="text-gray-500 transition-colors duration-200 dark:hover:text-blue-500 dark:text-gray-300 hover:text-blue-500 focus:outline-none" onClick={()=> viewUserPonds(user.Mob)}>
                                                        <i className="fa-regular fa-eye"></i>
                                                    </button>
                                                </div>
                                            </td>
                                            {
                                                showModal ? <div className="relative flex justify-center">


                                                    <div
                                                        className="fixed inset-0 z-10 overflow-y-auto"
                                                        aria-labelledby="modal-title" role="dialog" aria-modal="true">
                                                        <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                                                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                                                            <div className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl rtl:text-right dark:bg-gray-900 sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                                                                <div>
                                                                    <div className="flex items-center justify-center">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                                                        </svg>
                                                                    </div>

                                                                    <div className="mt-2 text-center">
                                                                        <h3 className="text-lg font-medium leading-6 text-gray-800 capitalize dark:text-white" id="modal-title">Delete this User  {user.name}</h3>
                                                                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                                            By click delete this data will be permanent deleted. Are you sure you want to delete this data?
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                <div className="mt-5 sm:flex sm:items-center sm:justify-between md:justify-around">

                                                                    <div className="sm:flex sm:items-center ">
                                                                        <button onClick={() => setShowModal(false)} className="w-full px-4 py-2 mt-2 text-sm font-medium tracking-wide text-gray-700 capitalize transition-colors duration-300 transform border border-gray-200 rounded-md sm:mt-0 sm:w-auto sm:mx-2 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40">
                                                                            Cancel
                                                                        </button>

                                                                        <button className="w-full px-4 py-2 mt-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md sm:w-auto sm:mt-0 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40" onClick={() => handleDelete(user.Mob)}>
                                                                            Delete
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                    : null
                                            }
                                        </tr>

                                        )
                                    })) : <tr>
                                        <td colSpan="5" className='text-center'>No users found</td>
                                    </tr>
                                }

                            </tbody>
                        </table>
                    </div>
                    <div className="flex items-center justify-center mt-6">
                        <div className="flex items-center justify-center">
                            <a href="#" className="flex items-center px-4 py-2 mx-1 text-gray-500 bg-white rounded-md cursor dark:bg-gray-800 dark:text-gray-600 hover:bg-green-700 dark:hover:bg-green-600 hover:text-white dark:hover:text-gray-200"
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                style={{ pointerEvents: currentPage === 1 ? 'none' : 'auto', opacity: currentPage === 1 ? 0.5 : 1 }}
                            >
                                previous
                            </a>


                            {userList.length > 0 &&
                                Array.from({ length: Math.ceil(userList.length / usersPerPage) }, (_, i) => (
                                    <a
                                        key={i}
                                        onClick={() => paginate(i + 1)}
                                        className={`px-2 py-1 text-sm rounded-full h-[30px] w-[30px] text-center ${currentPage === i + 1
                                            ? 'text-white bg-green-700 dark:bg-gray-800 dark:text-gray-300'
                                            : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-300'
                                            }`}
                                    >
                                        {i + 1}
                                    </a>
                                ))}

                            <a href="#" className="flex items-center px-4 py-2 mx-1 text-gray-700 transition-colors duration-300 transform bg-white rounded-md dark:bg-gray-800 dark:text-gray-200 hover:bg-green-700 dark:hover:bg-green-600 hover:text-white dark:hover:text-gray-200"
                                onClick={() => paginate(currentPage + 1)}
                                style={{ pointerEvents: currentPage === Math.ceil(userList.length / usersPerPage) ? 'none' : 'auto', opacity: currentPage === Math.ceil(userList.length / usersPerPage) ? 0.5 : 1 }}>
                                Next
                            </a>
                        </div>
                    </div>
                </section>
            </div>
            {/* view ponds Models */}
            <div className="flex w-[80]">

            </div>
            {/* view ponds Models */}
            {
                openUserPondsModel ? <PondDetailsModel onClose={viewUserPonds} setOpenModel={setOpenUserPondsModel} user={userPonds}/> : null
            }
            



        </Layout>
    )
}

export default AdminPageOne