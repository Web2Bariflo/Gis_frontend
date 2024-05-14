import { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoute = () => {
  const auth = { token: localStorage.getItem('auth') };

  return auth ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;