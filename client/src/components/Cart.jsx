import React from 'react';
import './Cart.css';

function Cart({ cartItems, onClose }) {
  const total = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);
  return (
    <div className="cart-overlay">
      <div className="cart-modal">
        <h2>Your Cart</h2>
        {cartItems.length === 0 ? (
          <p className="cart-empty">Your cart is empty.</p>
        ) : (
          <ul className="cart-list">
            {cartItems.map((item, idx) => (
              <li key={idx} className="cart-item">
                <img src={item.imageUrl} alt={item.itemName} className="cart-img-rect" />
                <div className="cart-info">
                  <span className="cart-item-name">{item.itemName}</span>
                  <span className="cart-item-shop">{item.shopName}</span>
                  <span className="cart-item-price">₹{item.price}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="cart-total">
          <span>Total:</span>
          <span className="cart-total-amount">₹{total}</span>
        </div>
        <button className="modern-add-cart-btn solid-green-btn" style={{marginTop: '0.5rem'}} onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default Cart;
