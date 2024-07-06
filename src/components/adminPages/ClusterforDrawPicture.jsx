import React, { useEffect, useRef, useState } from 'react'
import AdminSideBar from './AdminSideBar'
import Select from 'react-select';
import URL from '../../URL';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Mapimg from './../../assets/img/mapimg.png';

export const ClusterforDrawPicture = () => {
    const api = URL();
    const navigate= useNavigate();
    const [selectedOption, setSelectedOption] = useState(null);
    const [openModel, setOpenModel] = useState(false);
    const [clusters, setClusters] = useState([]);
    const [filteredClusters, setFilteredClusters] = useState([]);
    const [clusterName,setClusterName] = useState('');
    const modalRef = useRef(null);


    // Create the options array for Select component
  const options = clusters.map((user) => ({
    value: user.user_id,
    label: user.user_name
  }));

    // Fetch cluster and user data
  const fetchClusters = async () => {
    try {
      const authString = localStorage.getItem('auth');
      const auth = JSON.parse(authString);
      const id = auth.Mob;
      const response = await axios.get(`${api}/admin_cluster_view/`);
      console.log(response);
      setClusters(response.data);
      setFilteredClusters(response.data); // Initialize filtered clusters with all clusters
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchClusters();
  }, []);

  const handleChange = (option) => {
    setSelectedOption(option);
    // Filter clusters based on the selected user's ID
    const filtered = clusters.filter(user => user.user_id === option.value);
    setFilteredClusters(filtered);
  };

  // Close modal on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setOpenModel(false);
      }
    };

    if (openModel) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openModel]);
  return (
    <div className='flex gap-12'>
      <AdminSideBar />
      <div className='mt-11 w-full'>
        <h2 className='text-xl font-semibold text-gray-500 mb-4'>Cluster</h2>
        <div className='flex gap-4 items-center'>
        <Select
          value={selectedOption}
          onChange={handleChange}
          options={options}
          className='w-1/2 text-lg outline-none border-none border-0'
          placeholder='Search cluster by user...'
        />
        <i className="fa-solid fa-rotate text-xl cursor-pointer text-gray-500" onClick={()=>{fetchClusters() ,setSelectedOption(null)}}></i>
        </div>
        {/* Cluster view */}
        <div className='w-full mt-8 flex gap-3 flex-wrap'>
          {filteredClusters.map((user, i) => (
            user.clusters.map((cluster, j) => (
              <div className='p-2 bg-white max-h-max shadow-lg max-w-max rounded-md cursor-pointer' key={j} onClick={()=>navigate(`/canvas-draw/${cluster.cluster_id}`)}>
                <img src={Mapimg} alt="..." className='w-[200px]' />
                <div className='flex w-full justify-between px-2'>
                  <p className='text-lg text-orange-900 font-semibold mt-4'>{cluster.cluster_name}</p>
                  <p className='text-lg text-orange-900 font-semibold mt-4'>{cluster.pond_count}</p>
                </div>
              </div>
            ))
          ))}
        </div>
        <span className='absolute bottom-6 right-10 cursor-pointer'>
          <i className="fa-solid fa-circle-plus text-6xl text-gray-600" onClick={() => selectedOption?setOpenModel(true):toast.error('Select user first')}></i>
        </span>
      </div>
    </div>
  )
}
