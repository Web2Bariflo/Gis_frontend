import React, { useEffect, useRef, useState } from 'react';
import AdminSideBar from './AdminSideBar';
import Mapimg from './../../assets/img/pond.png';
import axios from 'axios';
import URL from '../../URL';
import { AddCluster } from './AddCluster';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import PondDetails from './PondDetails';

export default function PondList() {
  const api = URL();
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);
  const [openModel, setOpenModel] = useState(false);
  const [ponds, setPonds] = useState([]);
  const [filteredPonds, setFilteredPonds] = useState([]);
  const [clusterName, setClusterName] = useState('');
  const modalRef = useRef(null);
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [pondId, setPondId] = useState(null);


  // Fetch cluster and user data
  const fetchPonds = async () => {
    try {
      const response = await axios.get(`${api}/adminpond_view/${id}/`);
      console.log(response);
      setPonds(response.data);
      setFilteredPonds(response.data); // Initialize filtered clusters with all clusters
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPonds();
  }, []);

  // Filter ponds based on search query
  useEffect(() => {
    const filtered = ponds.filter(pond => 
      pond.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPonds(filtered);
  }, [searchQuery, ponds]);


//   // Close modal on click outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (modalRef.current && !modalRef.current.contains(event.target)) {
//         setOpenModel(false);
//       }
//     };

//     if (openModel) {
//       document.addEventListener('mousedown', handleClickOutside);
//     } else {
//       document.removeEventListener('mousedown', handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [openModel]);
console.log(filteredPonds);
const openPondDetailsModel=(pondId)=>{
  setOpenModel(true)
  setPondId(pondId)
}

  return (
    <div className='flex gap-12'>
      <AdminSideBar />
      <div className='mt-11 w-full'>
        <h2 className='text-xl font-semibold text-gray-500 mb-4'>Ponds</h2>
        <div className='flex gap-4 items-center'>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-1/2 text-lg p-2 border rounded-md focus:outline-2 focus:outline-gray-400'
            placeholder='Search Pond...'
          />
        </div>
        {/* Cluster view */}
        <div className='w-full mt-8 flex gap-3 flex-wrap'>
          {filteredPonds.map((pond, j) => (
            <div className='p-2 bg-white max-h-max shadow-lg max-w-max rounded-md cursor-pointer' key={j} onClick={()=>openPondDetailsModel(pond.id)}>
              <img src={Mapimg} alt="..." className='w-[200px]' />
              <div className='flex w-full justify-between px-2 '>
                <p className='text-lg text-orange-900 font-semibold mt-4'>{pond.name}</p>
                <p className='text-md text-gray-500 font-semibold mt-4'>{Number(pond.Area).toFixed(2)} <span className='text-gray-500 text-sm'>acre</span></p>
              </div>
            </div>
          ))}
        </div>
        <span className='absolute bottom-6 right-10 cursor-pointer'>
          <i className="fa-solid fa-circle-plus text-6xl text-gray-600" onClick={() => navigate(`/admin-add-pond/${id}`)}></i>
        </span>
      </div>
      {
        openModel && (<div className="absolute top-0 max-w-max" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
          <div className="w-2/3 md:w-[80%] h-max top-5 md:p-10 pt-0 m-10 mx-auto rounded-md" style={{ backgroundColor: '#F6F8FC' }}>
            <div className='flex justify-end px-4 mt-2 md:pt-0'>
              <i className="fa-solid fa-xmark text-xl cursor-pointer" onClick={() => setOpenModel(false)}></i>
            </div>
            <PondDetails pondId={pondId}/>
          </div>
        </div>
        
        )
      }
    </div>
  );
}
