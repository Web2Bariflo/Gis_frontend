import React, { useEffect, useState } from 'react'
import Layout from '../Layout/Layout'
import { Sidebar } from '../Sidebar'
import axios from 'axios'
import URL from '../../URL'
import { useNavigate } from 'react-router-dom'
import Pond from './../../assets/img/mapimg.png'

export const Cluster = () => {
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
    <Layout>
        <section className='flex gap-8'>
            <Sidebar />
            <div className='w-full flex flex-col gap-5 mt-16 md:mt-8'>
                <h2 className='text-xl font-bold text-gray-500'>Clusters</h2>
                <div className='flex flex-col gap-8 flex-wrap md:flex-row '>
                    {
                        clusterList.length > 0? clusterList.map((cluster,id)=><div className='flex flex-col gap-2 w-[250px] bg-gray-300 hover:bg-gray-400 cursor-pointer p-2 rounded-md hover:shadow-md' key={id} onClick={()=>navigate(`/user-dashboard/${cluster.id}`)}>
                                <img src={Pond} alt="..." className='w-full'/>
                            <h3 className='text-center text-xl my-2 font-bold text-gray-700'>{cluster.Name}</h3>
                            </div>): <h3 className='text-xl font-bold text-gray-500'>No Cluster Data Found</h3>
                    }
                </div>
            </div>
        </section>
    </Layout>
  )
}
