import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import URL from '../../URL';
import PondDetails from './PondDetails';

const PondDetailsModel = ({ onClose, setOpenModel, user }) => {

    const modalRef = useRef(null);
    const [pondCity, setPondCity] = useState()
    const [showDropdown, setShowDropdown] = useState(false)
    const [dropDownIndex, setDropdownIndex] = useState(null)
    const [userPonds, setUserPonds] = useState()
    const [openPondDetailsModel,setOpenPondDetailsModel] = useState(false)
    const [pondId,setPondId] = useState(null)
    const BASEURL = URL();


    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [onClose]);


    const handleModelClose = () => {
        setOpenModel(false);
        // onClose();
    }
    const fetchUserAllPonds = async () => {
        try {
            const res = await axios.get(`${BASEURL}/adminpond/${user}/`);
            // console.log(res.data);
            setUserPonds(res.data);
            setPondName(res.data[0].name)

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchUserAllPonds()
    }, [])
    const handleDropdown = (index) => {
        setShowDropdown(true)
        setDropdownIndex(index)
    };
    const pondDetails=(id)=>{
        setPondId(id)
        setOpenPondDetailsModel(!openPondDetailsModel)
    }

    return (
        <div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 mx-auto z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full transition ease-in-out delay-150" style={{ background: "rgba(0,0,0,0.6)" }}>
            <div className="relative p-4 w-full max-w-4xl max-h-full">
                {/* <!-- Modal content --> */}
                <div className="relative rounded-lg shadow dark:bg-gray-700" style={{ backgroundColor: 'rgb(246, 248, 252)' }}>
                    {/* <!-- Modal header --> */}
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            User Pond Details
                        </h3>
                        <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="select-modal" onClick={handleModelClose}>
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    {/* <!-- Modal body --> */}
                    <div className="p-4 md:p-5">
                        <p className="text-gray-500 dark:text-gray-400 mb-4">Select your desired pond:</p>
                        <div className="space-y-4 mb-4 flex flex-wrap gap-1 justify-around">
                            {
                                userPonds && userPonds.map((pond, index) => {
                                    return (

                                        <div key={index} className='w-96 mt-4'>
                                            <div className="inline-flex items-center justify-between w-full p-5 text-gray-900 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-500 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-900 hover:bg-gray-100 dark:text-white dark:bg-gray-600 dark:hover:bg-gray-500" onClick={() => handleDropdown({ index })}>
                                                <div className="block">
                                                    <div className="w-full text-lg font-semibold">{pond.name}</div>
                                                    <div className="w-full text-gray-500 dark:text-gray-400">{pond.city}</div>
                                                </div>
                                                <i className="fa-solid fa-caret-down w-4 h-4 ms-3 rtl:rotate-180 text-gray-500 dark:text-gray-400"></i>
                                            </div>
                                            {
                                                showDropdown && dropDownIndex.index === index &&
                                                (<div className='p-3 transition duration-150 ease-in-out delay-150 bg-green-100 shadow-lg'>
                                                    <table className="table-auto w-full">
                                                        <tr className='flex justify-between w-full'>
                                                            <th>Pond Total Area:</th>
                                                            <td>{parseFloat(pond.area).toFixed(2)} acers</td>
                                                        </tr>
                                                        {pond.payment_services.map((service, i) => {
                                                            return <tr className='w-full flex justify-between' key={i}>
                                                                <th >{service.service_name}</th>
                                                                <td>{service.created_at}</td>
                                                            </tr>
                                                        }
                                                        )
                                                        }
                                                    </table>
                                                    <button className="text-white inline-flex w-full justify-center bg-gray-300 hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={()=>pondDetails(pond.id)}>
                                                    Show Details
                                                </button>
                                                </div>)
                                            }
                                        </div>

                                    )
                                })
                            }

                        </div>
                        <button className="text-black inline-flex w-full justify-center bg-gray-300 hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={handleModelClose}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
                    {/* Open Pond Details in model */}
                    {
                        openPondDetailsModel ? <div className="absolute w-[90%] h-max top-5 md:p-4 pt-0 " style={{ backgroundColor: 'rgb(238, 255, 239)' }}>
                            <div className='flex justify-end px-4 mt-2 md:pt-0'><i className="fa-solid fa-xmark text-xl cursor-pointer" onClick={()=>setOpenPondDetailsModel(!openPondDetailsModel)}></i></div>
                        <PondDetails onClose={pondDetails} pondId={pondId}/>
                        <div className='flex justify-center px-4 mb-2'>

                        <button className="text-white inline-flex w-full justify-center bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm md:px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={()=>setOpenPondDetailsModel(!openPondDetailsModel)}>
                            Close
                        </button>
                        </div>
                    </div>: null
                    }
        </div>
    )
}

export default PondDetailsModel