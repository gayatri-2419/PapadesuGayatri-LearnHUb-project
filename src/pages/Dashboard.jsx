// src/pages/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="container mt-4">
      <h2>Welcome, {user?.name || 'User'}!</h2>
      <p>Role: {user?.type}</p>

      {user?.type === 'admin' && (
        <Link to="/admin-dashboard" className="btn btn-dark m-2">Admin Dashboard</Link>
      )}

      {(user?.type === 'teacher' || user?.type === 'student') && (
        <>
          {user?.type === 'teacher' && (
            <Link to="/create-course" className="btn btn-primary m-2">Create Course</Link>
          )}
          <Link to="/my-courses" className="btn btn-warning m-2">My Courses</Link>
        </>
      )}

      <Link to="/courses" className="btn btn-info m-2">Browse Courses</Link>
    </div>
  );
};

export default Dashboard;
