import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Login() {
  const query = useQuery();
  const role = query.get('role') || 'customer';
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // Example endpoint, update as needed
      const res = await axios.post('/api/users/login', { ...form, role });
      setMessage(res.data.message || 'Login successful!');
      // Redirect to dashboard with role
      setTimeout(() => {
        navigate('/dashboard', { state: { role } });
      }, 800);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed');
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="home-container">
      <h1>Login as {role.charAt(0).toUpperCase() + role.slice(1)}</h1>
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required /><br /><br />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required /><br /><br />
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <button onClick={handleRegister}>Register</button></p>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;