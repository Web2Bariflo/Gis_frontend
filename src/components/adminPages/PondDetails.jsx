import Layout from '../Layout/Layout'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import day2 from '../../assets/img/weather_icon/suncld.png'
import day3 from '../../assets/img/weather_icon/sun cloude.png'
import day4 from '../../assets/img/weather_icon/cunrain.png'
import logo from '../../assets/img/logo.png';
// import Razorpay from 'razorpay';
// import useRazorpay from "react-razorpay";
import { TECollapse } from "tw-elements-react";
import Imgupload from '../Imgupload';
import { useTranslation } from 'react-i18next'
import Chart from '../Chart';
import ApexCharts from 'apexcharts'
import ChartComponent from '../Chart';
import URL from '../../URL';


const PondDetails = ({onClose,pondId}) => {
    const mapRef = useRef(null);
    const navigate = useNavigate()
    const drawnItemsRef = useRef(null);
    const [drawnPolygon, setDrawnPolygon] = useState(null);
    const [coardinates, setCoordinates] = useState([]);
    const [totalArea, setTotalArea] = useState(0);
    const [map, setMap] = useState(null);
    const [isSatelliteView, setIsSatelliteView] = useState(false);
    const [user, setUser] = useState();
    const [pondCity, setPondCity] = useState();
    const { id } = useParams();
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [forCastData, setForCastData] = useState([]);
    const [polygon, setPolygon] = useState([]);
    const [openSettings, setOpenSettings] = useState(false)
    const [userEmail, setUserEmail] = useState()
    const [openSideNav, setOpenSideNav] = useState(false)
    // const Razorpay = useRazorpay();
    const [success, setSuccess] = useState(false)
    const [AQUATIC_MACROPYTES, setAQUATIC_MACROPYTES] = useState(false);
    const [CDOM, setCdom] = useState(false);
    const [GCI, setGci] = useState(false);
    const [NDCI, setNdci] = useState(false);
    const [NDTI, setNdti] = useState(false);
    const [NDVI, setNdvi] = useState(false);
    const [TSS, setTss] = useState(false);
    const [dissolved_oxygen, setDissolved_oxygen] = useState(false);
    const [ndwi_values, setNdwi_values] = useState(false);
    const [ph_values, setPh_values] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [userId, setUserId] = useState();
    const [totalPondArea, setTotalPondArea] = useState()
    const {t} = useTranslation()
    const [openModel, setOpenModel] = useState({
      AQUATIC_MACROPYTES: false,
      CDOM: false,
      GCI: false,
      NDCI: false,
      NDTI: false,
      NDVI: false,
      TSS: false,
      dissolved_oxygen: false,
      ndwi_values: false,
      ph_values: false,
    });
    const [dates, setDates] = useState([]);
    const [data, setData] = useState({});
    const BASEURL = URL();
  
  
  
    
  
    useEffect(() => {
      // Check if the map is already initialized
      if (mapRef.current !== null) return;
      // Create map instance and set its center and zoom level
      const map = L.map('map').setView([20.593683, 78.962883], 18);
  
      // Add a tile layer to the map
      const defaultTileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri'
      });
      // .addTo(map);
  
      map.addLayer(defaultTileLayer);
      // Store the map instance in the ref
      mapRef.current = map;
  
  
      // Initialize feature group to store drawn items (e.g., polygons)
      const drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);
      drawnItemsRef.current = drawnItems;
      // Initialize Leaflet draw control for drawing polygons
      const drawControl = new L.Control.Draw({
        draw: {
          polygon: true,
          polyline: false,
          rectangle: false,
          circle: false,
          marker: false
        },
        edit: {
          featureGroup: drawnItems
        }
      });
      map.addControl(drawControl);
  
  
  
  
      // Load previously drawn polygon from localStorage
      const savePond = async () => {
  
  
        try {
          const res = await axios.get(`${BASEURL}/userpondsid/${id}/`)
          console.log(res);
          setPondCity(res.data.city)
          const coordinates = res.data.location
          setPolygon(res.data.location)
          setTotalPondArea(res.data.area)
  
  
          if (coordinates && coordinates.length > 0) {
            setCoordinates(coordinates);
  
            // Parse the coordinates array and draw polygon on map
            const polygon = L.polygon(coordinates, { color: 'red' }).addTo(mapRef.current);
            const bounds = polygon.getBounds();
            const center = bounds.getCenter();
            mapRef.current.setView(center, 20);
            const tarea = calculateTotalArea()
            setTotalArea(tarea);
            console.log(totalArea);
          }
          res.data.payments.map((item) => {
  
            if (item.AQUATIC_MACROPYTES && item.AQUATIC_MACROPYTES !== null) {
                console.log(item.AQUATIC_MACROPYTES);
              setAQUATIC_MACROPYTES(true)
            }
            if (item.NDCI && item.NDCI !== null) {
                console.log(item.NDCI);
              setNdci(true)
            }
  
            if (item.CDOM && item.CDOM !== null) {
                console.log(item.CDOM);
              setCdom(true)
            }
  
            if (item.GCI && item.GCI !== null) {
              setGci(true)
            }
  
            if (item.NDTI && item.NDTI !== null) {
              setNdti(true)
            }
  
            if (item.NDVI && item.NDVI !== null) {
              setNdvi(true)
            }
  
            if (item.TSS && item.TSS !== null) {
              setTss(true)
            }
  
            if (item.dissolved_oxygen && item.dissolved_oxygen !== null) {
              setDissolved_oxygen(true)
            }
  
            if (item.NDWI && item.NDWI !== null) {
              setNdwi_values(true)
            }
  
            if (item.ph && item.ph !== null) {
              setPh_values(true)
            }
          })
  
  
  
  
        } catch (error) {
          console.log(error);
        }
      };
  
  
      savePond();
  
  
      // savePond();
      setMap(map);
      // Clean up function to remove the map instance when component unmounts
      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
  
  
    }, []);
  
    const calculateTotalArea = () => {
      let n = polygon.length;
      let area = 0.0;
      for (let i = 0; i < n; i++) {
        let j = (i + 1) % n;
        area += polygon[i][0] * polygon[j][1];
        area -= polygon[j][0] * polygon[i][1];
      }
      area = Math.abs(area) / 2.0;
      return area;
    }
  
  
    const toggleSatelliteView = () => {
      setIsSatelliteView(prevState => !prevState);
      if (!isSatelliteView) {
        // Switch to satellite view
        const satelliteTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        });
        mapRef.current.eachLayer(layer => {
          if (layer instanceof L.TileLayer) {
            mapRef.current.removeLayer(layer);
          }
        });
        mapRef.current.addLayer(satelliteTileLayer);
      } else {
        // Switch back to default tile view
        const defaultTileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: '© Esri'
        });
        mapRef.current.eachLayer(layer => {
          if (layer instanceof L.TileLayer) {
            mapRef.current.removeLayer(layer);
          }
        });
        mapRef.current.addLayer(defaultTileLayer);
      }
    };
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${pondCity}&limit=1&appid=f06c28466bd98b962ed2e94b9fd29598`);
          setLatitude(res.data[0].lat);
          setLongitude(res.data[0].lon);
        } catch (error) {
          console.log(error);
        }
      };
  
      fetchData();
    }, [pondCity]);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=f06c28466bd98b962ed2e94b9fd29598`);
          const uniqueForcastDays = [];
          const sixDaysData = data.data.list.filter(day => {
            const date = new Date(day.dt_txt).getDate();
            if (!uniqueForcastDays.includes(date)) {
              uniqueForcastDays.push(date);
              return true;
            }
            return false;
          });
          setForCastData(sixDaysData);
        } catch (error) {
          console.log(error);
        }
      };
  
      if (latitude !== '' && longitude !== '') {
        fetchData();
      }
    }, [latitude, longitude]);
  
  
   
    useEffect(() => {
      const authString = localStorage.getItem('auth')
      // Parse the JSON string into an object
      const auth = JSON.parse(authString);
      setUser(auth.name);
      setUserEmail(auth.email);
      setUserId(auth.Mob)
    }, [])
  
    // // mobileview navebar
    // const handleOpenSideNav = () => {
    //   console.log('clicked');
    //   setOpenSideNav(!openSideNav)
    // };
  
  
    // // Razorpay
    // const loadScript = (src) => {
    //   return new Promise((resolve) => {
    //     const script = document.createElement("script");
    //     script.src = src;
    //     script.onload = () => {
    //       resolve(true);
    //     };
    //     script.onerror = () => {
    //       resolve(false);
    //     };
    //     document.body.appendChild(script);
    //   });
    // };
  
    // useEffect(() => {
    //   loadScript("https://checkout.razorpay.com/v1/checkout.js");
    // });
  
    // async function paymentGateway(amount, service) {
    //   try {
    //     // Make an HTTP request to create an order in the Django backend
    //     const response = await axios.post(`${BASEURL}/create_order/`, {
    //       amount: amount,
    //     });
    //     const data = await response.data;
  
    //     const razorpayOptions = {
    //       key: 'rzp_test_M4wPEnBM4t1hog', // Replace with your actual Razorpay key
    //       amount: amount,
    //       currency: 'INR',
    //       name: 'Bariflolabs Pvt Ltd.',
    //       description: 'Purchase Description',
    //       image: 'https://avatars.githubusercontent.com/u/102237909?s=280&v=4', // URL of your company logo
    //       order_id: data.id,
    //       handler: async (response) => {
    //         // Make an HTTP request to handle the payment in the Django backend
    //         await fetch(`${BASEURL}/complete_order/`, {
    //           method: 'POST',
    //           headers: {
    //             'Content-Type': 'application/json',
    //           },
    //           body: JSON.stringify({
    //             username: user,
    //             pondid: id,
    //             servicename: service,
    //             amount: amount,
    //             orderid: data.id,
    //             token: data.token
    //           }),
    //         });
    //         setSuccess(true)
    //       },
    //       prefill: {
    //         name: 'Bariflo lab',
    //         email: 'customer@example.com',
    //         contact: '9999999999',
    //       },
    //       notes: {
    //         address: 'Kolkata',
    //       },
    //       theme: {
    //         color: '#3399cc',
    //       },
    //     };
  
    //     const razorpayInstance = new window.Razorpay(razorpayOptions);
    //     razorpayInstance.open();
    //   } catch (error) {
    //     console.error('Error:', error);
    //   }
  
    // }
  
    // Razorpay
  
  
    const toggleModel = async(model) => {
      setOpenModel(prevState => ({
        ...prevState,
        [model]: !prevState[model]
      }));
    
    };
   const getChart = async() => {
    try {
        console.log(pondId);
      const res = await axios.get(`${BASEURL}/graph/${id}/`);
      console.log(res);
      setData(res.data);
     
    } catch (error) {
     console.log(error);
   }
   }
   useEffect(()=>{
    getChart();
   },[])
  
    ///////////////////////////////////////////////Tooltip/////////////////////////////
    const toggleTooltip = () => {
      setShowTooltip(!showTooltip);
      
    };
    ///////////////////////////////////////////////Tooltip/////////////////////////////
  
  return (
    <Layout title={"Admin Dashboard"}>
         <div className='flex flex-col w-full lg:p-1'>
          <div className="p-4 w-full flex md:flex-row flex-col flex-col-reverse md:justify-between md:gap-5 gap-0 h-[50%]">
            <div className='md:w-8/12 flex flex-col relative'>
              <div id="map" className='md:h-full z-0 h-80'>
              </div>
              <button className='absolute bg-white p-2 text-black rounded-sm border border-black z-1 right-0 md:right-2 top-2' onClick={toggleSatelliteView}>Map Views</button>
              <div className='flex justify-between absolute bottom-0'>
                <div className='my-2 text-xl font-bold p-3 text-white'>{t('totalarea')}: {parseFloat(totalPondArea).toFixed(2)} acres</div>
              </div>
            </div>
            <div className='p-4 md:w-5/12 flex flex-col md:space-y-3 space-y-2 my-0 mb-4 md:my-0'  style={{
          background: "linear-gradient(to right, rgb(0, 101, 236), #94c1ff)",}}>
              <div className='text-xl font-bold'>{t('weather')}</div>
              {
                forCastData && forCastData.length > 0 ? (
                  <>
                    <div className='flex'>
                      <img src={`https://openweathermap.org/img/wn/${forCastData[0].weather[0].icon}@2x.png`} alt="pic" className='w-1/4' />
                      <div className='flex flex-col justify-center px-5'>
                        <p className='text-lg'><span className='font-semibold'>{t('todays')}</span> | {forCastData[0].dt_txt.split(" ")[0]}</p>
                        <p className='text-md font-lg'><span className='font-semibold'>{(forCastData[0].main.temp - 273.15).toFixed(2)} °C</span> {forCastData[0].weather[0].description}</p>
                      </div>
                    </div>
                    <div className='py-6'>
                      <p className='text-xl '>{t('6daysweather')}</p>
                    </div>
                    <div className='flex gap-3 justify-between'>
                      <div>
                        <img src={`https://openweathermap.org/img/wn/${forCastData[1].weather[0].icon}@2x.png`} alt="pic" className='w-2/4' />
                        <p>{(forCastData[1].main.temp_min - 273.15).toFixed(2)}° - {(forCastData[1].main.temp_max - 273.15).toFixed(2)}°</p>
                        <p className='font-semibold text-base'>{forCastData[1].dt_txt.split(" ")[0]}</p>
                      </div>
                      <div>
                        <img src={`https://openweathermap.org/img/wn/${forCastData[2].weather[0].icon}@2x.png`} alt="pic" className='w-2/4' />
                        <p>{(forCastData[2].main.temp_min - 273.15).toFixed(2)}° - {(forCastData[2].main.temp_max - 273.15).toFixed(2)}°</p>
                        <p className='font-semibold text-base'>{forCastData[2].dt_txt.split(" ")[0]}</p>
                      </div>
                      <div>
                        <img src={`https://openweathermap.org/img/wn/${forCastData[3].weather[0].icon}@2x.png`} alt="pic" className='w-2/4' />
                        <p>{(forCastData[3].main.temp_min - 273.15).toFixed(2)}° - {(forCastData[3].main.temp_max - 273.15).toFixed(2)}°</p>
                        <p className='font-semibold text-base'>{forCastData[3].dt_txt.split(" ")[0]}</p>
                      </div>
                      <div>
                        <img src={`https://openweathermap.org/img/wn/${forCastData[4].weather[0].icon}@2x.png`} alt="pic" className='w-2/4' />
                        <p>{(forCastData[4].main.temp_min - 273.15).toFixed(2)}° - {(forCastData[4].main.temp_max - 273.15).toFixed(2)}°</p>
                        <p className='font-semibold text-base'>{forCastData[4].dt_txt.split(" ")[0]}</p>
                      </div>
                      <div>
                        <img src={`https://openweathermap.org/img/wn/${forCastData[5].weather[0].icon}@2x.png`} alt="pic" className='w-2/4' />
                        <p>{(forCastData[5].main.temp_min - 273.15).toFixed(2)}° - {(forCastData[5].main.temp_max - 273.15).toFixed(2)}°</p>
                        <p className='font-semibold text-base'>{forCastData[5].dt_txt.split(" ")[0]}</p>
                      </div>
                    </div>
                  </>
                ) : (<>
                  <div className='flex'>
                    <img src="https://cdn-icons-png.flaticon.com/512/7133/7133364.png" alt="pic" className='w-1/4' />
                    <div className='flex flex-col justify-center px-5'>
                      <p className='text-md'><span className='font-semibold'>Todays</span> | 24 March 2024</p>
                      <p className='text-md'><span className='font-semibold'>24 °C</span> Party Clouds</p>
                    </div>
                  </div>
                  <div className='py-6'>
                    <p className='text-sm'>7 days weather</p>
                  </div>
                  <div className='flex gap-3 justify-between'>
                    <div>
                      <img src={day2} alt="img" className='w-2/4' />
                      <p>28° - 32°</p>
                      <p>mon</p>
                    </div>
                    <div>
                      <img src={day3} alt="img" className='w-2/4' />
                      <p>28° - 32°</p>
                      <p>mon</p>
                    </div>
                    <div>
                      <img src={day4} alt="img" className='w-2/4' />
                      <p>28° - 32°</p>
                      <p>mon</p>
                    </div>
                    <div>
                      <img src={day2} alt="img" className='w-2/4' />
                      <p>28° - 32°</p>
                      <p>mon</p>
                    </div>
                    <div>
                      <img src={day3} alt="img" className='w-2/4' />
                      <p>28° - 32°</p>
                      <p>mon</p>
                    </div>
                  </div>
                </>)
              }

            </div>
          </div>
          <div className="max-w-full w-full lg:max-w-full lg:flex bg-white mt-4 p-8">
            <div className='p-4 w-full flex gap-4 justify-around flex-col md:flex-row' style={{ backgroundColor: 'rgb(238, 255, 239)' }}>

              <div className="flex flex-col w-full md:w-6/12 gap-4">
                <div className="flex flex-col w-full justify-between bg-gray-400 rounded-md">
                  <div className="flex w-full justify-between bg-gray-400 p-2 rounded-md shadow-md text-gray-700" style={{ backgroundColor: '#E9EEF6' }}>
                    <h2 className='h-full text-xl font-bold flex items-center text-center item-center'>AQUATIC MACROPHYTES</h2>
                    {/* {
                      AQUATIC_MACROPYTES ? <span className='text-2xl p-2 font-bold text-md cursor-pointer' onClick={() => toggleModel('AQUATIC_MACROPYTES')}>+</span> : <button className='p-3 bg-yellow-400 rounded-full px-8 text-white font-bold text-md curser-pointer'>PAY</button>
                    } */}
                    <span className='text-2xl p-2 font-bold text-md cursor-pointer' onClick={() => toggleModel('AQUATIC_MACROPYTES')}>+</span>
                  </div>
                  {
                    openModel.AQUATIC_MACROPYTES ? <div className='p-3 shadow-lg shadow-gray-500/50 bg-gray-100'>
                      <h3 className='text-gray-500 text-xl'>Chart</h3>
                      <hr className='w-full'/>
                        <ChartComponent title="AQUATIC MACROPHYTES Chart" data={data.AQUATIC_MACROPYTES} labels={data.date}/>
                      <div className="group relative flex">
                        <svg data-tooltip-target="tooltip-hover" data-tooltip-trigger="click" className="h-8 w-8 text-red-400 ml-[85%] relative cursor-pointer inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" onClick={toggleTooltip}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg><p className='text-red-400 flex justify-center cursor-pointer inline'>Disclaimer</p>
                        <span className="absolute top-10 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">Aquatic macrophytes are large, visible, and often rooted plants that grow in bodies of water such as lakes, rivers, ponds, and wetlands. They are a diverse group of plants that can include various species of submerged, floating, and emergent plants.</span>
                      </div>
                    </div> : ""
                  }
                </div>
                <div className="flex flex-col w-full justify-between bg-gray-400 rounded-md">
                  <div className="flex w-full justify-between bg-gray-400 p-2 rounded-md shadow-md text-gray-700" style={{ backgroundColor: '#E9EEF6' }}>
                    <h2 className='h-full text-xl font-bold flex items-center text-center item-center'>Colored Dissolved Organic Matter</h2>
                    {/* {
                      CDOM ? <span className='text-2xl p-2 font-bold text-md cursor-pointer' onClick={() => toggleModel('CDOM')}>+</span> : <button className='p-3 bg-yellow-400 rounded-full px-8 text-white font-bold text-md curser-pointer' >PAY</button>
                    } */}
                    <span className='text-2xl p-2 font-bold text-md cursor-pointer' onClick={() => toggleModel('CDOM')}>+</span> 
                  </div>
                  {
                    openModel.CDOM ? <div className='p-3 bg-gray-100 shadow-lg shadow-gray-500/50'>
                      <h3 className='text-gray-500 text-xl'>Chart</h3>
                      <hr className='w-full'/>
                      <ChartComponent title="CDOM Chart" data={data.CDOM} labels={data.date}/>
                      
                      <div className="group relative flex">
                        <svg data-tooltip-target="tooltip-hover" data-tooltip-trigger="click" className="h-8 w-8 text-red-400 ml-[85%] relative cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" onClick={toggleTooltip}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg><p className='text-red-400 flex justify-center cursor-pointer'>Disclaimer</p>
                        <span className="absolute top-10 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">CDOM stands for Chromophoric Dissolved Organic Matter. It refers to a group of organic compounds found in water that absorb light, particularly in the blue and ultraviolet regions of the electromagnetic spectrum.</span>
                      </div>
                    </div> : ""
                  }
                </div>
                <div className="flex flex-col w-full justify-between bg-gray-400 rounded-md">
                  <div className="flex w-full justify-between bg-gray-400 p-2 rounded-md shadow-md text-gray-700" style={{ backgroundColor: '#E9EEF6' }}>
                    <h2 className='h-full text-xl font-bold flex items-center text-center item-center'>Green Chlorophyll Index</h2>
                    {/* {
                      GCI ? <span className='text-2xl p-2 font-bold text-md cursor-pointer' onClick={() => toggleModel('GCI')}>+</span> : <button className='p-3 bg-yellow-400 rounded-full px-8 text-white font-bold text-md curser-pointer'>PAY</button>
                    } */}
                    <span className='text-2xl p-2 font-bold text-md cursor-pointer' onClick={() => toggleModel('GCI')}>+</span>
                  </div>
                  {
                    openModel.GCI ? <div className='p-3 bg-gray-100 shadow-lg shadow-gray-500/50'>
                      <h3 className='text-gray-500 text-xl'>Chart</h3>
                      <hr className='w-full'/>
                      <ChartComponent title="GCI Chart" data={data.GCI} labels={data.date}/>
                      <div className="group relative flex">
                        <svg data-tooltip-target="tooltip-hover" data-tooltip-trigger="click" className="h-8 w-8 text-red-400 ml-[85%] relative cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" onClick={toggleTooltip}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg><p className='text-red-400 flex justify-center cursor-pointer'>Disclaimer</p>
                        <span className="absolute top-10 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">The Green Chlorophyll Index (GCI) is a vegetation index used in remote sensing to assess the chlorophyll content of vegetation, particularly in agricultural applications.</span>
                      </div>
                    </div> : ""
                  }
                </div>
                <div className="flex flex-col w-full justify-between bg-gray-400 rounded-md">
                  <div className="flex w-full justify-between bg-gray-400 p-2 rounded-md shadow-md text-gray-700" style={{ backgroundColor: '#E9EEF6' }}>
                    <h2 className='h-full text-xl font-bold flex items-center text-center item-center'>Normalized Difference Chlorophyll Index</h2>
                    {/* {
                      NDCI ? <span className='text-2xl p-2 font-bold text-md cursor-pointer' onClick={() => toggleModel('NDCI')}>+</span> : <button className='p-3 bg-yellow-400 rounded-full px-8 text-white font-bold text-md curser-pointer'>PAY</button>
                    } */}
                    <span className='text-2xl p-2 font-bold text-md cursor-pointer' onClick={() => toggleModel('NDCI')}>+</span>
                  </div>
                  {
                    openModel.NDCI ? <div className='p-3 bg-gray-100 shadow-lg shadow-gray-500/50'>
                      <h3 className='text-gray-500 text-xl'>Chart</h3>
                      <hr className='w-full'/>
                      <ChartComponent title="NDCI Chart" data={data.NDCI} labels={data.date}/>
                      <div className="group relative flex">
                        <svg data-tooltip-target="tooltip-hover" data-tooltip-trigger="click" className="h-8 w-8 text-red-400 ml-[85%] relative cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" onClick={toggleTooltip}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg><p className='text-red-400 flex justify-center cursor-pointer'>Disclaimer</p>
                        <span className="absolute top-10 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">NDCI stands for Normalized Difference Chlorophyll Index. It is a vegetation index used in remote sensing to estimate the concentration of chlorophyll in vegetation, particularly in aquatic and wetland environments.</span>
                      </div>
                    </div> : ""
                  }
                </div>
                <div className="flex flex-col w-full justify-between bg-gray-400 rounded-md">
                  <div className="flex w-full justify-between bg-gray-400 p-2 rounded-md shadow-md text-gray-700" style={{ backgroundColor: '#E9EEF6' }}>
                    <h2 className='h-full text-xl font-bold flex items-center text-center item-center'>Normalized Difference Vegetation Index</h2>
                    {/* {
                      NDTI ? <span className='text-2xl p-2 font-bold text-md cursor-pointer' onClick={() => toggleModel('NDTI')}>+</span> : <button className='p-3 bg-yellow-400 rounded-full px-8 text-white font-bold text-md curser-pointer' >PAY</button>
                    } */}
                    <span className='text-2xl p-2 font-bold text-md cursor-pointer' onClick={() => toggleModel('NDTI')}>+</span> 
                  </div>
                  {
                    openModel.NDTI ? <div className='p-3 bg-gray-100 shadow-lg shadow-gray-500/50'>
                      <h3 className='text-gray-500 text-xl'>Chart</h3>
                      <hr className='w-full'/>
                      <ChartComponent title="NDTI Chart" data={data.NDTI} labels={data.date}/>
                      <div className="group relative flex">
                        <svg data-tooltip-target="tooltip-hover" data-tooltip-trigger="click" className="h-8 w-8 text-red-400 ml-[85%] relative cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" onClick={toggleTooltip}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg><p className='text-red-400 flex justify-center cursor-pointer'>Disclaimer</p>
                        <span className="absolute top-10 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">NDTI stands for Normalized Difference Turbidity Index. It is a spectral index used in remote sensing to estimate the turbidity or sediment concentration in water bodies, particularly in rivers, lakes, and coastal areas.</span>
                      </div>
                    </div> : ""
                  }
                </div>
              </div>
              <div className="flex flex-col w-full md:w-6/12 gap-4">
                <div className="flex flex-col w-full justify-between bg-gray-400 rounded-md">
                  <div className="flex w-full justify-between bg-gray-400 p-2 rounded-md shadow-md text-gray-700" style={{ backgroundColor: '#E9EEF6' }}>
                    <h2 className='h-full text-xl font-bold flex items-center text-center item-center'>Normalized difference vegetation index</h2>
                    {/* {
                      NDVI ? <span className='text-2xl p-2 font-bold text-md cursor-pointer' onClick={() => toggleModel('NDVI')}>+</span> : <button className='p-3 bg-yellow-400 rounded-full px-8 text-white font-bold text-md curser-pointer'>PAY</button>
                    } */}
                    <span className='text-2xl p-2 font-bold text-md cursor-pointer' onClick={() => toggleModel('NDVI')}>+</span>
                  </div>
                  {
                    openModel.NDVI ? <div className='p-3 bg-gray-100 shadow-lg shadow-gray-500/50'>
                      <h3 className='text-gray-500 text-xl'>Chart</h3>
                      <hr className='w-full'/>
                      <ChartComponent title="NDVI Chart" data={data.NDVI} labels={data.date}/>
                      <div className="group relative flex">
                        <svg data-tooltip-target="tooltip-hover" data-tooltip-trigger="click" className="h-8 w-8 text-red-400 ml-[85%] relative cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" onClick={toggleTooltip}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg><p className='text-red-400 flex justify-center cursor-pointer'>Disclaimer</p>
                        <span className="absolute top-10 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">NDVI stands for Normalized Difference Vegetation Index. It is a widely used vegetation index in remote sensing to assess the health, density, and vigor of vegetation cover over large areas, such as agricultural fields, forests, and natural ecosystems.</span>
                      </div>
                    </div> : ""
                  }
                </div>
                <div className="flex flex-col w-full justify-between bg-gray-400 rounded-md">
                  <div className="flex w-full justify-between bg-gray-400 p-2 rounded-md shadow-md text-gray-700" style={{ backgroundColor: '#E9EEF6' }}>
                    <h2 className='h-full text-xl font-bold flex items-center text-center item-center'>Total suspended solids </h2>
                    {/* {
                      TSS ? <span className='text-2xl p-2 font-bold text-md cursor-pointer' onClick={() => toggleModel('TSS')}>+</span> : <button className='p-3 bg-yellow-400 rounded-full px-8 text-white font-bold text-md curser-pointer' >PAY</button>
                    } */}
                    <span className='text-2xl p-2 font-bold text-md cursor-pointer' onClick={() => toggleModel('TSS')}>+</span>
                  </div>
                  {
                    openModel.TSS ? <div className='p-3 bg-gray-100 shadow-lg shadow-gray-500/50'>
                      <h3 className='text-gray-500 text-xl'>Chart</h3>
                      <hr className='w-full'/>
                      <ChartComponent title="TSS Chart" data={data.TSS} labels={data.date} />
                      <div className="group relative flex">
                        <svg data-tooltip-target="tooltip-hover" data-tooltip-trigger="click" className="h-8 w-8 text-red-400 ml-[85%] relative cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" onClick={toggleTooltip}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg><p className='text-red-400 flex justify-center cursor-pointer'>Disclaimer</p>
                        <span className="absolute top-10 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">TSS stands for Total Suspended Solids. It refers to the concentration of solid particles that are suspended in water and are not dissolved. These particles can include both organic and inorganic matter, such as silt, clay, plankton, algae, and other debris.</span>
                      </div>
                    </div> : ""
                  }
                </div>
                <div className="flex flex-col w-full justify-between bg-gray-400 rounded-md">
                  <div className="flex w-full justify-between bg-gray-400 p-2 rounded-md shadow-md text-gray-700" style={{ backgroundColor: '#E9EEF6' }}>
                    <h2 className='h-full text-xl font-bold flex items-center text-center item-center'>Dissolved Oxygen</h2>
                    {/* {
                      dissolved_oxygen ? <span className='text-2xl p-2 font-bold text-md cursor-pointer' onClick={() => toggleModel('dissolved_oxygen')}>+</span> : <button className='p-3 bg-yellow-400 rounded-full px-8 text-white font-bold text-md curser-pointer' >PAY</button>
                    } */}
                    <span className='text-2xl p-2 font-bold text-md cursor-pointer' onClick={() => toggleModel('dissolved_oxygen')}>+</span>
                  </div>
                  {
                    openModel.dissolved_oxygen ? <div className='p-3 bg-gray-100 shadow-lg shadow-gray-500/50'>
                      <h3 className='text-gray-500 text-xl'>Chart</h3>
                      <hr className='w-full'/>
                      <ChartComponent title="DO Chart" data={data.dissolved_oxygen} labels={data.date}/>
                      <div className="group relative flex">
                        <svg data-tooltip-target="tooltip-hover" data-tooltip-trigger="click" className="h-8 w-8 text-red-400 ml-[85%] relative cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" onClick={toggleTooltip}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg><p className='text-red-400 flex justify-center cursor-pointer'>Disclaimer</p>
                        <span className="absolute top-10 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">DO stands for Dissolved Oxygen. It refers to the amount of oxygen gas (O2) dissolved in water. Dissolved oxygen is essential for the survival of aquatic organisms, as it is required for respiration, metabolism, and other physiological processes.</span>
                      </div>
                    </div> : ""
                  }
                </div>
                <div className="flex flex-col w-full justify-between bg-gray-400 rounded-md">
                  <div className="flex w-full justify-between bg-gray-400 p-2 rounded-md shadow-md text-gray-700" style={{ backgroundColor: '#E9EEF6' }}>
                    <h2 className='h-full text-xl font-bold flex items-center text-center item-center'>Normalized Difference Water Index</h2>
                    {/* {
                      ndwi_values ? <span className='text-2xl p-2 font-bold text-md cursor-pointer' onClick={() => toggleModel('ndwi_values')}>+</span> : <button className='p-3 bg-yellow-400 rounded-full px-8 text-gray-700 font-bold text-md curser-pointer' >PAY</button>
                    } */}
                    <span className='text-2xl p-2 font-bold text-md cursor-pointer' onClick={() => toggleModel('ndwi_values')}>+</span>
                  </div>
                  {
                    openModel.ndwi_values ? <div className='p-3 bg-gray-100 shadow-lg shadow-gray-500/50'>
                      <h3 className='text-gray-500 text-xl'>Chart</h3>
                      <hr className='w-full'/>
                      <ChartComponent title="NDWI Chart" data={data.NDWI} labels={data.date}/>
                      <div className="group relative flex">
                        <svg data-tooltip-target="tooltip-hover" data-tooltip-trigger="click" className="h-8 w-8 text-red-400 ml-[85%] relative cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" onClick={toggleTooltip}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg><p className='text-red-400 flex justify-center cursor-pointer'>Disclaimer</p>
                        <span className="absolute top-10 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-gray-700 group-hover:scale-100">Normalized Difference Water Index (NDWI) can refer to one of two remote sensing-derived indexes related to liquid water: to monitor changes in water content of leaves, and to monitor changes related to water content in water bodies.</span>
                      </div>
                    </div> : ""
                  }
                </div>
                <div className="flex flex-col w-full justify-between bg-gray-400 rounded-md">
                  <div className="flex w-full justify-between bg-gray-400 p-2 rounded-md shadow-md text-gray-700" style={{ backgroundColor: '#E9EEF6' }}>
                    <h2 className='h-full text-xl font-bold flex items-center text-center item-center'>Potential of Hydrogen</h2>
                    {/* {
                      ph_values ? <span className='text-2xl p-2 font-bold text-md cursor-pointer' onClick={() => toggleModel('ph_values')}>+</span> : <button className='p-3 bg-yellow-400 rounded-full px-8 text-gray-700 font-bold text-md curser-pointer' >PAY</button>
                    } */}
                    <span className='text-2xl p-2 font-bold text-md cursor-pointer' onClick={() => toggleModel('ph_values')}>+</span>
                  </div>
                  {
                    openModel.ph_values ? <div className='p-3 bg-gray-100 shadow-lg shadow-gray-500/50'>
                      <h3 className='text-gray-500 text-xl'>Chart</h3>
                      <hr className='w-full'/>
                      <ChartComponent title="PH Chart" data={data.ph} labels={data.date}/>
                      <div className="group relative flex">
                        <svg data-tooltip-target="tooltip-hover" data-tooltip-trigger="click" className="h-8 w-8 text-red-400 ml-[85%] relative cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" onClick={toggleTooltip}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg><p className='text-red-400 flex justify-center cursor-pointer'>Disclaimer</p>
                        <span className="absolute top-10 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-gray-700 group-hover:scale-100">pH stands for "potential of hydrogen." It is a measure of the acidity or alkalinity of a solution, indicating the concentration of hydrogen ions (H+) present in the solution.</span>
                      </div>
                    </div> : ""
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
    </Layout>
  )
}

export default PondDetails