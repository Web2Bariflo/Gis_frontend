import React from 'react'
import { useNavigate } from 'react-router-dom';

export const LogoutPopUp = ({setIsOpen}) => {
  const navigate = useNavigate()

  const onLogout = () => {
    localStorage.removeItem('auth');
    localStorage.removeItem('data');
    setIsOpen(false);
    navigate('/');
  };
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/3 p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">Logout</h2>
        <p className="text-gray-700 text-center mb-6">Are you sure you want to logout?</p>
        <div className="flex justify-around px-8">
          <button
            onClick={()=>setIsOpen(false)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
