// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AdminUsers from './pages/AdminUsers';
import AdminCourses from './pages/AdminCourses';
import UserDashboard from './pages/UserDashboard';
import CertificateValidation from './components/CertificateValidation';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />

          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/courses" element={<AdminCourses />} />

          <Route path="/student/enrollments" element={<UserDashboard />} />
          <Route path="/certificate/validate" element={<CertificateValidation />} />
          
        </Routes>
      </div>
    </Router>
  );
};

export default App;
