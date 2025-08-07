import React from "react";
import { Link } from "react-router-dom";


const Navbar = ({ cartCount = 0, onCartClick }) => {
    const [open, setOpen] = React.useState(false);
    // Fallback styles for when Tailwind is not present
    const navStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 0.5vw', // ultra slim horizontal padding
        borderBottom: '1px solid #43a047',
        background: 'linear-gradient(90deg, #43a047 60%, #388e3c 100%)',
        position: 'relative',
        fontFamily: 'Montserrat, Arial, sans-serif',
        minHeight: 38,
        zIndex: 10
    };
    const menuStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: 32
    };
    const logoStyle = {
        height: 72,
        marginRight: 4
    };
    const navLinkStyle = {
        color: '#fff',
        textDecoration: 'none',
        fontWeight: 500,
        fontSize: 16,
        marginRight: 8,
        transition: 'color 0.2s'
    };
    const loginBtnStyle = {
        cursor: 'pointer',
        padding: '8px 24px',
        background: '#43a047',
        color: '#fff',
        borderRadius: 9999,
        border: 'none',
        fontWeight: 600,
        fontSize: 16,
        marginLeft: 8,
        boxShadow: '0 2px 8px rgba(44, 62, 80, 0.08)',
        transition: 'background 0.2s, transform 0.2s'
    };
    return (
        <nav style={navStyle}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                <img src="/final_logoo0.svg" alt="Grocefy Logo" style={logoStyle} />
                <span style={{ fontWeight: 700, fontSize: 24, color: '#fff', letterSpacing: 1, marginLeft: 8, textShadow: '0 2px 8px rgba(44,62,80,0.10)' }}>Grocefy</span>
            </Link>
            {/* Desktop Menu */}
            <div style={menuStyle} className="navbar-menu-desktop">
                <Link to="/" style={navLinkStyle}>Home</Link>
                <Link to="/about" style={navLinkStyle}>About</Link>
                <Link to="/contact" style={navLinkStyle}>Contact</Link>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #fff', borderRadius: 9999, padding: '0 12px', marginLeft: 8, background: 'rgba(255,255,255,0.10)' }}>
                    <input style={{ padding: '6px 0', border: 'none', outline: 'none', background: 'transparent', fontSize: 15, width: 120, color: '#fff', '::placeholder': { color: '#e0e0e0' } }} type="text" placeholder="Search products" />
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.836 10.615 15 14.695" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        <path clipRule="evenodd" d="M9.141 11.738c2.729-1.136 4.001-4.224 2.841-6.898S7.67.921 4.942 2.057C2.211 3.193.94 6.281 2.1 8.955s4.312 3.92 7.041 2.783" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <div style={{ position: 'relative', marginLeft: 8, marginRight: 8, cursor: 'pointer' }} onClick={onCartClick} title="View Cart">
                    <svg width="18" height="18" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <button style={{ position: 'absolute', top: -8, right: -12, fontSize: 12, color: '#43a047', background: '#fff', width: 18, height: 18, borderRadius: '50%', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, fontWeight: 700 }}>{cartCount}</button>
                </div>
                <Link to="/login" style={loginBtnStyle}>Login</Link>
            </div>
            {/* Mobile Menu Button */}
            <button onClick={() => setOpen(!open)} aria-label="Menu" style={{ display: 'none', background: 'none', border: 'none' }} className="navbar-menu-mobile-btn">
                <svg width="28" height="20" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="21" height="1.5" rx=".75" fill="#426287" />
                    <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#426287" />
                    <rect x="6" y="13" width="15" height="1.5" rx=".75" fill="#426287" />
                </svg>
            </button>
            {/* Mobile Menu (hidden by default, add your own logic for mobile) */}
            {/*
            <div style={{ display: open ? 'flex' : 'none', position: 'absolute', top: 60, left: 0, width: '100%', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', flexDirection: 'column', alignItems: 'flex-start', gap: 8, padding: 20, fontSize: 15, zIndex: 20 }}>
                <Link to="/" style={navLinkStyle}>Home</Link>
                <Link to="/about" style={navLinkStyle}>About</Link>
                <Link to="/contact" style={navLinkStyle}>Contact</Link>
                <Link to="/login" style={{ ...loginBtnStyle, marginLeft: 0, marginTop: 8, fontSize: 15 }}>Login</Link>
            </div>
            */}
        </nav>
    );  
};

export default Navbar;
