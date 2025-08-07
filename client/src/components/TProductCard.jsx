import React from 'react';
import './ProductCard.css';

function TProductCard({ imageUrl, itemName, shopName, expiryDate, price, onAddToCart }) {
  // fallback image if imageUrl fails
  const fallbackImg = 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png';
  const [imgSrc, setImgSrc] = React.useState(imageUrl);
  return (
    <div className="product-card modern-card">
      <div className="modern-card-img-wrap-rect">
        <img
          src={imgSrc}
          alt={itemName}
          className="modern-card-img-rect"
          onError={() => setImgSrc(fallbackImg)}
        />
      </div>
      <div className="modern-card-info">
        <div className="modern-card-title">{itemName}</div>
        <div className="modern-card-shop">{shopName}</div>
        <div className="modern-card-expiry">Expiry: {new Date(expiryDate).toLocaleDateString()}</div>
        <div className="modern-card-price">₹{price}</div>
        {onAddToCart && (
          <button className="modern-add-cart-btn solid-green-btn" onClick={onAddToCart}>
            <span className="modern-cart-icon">🛒</span> Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}

export default TProductCard;
