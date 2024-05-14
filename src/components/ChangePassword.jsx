import axios from 'axios';
import React from 'react'
import { useForm } from 'react-hook-form';
// import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/img/logo.png';
import Layout from './Layout/Layout';
import { toast } from 'react-toastify';
import URL from '../URL';

const ChangePassword = () => {
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const BASEURL = URL();




    const handleChangePassword = async (e) => {
        e.preventDefault();
        const user = localStorage.getItem('auth');
        const auth = JSON.parse(user);
        const id = auth.Mob;
        if (e.target.password.value === e.target.cpassword.value) {

            try {
                const res = await axios.post(`${BASEURL}/changepassword/${id}/`, { password: e.target.cpassword.value });
                if (res.data && res.data.message) {
                    toast.success(res.data.message);
                    reset();
                    navigate('/');
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            toast.error('Password not match');
        }


 
    }
    return (
        <Layout title={"Change Password"}>
        <section className="dark:bg-gray-900 h-screen" style={{ background: 'linear-gradient(to right, rgb(0, 101, 236), #94c1ff)' }}>
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
                <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8" style={{ backgroundColor: 'rgb(238, 255, 239)' }}>
                    <div className='flex justify-center mb-0'>
                        <img src={logo} alt="logo" />
                    </div>
                    <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
                        Change Password
                    </h2>
                    <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5" onSubmit={handleChangePassword}>
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">New Password</label>
                            <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" {...register("password", { required: true, maxLength: 6, minLength: 4 })} />
                            {errors.password && errors.password.type === "required" && (
                                <span className="text-sm font-light text-red-500">This is required</span>
                            )}
                            {errors.password && errors.password.type === "maxLength" && (
                                <span className="text-sm font-light text-red-500">Max length exceeded</span>
                            )}
                            {errors.password && errors.password.type === "minLength" && (
                                <span className="text-sm font-light text-red-500">Phone number must be 10 digts</span>
                            )}
                        </div>
                        <div>
                            <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                            <input type="confirm-password" name="confirm-password" id="confirm-password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register("cpassword", { required: true, maxLength: 6, minLength: 4 })}/>
                        </div>
                            {errors.cpassword && errors.cpassword.type === "required" && (
                                <span className="text-sm font-light text-red-500">This is required</span>
                            )}
                            {errors.cpassword && errors.cpassword.type === "maxLength" && (
                                <span className="text-sm font-light text-red-500">Max length exceeded</span>
                            )}
                            {errors.cpassword && errors.cpassword.type === "minLength" && (
                                <span className="text-sm font-light text-red-500">Phone number must be 10 digts</span>
                            )}
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input id="newsletter" aria-describedby="newsletter" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required=""  />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="newsletter" className="font-light text-gray-500 dark:text-gray-300">I accept the <a className="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">Terms and Conditions</a></label>
                            </div>
                        </div>
                        <button type="submit" className="w-full text-white  hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" style={{ backgroundColor: 'rgba(65, 148, 94, 1)' }}>Reset passwod</button>
                    </form>
                </div>
            </div>
        </section>
        </Layout>
    )
}

export default ChangePassword