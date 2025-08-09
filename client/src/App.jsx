  import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ShopkeeperHub from './pages/ShopkeeperHub.jsx';
import Navbar from './components/Navbar.jsx';
import './App.css';
import About from './pages/About.jsx';

import Cart from './components/Cart';

// Dashboard wrapper to handle role from navigation state
function DashboardWrapper({ cart, setCart, onAddToCart, onShowCart }) {
  const location = useLocation();
  const role = location.state?.role || localStorage.getItem('userRole') || 'customer';
  
  return (
    <Dashboard 
      cart={cart} 
      setCart={setCart} 
      onAddToCart={onAddToCart} 
      onShowCart={onShowCart} 
      role={role} 
    />
  );
}

function App() {
  const [cart, setCart] = React.useState([]);
  const [showCart, setShowCart] = React.useState(false);

  // Add to cart handler to pass to Dashboard
  const handleAddToCart = (product) => {
    setCart(prev => [...prev, product]);
  };

  return (
    <Router>
      <Navbar cartCount={cart.length} onCartClick={() => setShowCart(true)} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DashboardWrapper cart={cart} setCart={setCart} onAddToCart={handleAddToCart} onShowCart={() => setShowCart(true)} />} />
        <Route path="/shopkeeper" element={<ShopkeeperHub />} />
      </Routes>
      {showCart && (
        <Cart cartItems={cart} onClose={() => setShowCart(false)} />
      )}
    </Router>
  );
}

export default App;