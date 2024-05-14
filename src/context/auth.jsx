import React, { createContext, useContext, useState, useEffect } from "react";
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        user: null,
        token: "",
    });

    useEffect(() => {
        const data = localStorage.getItem('auth');
        if (data) {
            const parsedData = JSON.parse(data);
            setAuth({
                ...parsedData
            });
            axios.defaults.headers.common['Authorization'] = parsedData.token;
        }
    }, []);

    return (
        <AuthContext.Provider value={[ auth, setAuth ]}>
            {children}
        </AuthContext.Provider>
    );
};

// custom hook
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
