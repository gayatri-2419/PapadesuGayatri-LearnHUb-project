// src/pages/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      alert(`Welcome, ${res.data.user.name}!`);
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.status === 400) {
        setError('User not found. Please register first.');
      } else {
        setError('Login failed. Try again.');
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2>Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="form-control mb-2"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="form-control mb-2"
          onChange={handleChange}
          required
        />
        <button className="btn btn-success">Login</button>
      </form>
      <div className="mt-3">
        <p>New user? <a href="/register">Register here</a></p>
      </div>
    </div>
  );
};

export default Login;
