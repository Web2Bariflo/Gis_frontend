import React from 'react';
import './App.css';
import Signup from './components/signup/Signup';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AdminBasePage from './components/adminPages/AdminBasePage';
import AdminPageOne from './components/adminPages/AdminPageOne';
import UserDashboard from './components/userpages/UserDashboard';
import PrivateRoute from './private/PrivateRoute';
import PageNotFound from './components/PageNotFound';
import UserPageOne from './components/userpages/UserPageOne';
import ChangePassword from './components/ChangePassword';
import ForgetPassword from './components/ForgetPassword';
import ChooseLanguage from './components/ChooseLanguage';
import PondDetails from './components/adminPages/PondDetails';
import { Analytics } from './components/userpages/Analytics';
import Taskassign from './components/userpages/Taskassign';

function App() {
  return (
      <Router>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route element={<AdminPageOne />} path='/admin-dashboard' />
            <Route element={<AdminBasePage />} path="/admin-add-pond/:id" />
            <Route element={<PondDetails />} path="/pond-details/:id" />
            <Route element={<UserPageOne />} path="/user-dashboard" />
            <Route element={<UserDashboard />} path="/user-pond-details/:id" />
            <Route element={<Analytics />} path="/analytics" />
            <Route element={<Taskassign />} path="/task-asign" />
            <Route element={<ChangePassword />} path="/change-password/:id" />
          </Route>
          <Route element={<ForgetPassword />}  path="/forget-password" />
          <Route element={<ChooseLanguage />} path="/change-language" />
          <Route path="/" element={<Signup />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
 
  );
}

export default App;
