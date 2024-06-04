import React, { useEffect, useState,useRef  } from 'react'
import sunny from '../assets/img/weather_icon/sunny.png'
import useWebSocket from '../hooks/useWebSocket';

const Livefeed = ({setSocketData}) => {
    const [userId,setUserId] = useState()
    const authString = localStorage.getItem('auth')
    // Parse the JSON string into an object
    const auth = JSON.parse(authString);
    const user = auth.Mob
    const latestMessageRef = useRef(null);
    useEffect(() => {
        const authString = localStorage.getItem('auth')
        // Parse the JSON string into an object
        const auth = JSON.parse(authString);
        // setUser(auth.name);
        // setUserEmail(auth.email);
        const user = auth.Mob
        setUserId(auth.Mob)
    }, [])
    // console.log(user);
    const { data, isConnected } = useWebSocket(`ws://20.244.51.20/ws/${user}/`);
    console.log(data);
    setSocketData(data)
    useEffect(() => {
        if (latestMessageRef.current) {
          latestMessageRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, [data]);
  return (
    <>
    <div
            className="w-full md:w-4/12 h-[98vh] text-black p-3 pb-0 shadow-lg "
            style={{ backgroundColor: "rgb(238, 255, 239)" }}
          >
            <h2 className="text-3xl font-bold tracking-wide my-1 text-orange-600">
              Live Feed
            </h2>
            <p className='text-xl text-orange-600'>( Last updates 10 minutes ago )</p>
            {/* <hr className="shadow-lg" /> */}
            <div className="w-full p-3">
              <div className="w-full h-[85vh] overflow-auto flex flex-col space-y-4">
                    <div className="w-full bg-white p-4 py-1 rounded-lg shadow-lg">
                        <div className="flex justify-between align-middle items-center">
                        <p className='text-xl text-orange-600'>Weather</p>
                        <span className='text-3xl font-bold text-sky-600'>..</span>
                        </div>
                        <div className='flex align-middle items-center gap-7 my-0'>
                            <img src={sunny} alt="..." className='w-30'/>
                            <p className='text-4xl font-bold text-sky-500'>27°C</p>
                        </div>
                        <p className='text-md text-sky-600 text-right'>See full forecast</p>

                    </div>
                   <div className='h-[84vh] flex flex-col gap-2 overflow-auto'>
                   {
                        data ? data.map(allData => allData.map((task, i) => {
                            return (
                              <div
                                className={`w-full p-4 pb-1 pt-0 rounded-lg shadow-lg ${
                                  task.STATUS === 'YES' || task.STATUS === 'Yes' ? 'bg-green-700' :
                                  task.STATUS === 'NO' || task.STATUS === 'No' ? 'bg-red-500' :
                                  !task.STATUS || task.STATUS === "''" ? 'bg-yellow-500' : ''
                                } text-white`}
                                key={i}
                                ref={i === 0 ? latestMessageRef : null}
                              >
                                <div className="flex justify-between align-middle items-center">
                                  <p className='text-xl text-white'>{task.NAME}</p>
                                  <span className='text-3xl font-bold text-white mb-2'>..</span>
                                </div>
                                <div className="relative overflow-x-auto">
                                  <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-orange-100 dark:bg-gray-700 dark:text-gray-400">
                                      <tr>
                                        <th scope="col" className="px-6 py-3">Pond</th>
                                        <th scope="col" className="px-6 py-3">Date/Time</th>
                                        <th scope="col" className="px-6 py-3">Feed</th>
                                        <th scope="col" className="px-6 py-3 text-center">Location</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr className="bg-white dark:bg-gray-800 dark:border-gray-700 text-green-500">
                                        <th scope="row" className="px-6 font-medium text-green-500 whitespace-nowrap dark:text-white">
                                          {task.POND_ID}
                                        </th>
                                        <td className="px-6 py-4 text-wrap">{task.TIME}</td>
                                        <td className="px-6 py-4">{task.feed_weight ? task.feed_weight : ''}</td>
                                        <td className="px-6 py-4 text-wrap text-end text-xs">{!task.LATITUDE == ""? Number(task.LATITUDE).toFixed(4):""}, {!task.LONGITUDE == ""? Number(task.LONGITUDE).toFixed(4):""}</td>

                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                                <div className='flex justify-between'>
                                {task.LATITUDE && task.LONGITUDE ? (
                                  <div className='flex gap-2 align-middle items-center'>
                                    <i className="fa-solid fa-location-dot"></i>
                                    <p className='text-md text-white text-right'>Location Captured</p>
                                  </div>
                                ) : null}
                                <p className='text-md text-white text-right items-end'>View All</p>
                                </div>
                              </div>
                            );
                          })) : null
                    }
                   </div>
              </div>
            </div>
          </div>
    </>
  )
}

export default Livefeed