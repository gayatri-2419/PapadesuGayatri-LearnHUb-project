// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CreateCourse from './pages/CreateCourse';
import MyCourses from './pages/MyCourses';
import AdminDashboard from './pages/AdminDashboard';

import './styles/global.css'; // ✅ Ensure this path is correct

const App = () => {
  return (
    <div className="app-background"> {/* ✅ Background wrapper */}
      <Navbar />
      <div className="container mt-4 content-wrapper"> {/* Optional content wrapper */}
        <Routes>
          <Route path="/" element={<h2>Welcome to LearnHub</h2>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/create-course" element={<CreateCourse />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
