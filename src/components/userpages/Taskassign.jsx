// import React, { useEffect, useState } from 'react'
// import Layout from '../Layout/Layout'
// import { Sidebar } from '../Sidebar'
// import URL from "../../URL";
// import axios from 'axios';
// import TaskassignModel from './TaskassignModel';
// import { ResponsNav } from '../ResponsNav';
// import { useParams } from 'react-router-dom';

// const Taskassign = () => {
//   const BASEURL = URL();
//   const [pondsData, setPondsData] = useState([]);
//   const [showTaskModel,setShowTaskModel] = useState(false);
//   const [selectedPond, setSelectedPond] = useState([]);
//   const userId = useParams();



//   const fetchPonds = async () => {
//     try {
//       const response = await axios.get(`${BASEURL}/task_assign_pondlist/${userId.userId}/`);
//       setPondsData(response.data);
//       // console.log(response);
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   useEffect(()=>{
//     const authString = localStorage.getItem("auth");
//     if (authString) {
//       const auth = JSON.parse(authString);
//       fetchPonds();
//     }
   
//   },[]);

//   const handleModelShow = () => {
//     setShowTaskModel(true);
//   }
//   const handlePondSelect = (pondName, pondId) => {
//     setSelectedPond((prevSelectedPonds) => {
//       const isAlreadySelected = prevSelectedPonds.some((pond) => pond.id === pondId);
//       if (isAlreadySelected) {
//         return prevSelectedPonds.filter((pond) => pond.id !== pondId);
//       } else {
//         return [...prevSelectedPonds, { name: pondName, id: pondId }];
//       }
//     });
//   };

//   const isPondSelected = (pondId) => {
//     return selectedPond.some((pond) => pond.id === pondId);
//   };
//   return (
//     <Layout>
//     <section className="flex gap-1">
//       <Sidebar />
//       <ResponsNav />
//       <div className="w-full flex flex-col align-middle items-center relative flex-row flex-wrap justify-center mx-auto my-auto gap-2">
//         <div className="flex flex-wrap gap-2 justify-center">

//         {
//           pondsData?.length > 0 ? pondsData.map((pond,id)=><button className={`w-40 h-40 p-6 rounded-md text-2xl font-bold hover:bg-[#c2e7ff] hover:shadow-xl text-gray-800 ${isPondSelected(pond.id) ? 'bg-[#c2e7ff] text-gray-700 shadow-xl' : 'bg-[#cac9c9]'}`} key={id} onClick={()=>handlePondSelect(pond.name,pond.id)}>{pond.name}</button>):<h2 className='text-3xl'>No Pond Added Yet!</h2>
//         }
//         </div>
//         {
//           selectedPond?.length > 0 && (<button className='w-max h-max bottom-2 bg-[#c2e7ff] text-gray-700 hover:text-gray-700 p-4 px-5 rounded-lg hover:bg-[#b4ddf8] mt-6 font-bold' onClick={handleModelShow}> Assign</button>)
//         }
//       </div>
//     </section>
//     {
//       showTaskModel && <div className="absolute top-0 bottom-0 left-0 right-0 bg-[rgb(0,0,0,0.5)] flex justify-center align-middle items-center">
//         <div className='w-[60vw] h-max bg-[#EEFFEF] rounded-lg overflow-auto'>
//         <TaskassignModel setShowTaskModel={setShowTaskModel} selectedPond={selectedPond} setSelectedPond={setSelectedPond}/>
//         </div>
//       </div>
//     }
//   </Layout>
//   )
// }




//edited by- Rajeswari
import React, { useEffect, useState } from 'react'
import Layout from '../Layout/Layout'
import { Sidebar } from '../Sidebar'
import URL from "../../URL";
import axios from 'axios';
import TaskassignModel from './TaskassignModel';
import { ResponsNav } from '../ResponsNav';
import { useParams } from 'react-router-dom';

const Taskassign = () => {
  const BASEURL = URL();
  const [pondsData, setPondsData] = useState([]);
  const [showTaskModel,setShowTaskModel] = useState(false);
  const [selectedPond, setSelectedPond] = useState([]);
  const userId = useParams();



  const fetchPonds = async () => {
    try {
      const response = await axios.get(`${BASEURL}/task_assign_pondlist/${userId.userId}/`);
      setPondsData(response.data);
      // console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(()=>{
    const authString = localStorage.getItem("auth");
    if (authString) {
      const auth = JSON.parse(authString);
      fetchPonds();
    }
   
  },[]);

  const handleModelShow = () => {
    setShowTaskModel(true);
  }
  const handlePondSelect = (pondName, pondId) => {
    setSelectedPond([{ name: pondName, id: pondId }]); 
    // setSelectedPond((prevSelectedPonds) => {
    //   const isAlreadySelected = prevSelectedPonds.some((pond) => pond.id === pondId);
    //   if (isAlreadySelected) {
    //     return prevSelectedPonds.filter((pond) => pond.id !== pondId);
    //   } else {
    //     return [...prevSelectedPonds, { name: pondName, id: pondId }];
    //   }
    // });
  };

  const isPondSelected = (pondId) => {
    return selectedPond.some((pond) => pond.id === pondId);
  };
  return (
    <Layout>
    <section className="flex gap-1">
      <Sidebar />
      <ResponsNav />
      <div className="w-full flex flex-col align-middle items-center relative  flex-wrap justify-center mx-auto my-auto gap-2">
        <div className="flex flex-wrap gap-2 justify-center">

        {
          pondsData?.length > 0 ? pondsData.map((pond,id)=><button className={`w-40 h-40 p-6 rounded-md text-2xl font-bold hover:bg-[#c2e7ff] hover:shadow-xl text-gray-800 ${isPondSelected(pond.id) ? 'bg-[#c2e7ff] text-gray-700 shadow-xl' : 'bg-[#cac9c9]'}`} key={id} onClick={()=>handlePondSelect(pond.name,pond.id)}>{pond.name}</button>):<h2 className='text-3xl'>No Pond Added Yet!</h2>
        }
        </div>
        {
          selectedPond?.length > 0 && (<button className='w-max h-max bottom-2 bg-[#c2e7ff] text-gray-700 hover:text-gray-700 p-4 px-5 rounded-lg hover:bg-[#b4ddf8] mt-6 font-bold' onClick={handleModelShow}> Assign</button>)
        }
      </div>
    </section>
    {
      showTaskModel && <div className="absolute top-0 bottom-0 left-0 right-0 bg-[rgb(0,0,0,0.5)] flex justify-center align-middle items-center">
        <div className='w-[60vw] h-max bg-[#EEFFEF] rounded-lg overflow-auto'>
        <TaskassignModel setShowTaskModel={setShowTaskModel} selectedPond={selectedPond} setSelectedPond={setSelectedPond}/>
        </div>
      </div>
    }
  </Layout>
  )
}

export default Taskassign

// export default Taskassign
