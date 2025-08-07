import React, { useState } from 'react';
import axios from 'axios';


function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer'
  });
  const [message, setMessage] = useState('');
  const [shopDetails, setShopDetails] = useState(null);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setShopDetails(null);
    try {
      const res = await axios.post('/api/users/register', form);
      setMessage(res.data.message);
      if (form.role === 'shopkeeper' && res.data.user) {
        setShopDetails({
          shopCode: res.data.user.shopCode,
          paymentStatus: res.data.user.paymentStatus
        });
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="home-container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required /><br /><br />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required /><br /><br />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required /><br /><br />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="customer">Customer</option>
          <option value="shopkeeper">Shopkeeper</option>
        </select><br /><br />
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
      {shopDetails && (
        <div style={{ marginTop: 24, background: '#e8f5e9', borderRadius: 10, padding: 16, color: '#388e3c' }}>
          <h3>Shopkeeper Registration Details</h3>
          <p><strong>Your Shop Code:</strong> {shopDetails.shopCode}</p>
          <p><strong>Payment Status:</strong> {shopDetails.paymentStatus === 'pending' ? 'Pending (Please complete payment to activate your shop)' : shopDetails.paymentStatus}</p>
        </div>
      )}
    </div>
  );
}

export default Register;