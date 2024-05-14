import React, { useState } from "react";
import Layout from "./Layout/Layout";
import logo from "../assets/img/logo.png";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom";

const ChooseLanguage = () => {
  const navigate = useNavigate();
  const [languages, setLanguages] = useState("en");
  const { language, changeLanguage } = useLanguage();

  const handleChangeLanguage = () => {
    changeLanguage(languages);
    navigate("/");
  };

  return (
    <Layout title={"Choose Your Language"}>
      <section
        className="dark:bg-gray-900 h-[100vh] flex justify-center"
        style={{
          background: "linear-gradient(to right, rgb(0, 101, 236), #94c1ff)",
        }}
      >
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <div className="flex justify-center mb-0">
                <img src={logo} alt="logo" />
              </div>
              <h1 className="text-xl font-bold leading-tight tracking-tight text-blue-900 md:text-2xl dark:text-white text-center">
                Choose Your Language
              </h1>
              <div className="mx-auto w-full flex justify-center flex-wrap">
                <button
                  type="button"
                  className="w-28  text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-3.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800 font-bold"
                  onClick={() => setLanguages("en")}
                >
                  English
                </button>
                <button
                  type="button"
                  className="w-28 text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-3.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800 font-bold"
                  onClick={() => setLanguages("hi")}
                >
                  हिंदी
                </button>
                <button
                  type="button"
                  className="w-28 text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-3.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800 font-bold"
                  onClick={() => setLanguages("mh")}
                >
                  मराठी
                </button>
                <button
                  type="button"
                  className="w-28 text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-3.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800 font-bold"
                  onClick={() => setLanguages("od")}
                >
                  ଓଡିଆ
                </button>
                <button
                  type="button"
                  className="w-28 text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-3.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800 font-bold"
                  onClick={() => setLanguages("ta")}
                >
                  தமிழ்
                </button>
                <button
                  type="button"
                  className="w-28 text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-3.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800 font-bold"
                  onClick={() => setLanguages("tl")}
                >
                  తెలుగు
                </button>
              </div>
              <div className="w-full flex mx-auto justify-center">
                <button
                  type="button"
                  class="px-8 py-3 text-base font-medium text-center text-white bg-blue-700 rounded-full hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onClick={handleChangeLanguage}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ChooseLanguage;
