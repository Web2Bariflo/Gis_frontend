import React, { useEffect, useState } from 'react';
import Layout from '../Layout/Layout';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import signupback from '../../assets/img/Group.png';
import farmer from '../../assets/img/Clippathgroup.png';
import logo from '../../assets/img/logo.png';
import map from '../../assets/img/Frame.png';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import URL from '../../URL';

const Signup = () => {
    const { t } = useTranslation();
    const [isLogin, setIsLogin] = useState(false);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const BASEURL = URL();
    const handleLogin = () => {
        setIsLogin(!isLogin);
    };

    const onSubmit = async (formdata) => {
        console.log(BASEURL);
        try {
            const res = await axios.post(`${BASEURL}/signup/`, formdata);
            if (res.data && res.data.message) {
                toast.success(res.data.message);
                setIsLogin(true);
                reset();
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error occurred, please try again later");
        }
    };

    const handleUserLogin = async (e) => {
        e.preventDefault();
        try {
            const URL = BASEURL
            const res = await axios.post(`${URL}/login/`, {
                mob: e.target.phone.value,
                password: e.target.password.value
            });
            console.log(res)
            if (res.data && res.data.message) {
                localStorage.setItem('auth', JSON.stringify(res.data));
                if (res.data.message === "You are successfully entered the admin page...") {
                    navigate('/admin-dashboard');
                } else {
                    navigate('/user-dashboard');
                }
                toast.success(res.data.message);
                e.target.reset();
            } else {
                toast.error(res.response?.data?.message || res.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error occurred, please try again later");
        }
    };

    // useEffect(() => {}, []);

    return (
        <Layout title={!isLogin ? "GIS Project Login" : "GIS Project Signup"}>
            {!isLogin ? (
                <section className='dark:bg-gray-900 h-full flex justify-center' style={{ background: 'linear-gradient(to right, rgb(0, 101, 236), #94c1ff)' }}>
                    <div className="flex flex-col items-center justify-center px-4 py-8 h-screen lg:py-0 lg:w-1/2">
                        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                                <div className='flex justify-center mb-0'>
                                    <img src={logo} alt="logo" />
                                </div>
                                <h1 className="text-xl font-semibold leading-tight tracking-tight text-blue-900 md:text-2xl dark:text-white text-center mt-[0px]">
                                    {t('login')}
                                </h1>
                                <p className='text-md font-semibold leading-tight tracking-tight text-black md:text-md dark:text-white text-center' style={{ paddingTop: "0px" }}>
                                    {t('AquaboticsAccount')}
                                </p>
                                <form className="space-y-4 md:space-y-6" onSubmit={handleUserLogin}>
                                    <div>
                                        <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('yourphonenumber')}</label>
                                        <input type="text" name="phone" id="phone" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter your phone number" required {...register("mob", { required: true, maxLength: 12, minLength: 10 })} />
                                        {errors.mob && <span className="text-sm font-light text-red-500">{t('phonerequired')}</span>}
                                        {errors.mob && errors.mob.type === "maxLength" && <span className="text-sm font-light text-red-500">{t('maxlength')}</span>}
                                        {errors.mob && errors.mob.type === "minLength" && <span className="text-sm font-light text-red-500">{t('minlength')}</span>}
                                    </div>
                                    <div>
                                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('password')}</label>
                                        <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required {...register("password", { required: true })} />
                                        {errors.password && <span className="text-sm font-light text-red-500">{t('passwordrequired')}</span>}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-start">
                                            <div className="flex items-center h-5">
                                                <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">{t('rememberme')}</label>
                                            </div>
                                        </div>
                                        <button type="button" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500" onClick={() => navigate('/forget-password')}>{t('forgotpassword')}</button>
                                    </div>
                                    <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">{t('signin')}</button>
                                    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                        {t('donthaveanaccount')} <span className="font-medium text-primary-600 hover:underline dark:text-primary-500 cursor-pointer" onClick={handleLogin}>{t('signup')}</span>
                                    </p>
                                </form>
                                <Link to='/change-language' className='text-sm mt-0 text-gray-500'>{t('changelanguage')}</Link>
                            </div>
                        </div>
                    </div>
                    <div className="hidden bg-cover lg:block lg:w-1/2 m-auto">
                        <img src={map} alt="map" className='m-auto w-3/4' />
                    </div>
                </section>
            ) : (
                <section className='dark:bg-gray-900 h-screen' style={{ background: 'linear-gradient(to right, rgb(0, 101, 236), #94c1ff)' }}>
                    <div className='dark:bg-gray-900 flex justify-center h-screen' style={{ backgroundImage: `url(${signupback})`, backgroundSize: "cover", backgroundRepeat: "no-repeat" }}>
                        <div className="flex items-center w-full max-w-md mx-auto lg:w-1/2">
                            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                                <div className="p-6 space-y-4 md:space-y-6 sm:p-8 mb-0">
                                    <div className='flex justify-center mb-0'>
                                        <img src={logo} alt="logo" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-semibold leading-tight tracking-tight text-blue-900 md:text-2xl dark:text-white text-center mt-[0px]">
                                            {t('signup')}
                                        </h1>
                                        <p className='text-md font-semibold leading-tight tracking-tight text-black md:text-md dark:text-white text-center'>{t('AquaboticsAccount')}</p>
                                    </div>
                                    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
                                        <div>
                                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('yourname')}</label>
                                            <input type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter your name" required {...register("name", { required: true })} />
                                            {errors.name && <span className="text-sm font-light text-red-500">{t('namerequired')}</span>}
                                        </div>
                                        <div>
                                            <label htmlFor="mob" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('yourphonenumber')}</label>
                                            <input type="text" name="mob" id="mob" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter your phone" required {...register("mob", { required: true, maxLength: 12, minLength: 10 })} />
                                            {errors.mob && <span className="text-sm font-light text-red-500">{t('phonerequired')}</span>}
                                            {errors.mob && errors.mob.type === "maxLength" && <span className="text-sm font-light text-red-500">{t('maxlength')}</span>}
                                            {errors.mob && errors.mob.type === "minLength" && <span className="text-sm font-light text-red-500">{t('minlength')}</span>}
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('youremail')}</label>
                                            <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required {...register("email", { required: true })} />
                                            {errors.email && <span className="text-sm font-light text-red-500">{t('emailrequired')}</span>}
                                        </div>
                                        <div>
                                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('password')}</label>
                                            <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required {...register("password", { required: true })} />
                                            {errors.password && <span className="text-sm font-light text-red-500">{t('passwordrequired')}</span>}
                                        </div>
                                        <div className="flex items-start">
                                            <div className="flex items-center h-5">
                                                <input id="terms" aria-describedby="terms" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">
                                                    {t('condition')} <a className="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">{t('condition2')}</a>
                                                </label>
                                            </div>
                                        </div>
                                        <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                            {t('createanaccount')}
                                        </button>
                                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                            {t('alreadyhaveanaccount')} <span className="font-medium text-primary-600 hover:underline dark:text-primary-500 cursor-pointer" onClick={handleLogin}>{t('loginhere')}</span>
                                        </p>
                                        <Link to='/change-language' className='text-sm mt-0 text-gray-500'>{t('changelanguage')}</Link>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="hidden bg-cover lg:block lg:w-1/2">
                            <div className="flex items-end h-full px-6 lg:w-full">
                                <img src={farmer} alt="farmer" className='w-3/4' />
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </Layout>
    );
};

export default Signup;
