import React, { useEffect, useRef } from 'react'

export const AddCluster = ({setOpenModel,setClusterName,clusterName,handleSubmit,openModel}) => {
    const modalRef = useRef(null);

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
    <div className='w-full absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center' style={{backgroundColor:"rgba(0,0,0, 0.6)"}}>
        <div className='p-4 rounded-md shadow-md bg-white w-[50%] model' ref={modalRef}>
         <div className='flex justify-between items-center border-b pb-2'>
         <h2 className='text-xl font-bold text-gray-800 mb-4'>Create Cluster</h2>
         <i class="fa-solid fa-xmark text-xl text-gray-600 cursor-pointer hover:text-gray-700" onClick={()=>setOpenModel(false)}></i>
         </div>
         <form onSubmit={handleSubmit}>
         <div className='flex flex-col space-y-2 mt-4'>
            <label htmlFor="name" className='text-lg text-gray-700 font-medium'>Name of the Cluster</label>
            <input type="text" placeholder='Enter the cluster name...' className='w-full border p-2 rounded-md text-lg hover:outline-gray-500' value={clusterName} onChange={(e)=>setClusterName(e.target.value)}/>
         </div>
         <div className='flex justify-center'>
         <button className='max-w-max bg-gray-300 p-4 my-4 mt-6 rounded-md md:px-32 text-lg font-medium hover:bg-gray-400' type='submit'>Create Cluster</button>
         </div>
         </form>
          {/* Add Cluster Form */}
          </div>
    
    </div>
  )
}
