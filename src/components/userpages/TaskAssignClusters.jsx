import React, { useEffect, useState } from 'react'
import { Sidebar } from '../Sidebar'
import Layout from '../Layout/Layout'
import URL from '../../URL'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Pond from './../../assets/img/mapimg.png'


export const TaskAssignClusters = () => {
  const [clusterList,setClusterlist] = useState([])
  const BASEURL =  URL()
  const navigate= useNavigate()

  const fetchClusters = async() =>{
      try {
          const authString = localStorage.getItem('auth')
      // Parse the JSON string into an object
      const auth = JSON.parse(authString);

      // Access the "Mob" property from the auth object
          const id = auth.Mob;
          console.log(BASEURL);
          const responce = await axios.get(`${BASEURL}/fetch_cluster/${id}/`);
          // console.log(responce.data);
          setClusterlist(responce.data);
      } catch (error) {
          console.log(error);
      }
  }
  useEffect(() =>{
      fetchClusters();
  },[]);
  return (
    <Layout title={"Task Assign"}>
      <div className='flex gap-8'>
        <Sidebar />
        <div className='mt-8'>
          <h2 className='text-xl text-gray-500 font-medium'>Select Cluster to see Ponds</h2>
          <div className='flex flex-col gap-8 flex-wrap md:flex-row mt-5'>
                    {
                        clusterList.length > 0? clusterList.map((cluster,id)=><div className='flex flex-col gap-2 w-[250px] bg-gray-300 hover:bg-gray-400 cursor-pointer p-2 rounded-md hover:shadow-md' key={id} onClick={()=>navigate(`/task-asign/${cluster.id}`)}>
                                <img src={Pond} alt="..." className='w-full'/>
                            <h3 className='text-center text-xl my-2 font-bold text-gray-700'>{cluster.Name}</h3>
                            </div>): <h3 className='text-xl font-bold text-gray-500'>No Cluster Data Found</h3>
                    }
                </div>
        </div>

      </div>
    </Layout>
  )
}
