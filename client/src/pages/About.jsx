import React from 'react';
import '../App.css';

function About() {
  return (
    <>
      
      <div className="home-container" style={{ maxWidth: 700, marginTop: 60, marginBottom: 60 }}>
        <h1 style={{ color: '#43a047', fontWeight: 700, letterSpacing: 1 }}>About Grocefy</h1>
        <img
          src="/about-image.jpg"
          alt="About Grocefy"
          style={{ width: '100%', maxWidth: 340, borderRadius: 16, margin: '32px auto 24px auto', display: 'block', boxShadow: '0 4px 24px rgba(44,62,80,0.10)' }}
        />
        <p style={{ fontSize: 18, color: '#444', lineHeight: 1.7, marginBottom: 24 }}>
          Grocefy is a modern, user-friendly grocery management platform designed for everyone. Whether you are a customer looking to manage your grocery lists and favorite shops, or a shopkeeper wanting to track inventory and expiry dates, Grocefy makes it simple and efficient. Our mission is to connect local shops and customers, making grocery shopping smarter, faster, and more reliable.
        </p>
        <p style={{ fontSize: 16, color: '#555', marginBottom: 0 }}>
          <strong>Key Features:</strong>
          <ul style={{ textAlign: 'left', margin: '18px auto 0 auto', maxWidth: 500, color: '#388e3c', fontSize: 16, lineHeight: 1.6 }}>
            <li>Easy registration for customers and shopkeepers</li>
            <li>Unique shop codes for connecting with local stores</li>
            <li>Inventory and expiry notifications for shopkeepers</li>
            <li>Cash management and order request system</li>
            <li>Modern, accessible UI for all ages</li>
          </ul>
        </p>
        <p style={{ fontSize: 16, color: '#555', marginTop: 24 }}>
          Grocefy is built by passionate developers who believe in empowering local businesses and making daily life easier for everyone. Thank you for choosing Grocefy!
        </p>
      </div>
    </>
  );
}

export default About;
