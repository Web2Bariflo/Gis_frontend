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
import { Canvas } from './components/adminPages/Canvas';
import { Cluster } from './components/userpages/Cluster';
import { ClusterView } from './components/adminPages/ClusterView';
import { ToastContainer } from 'react-toastify';
import { TaskAssignClusters } from './components/userpages/TaskAssignClusters';
import PondList from './components/adminPages/PondList';
import { ClusterforDrawPicture } from './components/adminPages/ClusterforDrawPicture';

function App() {
  return (
      <Router>
        <ToastContainer />
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route element={<AdminPageOne />} path='/admin-dashboard' />
            <Route element={<AdminBasePage />} path="/admin-add-pond/:id" />
            <Route element={<ClusterView />} path="/admin-cluster-view" />
            <Route element={<PondList />} path="/admin-pond-list/:id" />
            <Route element={<ClusterforDrawPicture />} path="/cluster-for-picture" />
            <Route element={<Canvas />} path="/canvas-draw/:id" />
            <Route element={<PondDetails />} path="/pond-details/:id" />
            <Route element={<UserPageOne />} path="/user-dashboard/:clusterid" />
            <Route element={<Cluster />} path="/user-cluster-list" />
            <Route element={<UserDashboard />} path="/user-pond-details/:id" />
            <Route element={<Analytics />} path="/analytics" />
            <Route element={<Taskassign />} path="/task-asign/:userId" />
            <Route element={<TaskAssignClusters />} path="/task-asign-clusters" />
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
