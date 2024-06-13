import React, { useEffect, useState } from 'react'
import Layout from '../Layout/Layout'
import Aqua from '../../assets/img/aqua.webp'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import logo from '../../assets/img/logo.png';
import Imgupload from '../Imgupload'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { t } from 'i18next'
import URL from '../../URL'
import { Sidebar } from '../Sidebar'
import { ResponsNav } from '../ResponsNav'

const UserPageOne = () => {
    const navigate = useNavigate()
    const [ponds, setPonds] = useState();
    const [openSettings, setOpenSettings] = useState(false)
    const [user, setUser] = useState()
    const [userEmail, setUserEmail] = useState()
    const [openSideNav,setOpenSideNav] = useState(false)
    const [userId, setUserId] = useState()
    const [hoveredPondId, setHoveredPondId] = useState(null);
    const {t} = useTranslation()
    const BASEURL = URL();




    const showUserPonds = async () => {
        const authString = localStorage.getItem('auth')
        // Parse the JSON string into an object
        const auth = JSON.parse(authString);

        // Access the "Mob" property from the auth object
        const id = auth.Mob;
        
        setUser(auth.name);
        setUserEmail(auth.email);
        setUserId(auth.Mob)
        try {
            const res = await axios.get(`${BASEURL}/userponds/${id}/`);
            if(res.data.ponds.length > 0) {
                setPonds(res.data.ponds);
            }else{
                console.log("User has no ponds");
                toast.error("User has no ponds");
            }
            

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        showUserPonds();
    }, [])


    const pondDetails = (id) => {
        navigate(`/user-pond-details/${id}`)
    }

    // Logout User
    const handleLogOut = () => {
        localStorage.removeItem('auth');
        navigate('/');
    };
    // Passwords Change
    const handlePassword = () => {
        const user = localStorage.getItem('auth');
        const auth = JSON.parse(user);
        const id = auth.Mob;
        navigate('/change-password/' + id);
    };

    // toggle Setting
    const handleSettingOpen = () => {
        setOpenSettings(!openSettings);
    };

 // mobileview navebar
 const handleOpenSideNav = () => {
    setOpenSideNav(!openSideNav)
};


    return (
        <Layout title={"User Dashboard"}>
            <div className='flex'>
                {/* <aside style={{ backgroundColor: 'rgba(65, 148, 94, 1)' }} className=" hidden md:flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700">
                    <div className='flex flex-col justify-center mb-0 items-center'>
                        <img src={logo} alt="logo" className='w-1/4'/>
                         <p className='text-md font-semibold leading-tight tracking-tight text-white md:text-md dark:text-gray-500 text-center' style={{paddingTop: "0px"}}>{t('AquaboticsAccount')}</p>
                    </div>

                    <div className="flex flex-col items-center mt-6 -mx-2">
                        <Imgupload id={userId}/>
                        <h4 className="mx-2 mt-2 font-medium text-white dark:text-gray-200">{user}</h4>
                        <p className="mx-2 mt-1 text-sm font-medium text-white dark:text-gray-400 text-white">{userEmail}</p>
                    </div>

                    <div className="flex flex-col justify-between flex-1 mt-6 text-white">
                        <nav>
                            <div className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg dark:bg-gray-800 dark:text-gray-200 cursor-pointer">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>

                                <span className="mx-4 font-medium">{t('dashboard')}</span>
                            </div>
                            <div className="flex items-center px-4 py-2 mt-5 text-white transition-colors duration-300 transform rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700 cursor-pointer" onClick={handleSettingOpen}>
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.3246 4.31731C10.751 2.5609 13.249 2.5609 13.6754 4.31731C13.9508 5.45193 15.2507 5.99038 16.2478 5.38285C17.7913 4.44239 19.5576 6.2087 18.6172 7.75218C18.0096 8.74925 18.5481 10.0492 19.6827 10.3246C21.4391 10.751 21.4391 13.249 19.6827 13.6754C18.5481 13.9508 18.0096 15.2507 18.6172 16.2478C19.5576 17.7913 17.7913 19.5576 16.2478 18.6172C15.2507 18.0096 13.9508 18.5481 13.6754 19.6827C13.249 21.4391 10.751 21.4391 10.3246 19.6827C10.0492 18.5481 8.74926 18.0096 7.75219 18.6172C6.2087 19.5576 4.44239 17.7913 5.38285 16.2478C5.99038 15.2507 5.45193 13.9508 4.31731 13.6754C2.5609 13.249 2.5609 10.751 4.31731 10.3246C5.45193 10.0492 5.99037 8.74926 5.38285 7.75218C4.44239 6.2087 6.2087 4.44239 7.75219 5.38285C8.74926 5.99037 10.0492 5.45193 10.3246 4.31731Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>

                                <span className="mx-4 font-medium">{t('settings')}</span>
                            </div>
                            {
                                openSettings ? <div className="flex items-center px-4 py-2 mt-5 text-white transition-colors duration-300 transform rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700 cursor-pointer" onClick={handlePassword}>
                                    <i className="fa-solid fa-key"></i>

                                    <span className="mx-4 font-medium">{t('changepassword')}</span>
                                </div> : null
                            }
                            <a className="flex items-center px-4 py-2 mt-5 text-white transition-colors duration-300 transform rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700" href="#" onClick={handleLogOut}>
                                <i className="fa-solid fa-arrow-right-from-bracket"></i>

                                <span className="mx-4 font-medium">{t('logout')}</span>
                            </a>
                        </nav>
                    </div>
                </aside> */}
                <Sidebar handleSettingOpen ={handleSettingOpen }  handleLogOut={handleLogOut} userId={userId} user={user} userEmail={userEmail} openSettings={openSettings} handlePassword={handlePassword}/>
                <ResponsNav />
                <aside className='absolute p-2 ml-3 md:hidden'>
                    <div className='w-max text-2xl bg-green-600 p-2 px-4 rounded-md text-white dark:bg-green-500 dark:text-gray-200 cursor-pointer hover:bg-green-700 shadow-lg shadow-green-500' onClick={handleOpenSideNav}>
                        <i className="fa-solid fa-bars-staggered animate-bounce"></i>
                    </div>
                    {
                        openSideNav ? <div className="flex flex-col justify-between mt-2 bg-green-600 p-2 rounded-md dark:bg-green-600 transition-all">
                        <nav>
                            <a className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg dark:bg-gray-800 dark:text-gray-200" href="#">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>

                                <span className="mx-4 font-medium">{t('dashboard')}</span>
                            </a>
                            <a className="flex items-center px-4 py-2 mt-5 text-white transition-colors duration-300 transform rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700" href="#" onClick={handleSettingOpen}>
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.3246 4.31731C10.751 2.5609 13.249 2.5609 13.6754 4.31731C13.9508 5.45193 15.2507 5.99038 16.2478 5.38285C17.7913 4.44239 19.5576 6.2087 18.6172 7.75218C18.0096 8.74925 18.5481 10.0492 19.6827 10.3246C21.4391 10.751 21.4391 13.249 19.6827 13.6754C18.5481 13.9508 18.0096 15.2507 18.6172 16.2478C19.5576 17.7913 17.7913 19.5576 16.2478 18.6172C15.2507 18.0096 13.9508 18.5481 13.6754 19.6827C13.249 21.4391 10.751 21.4391 10.3246 19.6827C10.0492 18.5481 8.74926 18.0096 7.75219 18.6172C6.2087 19.5576 4.44239 17.7913 5.38285 16.2478C5.99038 15.2507 5.45193 13.9508 4.31731 13.6754C2.5609 13.249 2.5609 10.751 4.31731 10.3246C5.45193 10.0492 5.99037 8.74926 5.38285 7.75218C4.44239 6.2087 6.2087 4.44239 7.75219 5.38285C8.74926 5.99037 10.0492 5.45193 10.3246 4.31731Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>

                                <span className="mx-4 font-medium">{t('settings')}</span>
                            </a>
                            {
                                openSettings ? <div className="flex items-center px-4 py-2 mt-5 text-white transition-colors duration-300 transform rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700 " onClick={handlePassword}>
                                    <i className="fa-solid fa-key"></i>

                                    <span className="mx-4 font-medium">{t('changepassword')}</span>
                                </div> : null
                            }
                            <a className="flex items-center px-4 py-2 mt-5 text-white transition-colors duration-300 transform rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700" href="#" onClick={handleLogOut}>
                                <i className="fa-solid fa-arrow-right-from-bracket"></i>

                                <span className="mx-4 font-medium">{t('logout')}</span>
                            </a>
                        </nav>
                    </div>: null
                    }
                </aside>

                <section className="bg-white dark:bg-gray-900 w-full mt-4 md:mt-0">
                    <div className="container px-6 py-12 mx-auto">
                        <h1 className="text-2xl font-semibold text-gray-700 lg:text-3xl dark:text-white">{t('mypondlist')}</h1>

                        <div className="mt-8 lg:mt-12 flex flex-wrap gap-4">
                            {
                                ponds && ponds.length > 0 ? (ponds.map((pond) => {
                                    return (
                                        // <div className="p-8 bg-gray-100 rounded-lg dark:bg-gray-800" style={{ backgroundColor: 'rgb(238, 255, 239)' }} key={pond.id}>
                                        <div className="p-8 bg-gray-100 rounded-lg dark:bg-gray-800 w-[45%]" style={{
                                            backgroundColor: '#f2f2f2',
                                            boxShadow: hoveredPondId == pond.id 
                                              ? '0px 1px 3px 0px rgba(60,64,67,0.3), 0px 4px 8px 3px rgba(60,64,67,0.15)'
                                              : 'none',
                                            transition: 'box-shadow 0.3s ease-in-out',
                                          }} key={pond.id} onMouseEnter={() => setHoveredPondId(pond.id)}
                                          onMouseLeave={() => setHoveredPondId(null)}>
                                            <button className="flex  justify-between align-middle items-center w-full" onClick={() => pondDetails(pond.id)} >
                                                <div className="inline-block p-0 text-white rounded-lg w-28">
                                                    <img src={Aqua} alt="aqua" className='rounded-lg w-full h-20' />
                                                </div>
                                                <h1 className="font-semibold text-gray-700 dark:text-white">{pond.name}</h1>

                                                <span className="text-white bg-gray-700 rounded-full">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                    </svg>
                                                </span>
                                            </button>

                                        </div>

                                    )
                                })) : (<h2>{t('nopondyet')}</h2>)
                            }

                        </div>
                    </div>
                </section>
            </div>

        </Layout>
    )
}

export default UserPageOne