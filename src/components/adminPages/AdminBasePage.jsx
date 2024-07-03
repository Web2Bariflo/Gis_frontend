import React, { useEffect, useRef, useState } from 'react'
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css'; // Import Leaflet Draw CSS
import L from 'leaflet';
import 'leaflet-draw'; // Import Leaflet Draw library
import axios from 'axios';
// import { toast } from 'react-hot-toast';
import Layout from '../Layout/Layout';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import URL from '../../URL';


const AdminBasePage = () => {
    const mapRef = useRef(null);
    const drawnItemsRef = useRef(null);
    const [drawnPolygon, setDrawnPolygon] = useState(null);
    const [name, setName] = useState('');
    const [cityName, setCityName] = useState('');
    const [coardinates, setCoordinates] = useState([]);
    const [totalArea, setTotalArea] = useState(0);
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [map, setMap] = useState(null);
    const [isSatelliteView, setIsSatelliteView] = useState(false);
    const {id} = useParams();
    const [searchName,setSearchName] = useState();
    const navigate = useNavigate()
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
                polyline: true,
                rectangle: true,
                circle: true,
                marker: true,
            },
            edit: {
                featureGroup: drawnItems
            }
        });
        map.addControl(drawControl);

        // Event handler for when a polygon is created
        map.on(L.Draw.Event.CREATED, function (event) {
            const layer = event.layer;
            drawnItems.addLayer(layer);
            calculateTotalArea();
            saveDrawnPolygon(layer);
        });


        // Event handler for when a polygon is edited
        map.on(L.Draw.Event.EDITED, function (event) {
            const layer = event.layer;
            calculateTotalArea();
            saveDrawnPolygon(layer);
        });

        // Calculate total area of all drawn polygons
        function calculateTotalArea() {
            let totalAreaSqMeters = 0;
            drawnItems.eachLayer(function (layer) {
                if (layer instanceof L.Polygon) {
                    totalAreaSqMeters += L.GeometryUtil.geodesicArea(
                        layer.getLatLngs()[0]
                    );
                }
            });
            // Convert square meters to acres
            const totalAreaAcres = totalAreaSqMeters / 4046.86;
            setTotalArea(totalAreaAcres);
        }


        // Save drawn polygon coordinates to localStorage
        function saveDrawnPolygon(layer) {
            const coordinates = layer.getLatLngs()[0].map(coord => [coord.lat, coord.lng]);
            // localStorage.setItem('drawnPolygon', JSON.stringify(coordinates));
            setDrawnPolygon(layer);
            setCoordinates(coordinates);
        }

        setMap(map);
        // Clean up function to remove the map instance when component unmounts
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);



    const handleSubmit = async () => {
        try {
            // const latlong = [latitude, longitude]
            if(latitude && longitude){

                const res = await axios.post(`${BASEURL}/demo/`, { name: name, location: coardinates, clusterid:id,city:cityName,area:totalArea,latitude:latitude,longitude:longitude });
                if (res.data && res.data.message) {
                    toast.success(res.data.message);
                    setName('');
                    setCoordinates([]);
                    setCityName('')
                    setTotalArea(0)
                    setLatitude('');
                    setLongitude('');
                    setTimeout(() => {
                        // navigate('/admin-dashboard');
                    }, 5000); // Navigate after 5 seconds
                }
                else{
                    toast.error('Something get wrong');
                }
            }else{
                toast.error('Latitude and longitude required');
            }
        } catch (error) {
            // console.log(error);
            toast.error('Something get wrong');
        }
    };


    //   search lat and long
    const handleSearch = async(e) => {
        e.preventDefault();
        if (map && latitude !== '' && longitude !== '') {
            // map.setView([parseFloat(latitude), parseFloat(longitude)], 20);
            const latLng = [parseFloat(latitude), parseFloat(longitude)];
            map.setView(latLng, 25);
        L.marker(latLng).addTo(map);
        }else if (searchName !== '') {
            try {
                // Perform search by name query
                const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${searchName}`);
                if (response.data[0].lat && response.data[0].lon > 0) {
                    const latLng = [response.data[0].lat, response.data[0].lon]; // Swap to [lat, lng]
                    map.setView(latLng, 25);
                    L.marker(latLng).addTo(map);
                } else {
                    toast.error('Location not found.');
                }
            } catch (error) {
                // console.log(error);
                toast.error('Failed to search location.');
            }
        }
        
        setSearchName('');

    };


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

    return (
        <Layout title={"Admin Dashboard"}>
            <div className='flex flex-col md:flex-row'>
                {/* side panel */}
                <aside style={{ backgroundColor: '#F6F8FC' }} className="flex flex-col md:w-[345px] md:h-screen px-4 py-8 overflow-y-auto border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700 text-gray-600">
                    <div className="flex flex-col flex-1 mt-6">
                        <div className="mb-5">
                            <label htmlFor="base-input" className="block mb-2 text-sm font-medium dark:text-white">Pond Name</label>
                            <input type="text" id="base-input" name='name' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={name}
                                onChange={(e) => setName(e.target.value)} placeholder='Enter pond name' required/>
                        </div>
                        <div className="mb-5">
                            <label htmlFor="city-input" className="block mb-2 text-sm font-medium dark:text-white">City Name</label>
                            <input type="text" id="city-input" name='city' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={cityName}
                                onChange={(e) => setCityName(e.target.value)} placeholder='Enter city name' required/>
                        </div>
                        <div className="text-white text-center font-bold">Search Pond</div>
                        <hr className='mb-5'/>
                        <div className="mb-5" >
                            <label
                                htmlFor="locationname"
                                className="block mb-2 text-sm font-medium dark:text-white"
                            >
                                Search by Name
                            </label>
                            <input
                                type="text"
                                id="locationname"
                                name="searchname"
                                placeholder='Enter Pond Name or Location'
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}
                            />
                        </div>
                        <hr className='mb-5'/>
                        <div className="mb-5" >
                            <label
                                htmlFor="latitude"
                                className="block mb-2 text-sm font-medium dark:text-white"
                            >
                                Latitude
                            </label>
                            <input
                                type="text"
                                id="latitude"
                                name="latitude"
                                placeholder='Enter Pond Latitude'
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={latitude}
                                onChange={(e) => setLatitude(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-5">
                            <label
                                htmlFor="longitude"
                                className="block mb-2 text-sm font-medium dark:text-white"
                            >
                                Langitude
                            </label>
                            <input
                                type="text"
                                id="longitude"
                                name="longitude"
                                placeholder='Enter Pond Langitude'
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={longitude}
                                onChange={(e) => setLongitude(e.target.value)}
                                required
                            />
                        </div>
                        <button className=" text-white p-3 rounded-3xl px-5 my-2" style={{ background: 'linear-gradient(to right, rgb(0, 101, 236), #94c1ff)' }} type="submit" onClick={handleSearch}>
                        <i className="fa-solid fa-magnifying-glass text-white"></i>  <span className="text-white text-base font-semibold font-['Open Sans']">Search</span>
                        </button>
                    </div>
                </aside>
                <div className="p-4 w-full relative">
                    <div id="map" className='md:h-[90%] w-full z-0 h-80'></div>
                    <button className='absolute bg-white p-2 text-black rounded-sm border border-black' style={{top:'20px',right:'20px', zIndex:1}} onClick={toggleSatelliteView}>Map Views</button>
                   <div className='flex justify-between'>
                <div className='flex gap-3 flex-col md:flex-row'>
                <button className="md:w-64 text-white p-3 rounded-full px-5 my-2 md:text-xl font-bold" style={{ background: 'linear-gradient(to right, rgb(0, 101, 236), #94c1ff)' }} onClick={handleSubmit}>
                        Submit
                    </button>
                    <button className="md:w-64 text-white p-3 rounded-full px-5 my-2 md:text-xl font-bold" style={{ background: 'linear-gradient(to right, rgb(0, 101, 236), #94c1ff)' }} onClick={()=>navigate('/admin-dashboard')}>
                        Back
                    </button>
                </div>
                    <div className='my-2 md:text-xl font-bold p-3'>Total Area: {totalArea.toFixed(2)} acres</div>
                   </div>
                </div>
            </div>
        </Layout>
    )
}

export default AdminBasePage;