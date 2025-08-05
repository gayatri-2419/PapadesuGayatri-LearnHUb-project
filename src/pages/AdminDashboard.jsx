import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [usersWithCourses, setUsersWithCourses] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('http://localhost:5000/api/auth/admin/user-courses', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setUsersWithCourses(res.data))
    .catch(err => console.error("Error fetching users with courses:", err));
  }, []);

  return (
    <div className="container">
      <h2 className="mb-4">Admin Dashboard</h2>
      <table className="table table-bordered table-hover">
        <thead className="table-primary">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Courses</th>
          </tr>
        </thead>
        <tbody>
          {usersWithCourses.map((user, index) => (
            <tr key={index}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.type}</td>
              <td>
                {user.courses.length > 0 ? (
                  <ul className="mb-0 ps-3">
                    {user.courses.map((course, i) => (
                      <li key={i}><strong>{course.title}</strong> - {course.description}</li>
                    ))}
                  </ul>
                ) : (
                  <em>No courses</em>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
