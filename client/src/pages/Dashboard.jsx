import React, { useState, useEffect } from 'react';
import TProductCard from '../components/TProductCard';
import Cart from '../components/Cart';
import { fetchItems } from '../api/items';
import { addShopToUser, getNearbyShops, getUserShops } from '../api/shops';

const Dashboard = ({ role, cart, setCart, onAddToCart, onShowCart }) => {
  const [showListModal, setShowListModal] = useState(false);
  const [showShopCodeModal, setShowShopCodeModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [item, setItem] = useState('');
  const [groceryList, setGroceryList] = useState([]);
  const [shopCode, setShopCode] = useState('');
  const [shopCodeMsg, setShopCodeMsg] = useState('');
  const [locationMsg, setLocationMsg] = useState('');
  const [userShops, setUserShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [nearbyShops, setNearbyShops] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get userId from localStorage (assumes it's set at login)
  const userId = localStorage.getItem('userId');

  // Load products and user shops on mount
  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchItems();
        setItems(data || []);
      } catch (err) {
        setError('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };
    const loadUserShops = async () => {
      if (!userId) return;
      try {
        const shops = await getUserShops(userId);
        setUserShops(shops || []);
      } catch (err) {
        // Optionally show error
      }
    };
    loadItems();
    loadUserShops();
  }, [userId]);

  const handleGetLocation = () => {
    setLocationMsg('Fetching nearby shops...');
    if (!navigator.geolocation) {
      setLocationMsg('Geolocation not supported.');
      return;
    }
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { longitude, latitude } = pos.coords;
        const shops = await getNearbyShops(longitude, latitude);
        setNearbyShops(shops || []);
        setLocationMsg('Nearby shops loaded.');
      } catch (err) {
        setLocationMsg('Failed to fetch nearby shops.');
      }
    }, () => setLocationMsg('Location access denied.'));
  };

  // Use the handler from props if provided, else fallback
  const handleAddToCart = onAddToCart || ((product) => setCart([...cart, product]));

  const handleAddShopCode = async (e) => {
    e.preventDefault();
    if (shopCode.trim().length !== 7) {
      setShopCodeMsg('Shop code must be 7 digits.');
      return;
    }
    if (!userId) {
      setShopCodeMsg('User not logged in.');
      return;
    }
    try {
      const res = await addShopToUser(userId, shopCode);
      setShopCodeMsg('Shop added successfully!');
      setUserShops(prev => [...prev, res.shop]);
    } catch (err) {
      setShopCodeMsg(err.response?.data?.message || 'Failed to add shop.');
    }
    setShopCode('');
    setTimeout(() => {
      setShopCodeMsg('');
      setShowShopCodeModal(false);
    }, 1500);
  };

  const shopCodeModal = showShopCodeModal && (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Enter Shop Code</h3>
        <form onSubmit={handleAddShopCode}>
          <input
            type="text"
            value={shopCode}
            onChange={(e) => setShopCode(e.target.value)}
            placeholder="Enter 7-digit shop code"
            style={{ padding: '0.5rem', width: '100%' }}
            required
          />
          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setShowShopCodeModal(false)} style={{ marginRight: '1rem' }}>Cancel</button>
            <button type="submit">Add</button>
          </div>
          {shopCodeMsg && (
            <div style={{ color: shopCodeMsg.includes('added') ? 'green' : 'red', fontSize: 13, marginTop: 8 }}>
              {shopCodeMsg}
            </div>
          )}
        </form>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-flex">
        {role === 'customer' || role === 'shopkeeper' ? (
          <div className="dashboard-sidebar">
            <h2 style={{ marginBottom: '2rem', color: '#6C63FF' }}>Features</h2>
            {role === 'customer' ? (
              <>
                <button className="sidebar-btn" onClick={() => setShowListModal(true)}>Add Grocery List</button>
                <button className="sidebar-btn" onClick={() => setShowShopCodeModal(true)} style={{ width: '100%' }}>Add Shop by Code</button>
                <button className="sidebar-btn" onClick={handleGetLocation} style={{ width: '100%' }}>Suggest Shops Nearby</button>
                {locationMsg && <div style={{ color: '#888', fontSize: 13 }}>{locationMsg}</div>}
                <div style={{ marginTop: 16 }}>
                  <strong>My Shops:</strong>
                  <ul style={{ paddingLeft: 16, fontSize: 15 }}>
                    {userShops.length === 0 ? (
                      <li style={{ color: '#888' }}>No shops added</li>
                    ) : (
                      userShops.map(shop => (
                        <li key={shop._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span>{shop.name} ({shop.code})</span>
                          <button style={{ marginLeft: 8, fontSize: 13, padding: '2px 10px', borderRadius: 6, background: '#e8f5e9', color: '#388e3c', border: 'none', cursor: 'pointer' }} onClick={() => setSelectedShop(shop)}>View</button>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
                {nearbyShops.length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <strong>Nearby Shops:</strong>
                    <ul style={{ paddingLeft: 16, fontSize: 15 }}>
                      {nearbyShops.map(shop => (
                        <li key={shop._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span>{shop.name} ({shop.code})</span>
                          <button style={{ marginLeft: 8, fontSize: 13, padding: '2px 10px', borderRadius: 6, background: '#e3f2fd', color: '#1976d2', border: 'none', cursor: 'pointer' }} onClick={() => setSelectedShop(shop)}>View</button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
      {/* Shop view modal */}
      {selectedShop && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Shop: {selectedShop.name}</h3>
            <p><strong>Code:</strong> {selectedShop.code}</p>
            <p><strong>Address:</strong> {selectedShop.address || 'N/A'}</p>
            <button style={{ marginTop: 12 }} onClick={() => setSelectedShop(null)}>Close</button>
          </div>
        </div>
      )}
                <button className="sidebar-btn" disabled>My Orders</button>
              </>
            ) : (
              <>
                <button className="sidebar-btn" onClick={() => setShowInventoryModal(true)}>Add Inventory Item</button>
                <button className="sidebar-btn" disabled>Customer Requests</button>
                <button className="sidebar-btn" disabled>Shop Performance</button>
              </>
            )}
          </div>
        ) : null}

        <div className="dashboard-main">
          <h1 style={{ color: '#43a047', marginBottom: '1rem' }}>Dashboard</h1>
          <p style={{ color: '#444', marginBottom: '2rem' }}>
            Welcome! Browse products from all shops below.
          </p>

          <div className="product-list-area">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2>Browse Products</h2>
              <button className="modern-add-cart-btn solid-green-btn" style={{ width: 'auto', marginBottom: 0 }} onClick={onShowCart}>
                🛒 View Cart ({cart.length})
              </button>
            </div>

            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>Loading products...</div>
            ) : error ? (
              <div style={{ color: 'red', padding: '2rem', textAlign: 'center' }}>{error}</div>
            ) : (
              <div className="product-list">
                {items.length === 0 ? (
                  <div style={{ color: '#888', padding: '2rem', textAlign: 'center' }}>No products found.</div>
                ) : (
                  items.map((prod, idx) => (
                    <TProductCard
                      key={prod._id || idx}
                      shopName={prod.shopName}
                      itemName={prod.itemName}
                      imageUrl={prod.imageUrl}
                      expiryDate={prod.expiryDate}
                      price={prod.price}
                      onAddToCart={() => handleAddToCart(prod)}
                    />
                  ))
                )}
              </div>
            )}

            {/* Cart modal is now handled by App.jsx */}
          </div>

          {role === 'customer' && showListModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Add Grocery Item</h3>
                <form onSubmit={e => {
                  e.preventDefault();
                  if (item.trim()) {
                    setGroceryList([...groceryList, item.trim()]);
                    setItem('');
                    setShowListModal(false);
                  }
                }}>
                  <input
                    type="text"
                    value={item}
                    onChange={e => setItem(e.target.value)}
                    placeholder="Enter item name"
                    style={{ padding: '0.5rem', width: '100%' }}
                    autoFocus
                    required
                  />
                  <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={() => setShowListModal(false)} style={{ marginRight: '1rem' }}>Cancel</button>
                    <button type="submit">Add</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {shopCodeModal}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
