import React, { useEffect, useState } from 'react'

import Aqua from './../assets/img/aqua.webp'
import { Navigate, useNavigate } from 'react-router-dom'
import axios from 'axios'
import logo from './../../public/logo.png';
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { t, use } from 'i18next'
import URL from '../URL'
import Imgupload from './Imgupload';


export const Sidebar = ({handleSettingOpen  }) => {
    const navigate = useNavigate()
    const [ponds, setPonds] = useState();
    const [openSettings, setOpenSettings] = useState(false)
    const [user, setUser] = useState()
    const [userEmail, setUserEmail] = useState()
    const [openSideNav,setOpenSideNav] = useState(false)
    const [activeOption, setActiveOption] = useState(null)
    const [userId, setUserId] = useState()
    const {t} = useTranslation()
    const BASEURL = URL();

    useEffect(()=>{
        const authString = localStorage.getItem('auth')
        // Parse the JSON string into an object
        const auth = JSON.parse(authString);

        // Access the "Mob" property from the auth object
        const id = auth.Mob;
        
        setUser(auth.name);
        setUserEmail(auth.email);
        setUserId(auth.Mob)
        console.log(user, userEmail);
    },[])
 // Logout User
 const handleLogOut = () => {
    localStorage.removeItem('auth');
    localStorage.removeItem('data');
    navigate('/');
};

  return (
    <aside style={{ backgroundColor: 'rgba(65, 148, 94, 1)' }} className=" hidden md:flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700">
    <div className='flex flex-col justify-center mb-0 items-center'>
        <img src={logo} alt="logo" className='w-1/4'/>
         <p className='text-md font-semibold leading-tight tracking-tight text-white md:text-md dark:text-gray-500 text-center' style={{paddingTop: "0px"}}>{t('AquaboticsAccount')}</p>
    </div>

    <div className="flex flex-col items-center mt-6 -mx-2">
        <Imgupload id={userId}/>
        <h4 className="mx-2 mt-2 font-medium text-white dark:text-gray-200">{user}</h4>
        <p className="mx-2 mt-1 text-sm font-medium text-white dark:text-gray-400">{userEmail}</p>
    </div>

    <div className="flex flex-col justify-between flex-1 mt-6 text-white">
        <nav>
            <div className={`flex items-center px-4 py-2  ${location.pathname === '/user-dashboard' ? ' bg-gray-100  dark:text-gray-200 text-gray-700' : 'text-gray-100'} rounded-lg dark:bg-gray-800 cursor-pointer`} onClick={()=>navigate('/user-dashboard')}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>

                <span className="mx-4 font-medium">{t('dashboard')}</span>
            </div>
            <div className={`flex items-center px-4 py-2 mt-5 transition-colors duration-300 transform rounded-lg  hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700 cursor-pointer ${location.pathname === '/analytics' ? ' bg-gray-100  dark:text-gray-200 text-gray-700' : 'text-gray-100'}`} onClick={()=>navigate('/analytics')}>
            <i className="fa-solid fa-chart-simple w-5 h-5"></i>

                <span className="mx-4 font-medium">Analytics</span>
            </div>
            <div className={`flex items-center px-4 py-2 mt-5 transition-colors duration-300 transform rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700 cursor-pointer ${location.pathname === '/task-asign' ? ' bg-gray-100  dark:text-gray-200 text-gray-700' : 'text-gray-100'}`} onClick={()=>navigate('/task-asign')}>
            <i className="fa-solid fa-list-check w-5 h-5"></i>

                <span className="mx-4 font-medium">Task Assign</span>
            </div>
            <div className="flex items-center px-4 py-2 mt-5 transition-colors duration-300 transform rounded-lg text-white dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700 cursor-pointer" onClick={()=>setOpenSettings(!openSettings)}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.3246 4.31731C10.751 2.5609 13.249 2.5609 13.6754 4.31731C13.9508 5.45193 15.2507 5.99038 16.2478 5.38285C17.7913 4.44239 19.5576 6.2087 18.6172 7.75218C18.0096 8.74925 18.5481 10.0492 19.6827 10.3246C21.4391 10.751 21.4391 13.249 19.6827 13.6754C18.5481 13.9508 18.0096 15.2507 18.6172 16.2478C19.5576 17.7913 17.7913 19.5576 16.2478 18.6172C15.2507 18.0096 13.9508 18.5481 13.6754 19.6827C13.249 21.4391 10.751 21.4391 10.3246 19.6827C10.0492 18.5481 8.74926 18.0096 7.75219 18.6172C6.2087 19.5576 4.44239 17.7913 5.38285 16.2478C5.99038 15.2507 5.45193 13.9508 4.31731 13.6754C2.5609 13.249 2.5609 10.751 4.31731 10.3246C5.45193 10.0492 5.99037 8.74926 5.38285 7.75218C4.44239 6.2087 6.2087 4.44239 7.75219 5.38285C8.74926 5.99037 10.0492 5.45193 10.3246 4.31731Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>

                <span className="mx-4 font-medium">{t('settings')}</span>
            </div>
            {
                openSettings ? <div className={`flex items-center px-4 py-2 mt-5  transition-colors duration-300 transform rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700 cursor-pointer  ${location.pathname === '/change-password/' ? ' bg-gray-100  dark:text-gray-200 text-gray-700' : 'text-gray-100'}`} onClick={()=>navigate(`/change-password/${userId}`)}>
                    <i className="fa-solid fa-key"></i>

                    <span className="mx-4 font-medium">{t('changepassword')}</span>
                </div> : null
            }
            <a className="flex items-center px-4 py-2 mt-5  transition-colors duration-300 transform rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700" href="#" onClick={handleLogOut}>
                <i className="fa-solid fa-arrow-right-from-bracket"></i>

                <span className="mx-4 font-medium">{t('logout')}</span>
            </a>
        </nav>
    </div>
</aside>
  )
}
