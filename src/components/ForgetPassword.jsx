import React, { useState } from 'react'
import Layout from './Layout/Layout'
import logo from '../assets/img/logo.png';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';
import URL from '../URL';

const ForgetPassword = () => {
    const [email, setEmail] = useState()
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const BASEURL = URL();


    const handelForgetPassword = async () => {

        try {
            const res = await axios.post(`${BASEURL}/forgotpassword/`, {
                Email: email
            })
            console.log(res)
            toast.success("Your password reset link sent to your email address .")
            reset();

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Layout title={"Forget Password"}>
            <div style={{ background: 'linear-gradient(to right, rgb(0, 101, 236), #94c1ff)' }} className='h-[100vh] m-auto flex justify-center items-center'>
                <div className="w-full  max-w-md mx-auto p-6" >
                    <div className="mt-7 bg-white  rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700 border-2 border-indigo-300">
                        <div className="p-4 sm:p-7">
                            <div className="text-center">
                                <div className='flex justify-center mb-0'>
                                    <img src={logo} alt="logo" />
                                </div>
                                <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">Forgot password?</h1>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    Remember your password?
                                    <a className="text-blue-600 decoration-2 hover:underline font-medium" href="/">
                                        Login here
                                    </a>
                                </p>
                            </div>

                            <div className="mt-5">
                                <form onSubmit={handleSubmit(handelForgetPassword)}>
                                    <div className="grid gap-y-4">
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-bold ml-1 mb-2 dark:text-white">Email address</label>
                                            <div className="relative">
                                                <input type="email" id="email" className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm" required aria-describedby="email-error"  {...register("email", { required: true })} onChange={(e) => setEmail(e.target.value)} placeholder='Enter registered email only'/>
                                            </div>
                                            <p className="hidden text-xs text-red-600 mt-2" id="email-error">Please include a valid email address so we can get back to you</p>
                                        </div>
                                        <button type="submit" className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">Reset password</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </Layout>
    )
}

export default ForgetPassword