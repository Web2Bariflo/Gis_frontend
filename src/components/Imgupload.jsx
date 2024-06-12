import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify';
import URL from '../URL';

const Imgupload = ({id}) => {
    const avatarInputRef = useRef(null);
    const [avatar, setAvatar] = useState('');
    const BASEURL = URL();


    const handleImageClick = () => {
        avatarInputRef.current.click();
    }

    const fetchPhotoData = async() => {
       if(id){
        try {
            const res = await axios.get(`${BASEURL}/photosend/${id}/`);
            if(res.data.photo){
                
                setAvatar(res.data.photo);
                }
                } catch (error) {
                    console.log(error);
                }
       }
     }
   const handleInputChange = async(e) => {
                            const file = e.target.files[0];
                            const formData = new FormData();
                            formData.append('photo', file);
                            try {
                                const res = await axios.post(`${BASEURL}/photoupload/${id}/`,formData) 
                                if(res.data.message){
                                    toast.success(res.data.message)
                                }
                                fetchPhotoData()
                            } catch (error) {
                                console.log(error);
                            }
                            avatarInputRef.current.classList.add('hidden');
                    
                        }
    useEffect(()=>{
        fetchPhotoData();
    },[handleInputChange]);
    return (
        <>
            <div className="relative w-24 mx-auto ml-[47px]">
                <img className="object-cover w-24 h-24 mx-2 rounded-full" src={`${BASEURL}${avatar}`} alt="avatar" />
                <div className="w-24 h-24 group hover:bg-gray-200 opacity-60 rounded-full absolute flex justify-center items-center cursor-pointer transition duration-500 top-0 left-2">
                    <img className="hidden group-hover:block w-10" src="https://www.svgrepo.com/show/33565/upload.svg" alt="logo" onClick={handleImageClick}/>
                    <input type="file" className='hidden' ref={avatarInputRef}
          onChange={handleInputChange} />
                </div>
            </div>
        </>
    )
}

export default Imgupload