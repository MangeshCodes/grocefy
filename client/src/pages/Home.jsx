import React from 'react';
import { useNavigate } from 'react-router-dom';


function Home() {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    navigate(`/login?role=${role}`);
  };

  return (
    <div className="home-container">
      <h1>Welcome to Grocefy</h1>
      <p className="subtitle">Please select your role to continue:</p>
      <div className="role-buttons">
        <button onClick={() => handleRoleSelect('customer')}>Customer</button>
        <button onClick={() => handleRoleSelect('shopkeeper')}>Shopkeeper</button>
        <button onClick={() => handleRoleSelect('admin')}>Admin</button>
      </div>
    </div>
  );
}

export default Home;