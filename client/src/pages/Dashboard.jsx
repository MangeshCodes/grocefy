import React, { useState, useEffect } from 'react';
import TProductCard from '../components/TProductCard';
import Cart from '../components/Cart';
import { fetchItems } from '../api/items';
import { addShopToUser, getNearbyShops, getUserShops } from '../api/shops';

const Dashboard = ({ role, cart, setCart, onAddToCart, onShowCart }) => {
  const [showListModal, setShowListModal] = useState(false);
  const [showShopCodeModal, setShowShopCodeModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [selectedView, setSelectedView] = useState('browse'); // Track current view
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
      <div className="modal-content" style={{
        background: '#fff',
        padding: '2rem',
        borderRadius: '16px',
        minWidth: '400px',
        boxShadow: '0 8px 32px rgba(44, 62, 80, 0.15)',
        border: '1px solid #e0e0e0'
      }}>
        <h3 style={{ color: '#43a047', marginTop: 0 }}>Enter Shop Code</h3>
        <form onSubmit={handleAddShopCode}>
          <input
            type="text"
            value={shopCode}
            onChange={(e) => setShopCode(e.target.value)}
            placeholder="Enter 7-digit shop code"
            style={{ 
              padding: '0.7rem', 
              width: '100%',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '1rem',
              marginBottom: '1rem'
            }}
            required
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button 
              type="button" 
              onClick={() => setShowShopCodeModal(false)}
              style={{
                background: '#f5f5f5',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '0.7rem 1.5rem',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button 
              type="submit"
              style={{
                background: 'linear-gradient(90deg, #43a047 60%, #66bb6a 100%)',
                border: 'none',
                borderRadius: '8px',
                padding: '0.7rem 1.5rem',
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Add
            </button>
          </div>
          {shopCodeMsg && (
            <div style={{ 
              color: shopCodeMsg.includes('added') ? '#43a047' : '#d32f2f', 
              fontSize: '0.9rem', 
              marginTop: '1rem',
              padding: '0.5rem',
              borderRadius: '4px',
              background: shopCodeMsg.includes('added') ? '#e8f5e9' : '#ffebee',
              textAlign: 'center'
            }}>
              {shopCodeMsg}
            </div>
          )}
        </form>
      </div>
    </div>
  );

  return (
    <div className="home-container" style={{ maxWidth: '1200px', margin: '40px auto' }}>
      <div className="dashboard-content">
        <h1 style={{ color: '#43a047', marginBottom: '1rem', textAlign: 'center' }}>Dashboard</h1>
        <p className="subtitle" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          Welcome! {selectedView === 'browse' ? 'Browse products from all shops below.' : 'Manage your shops and explore new ones.'}
        </p>

        {role === 'customer' || role === 'shopkeeper' ? (
          <div className="dashboard-flex" style={{ 
            display: 'flex', 
            gap: '2rem', 
            alignItems: 'stretch',
            flexWrap: 'wrap',
            minHeight: '500px'
          }}>
            <div className="dashboard-sidebar" style={{
              minWidth: '240px',
              background: '#f8f9fa',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 4px 24px rgba(44, 62, 80, 0.10)',
              border: '1px solid #e9ecef'
            }}>
              <h3 style={{ marginBottom: '2rem', color: '#43a047', textAlign: 'center', fontSize: '1.3rem', fontWeight: '700' }}>Features</h3>
              {role === 'customer' ? (
                <div className="feature-buttons">
                  <button className="sidebar-btn" onClick={() => setSelectedView('browse')}>Browse Products</button>
                  <button className="sidebar-btn" onClick={() => setSelectedView('shops')}>View Shops</button>
                  <button className="sidebar-btn" onClick={() => setShowShopCodeModal(true)}>Add Shop by Code</button>
                  <button className="sidebar-btn" onClick={() => setShowListModal(true)}>Add Grocery List</button>
                  <button className="sidebar-btn" onClick={handleGetLocation}>Suggest Shops Nearby</button>
                  {locationMsg && <div style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem', textAlign: 'center' }}>{locationMsg}</div>}
                  <div style={{ marginTop: '1rem', padding: '1rem', background: '#fff', borderRadius: '12px', textAlign: 'center', border: '1px solid #e9ecef', boxShadow: '0 2px 8px rgba(44, 62, 80, 0.05)' }}>
                    <strong style={{ color: '#43a047', fontSize: '1rem' }}>My Shops: {userShops.length}</strong>
                  </div>
                  <button className="sidebar-btn" disabled style={{ opacity: 0.6 }}>My Orders</button>
                </div>
              ) : (
                <div className="feature-buttons">
                  <button className="sidebar-btn" onClick={() => setShowInventoryModal(true)}>Add Inventory Item</button>
                  <button className="sidebar-btn" disabled style={{ opacity: 0.6 }}>Customer Requests</button>
                  <button className="sidebar-btn" disabled style={{ opacity: 0.6 }}>Shop Performance</button>
                </div>
              )}
            </div>

            <div className="dashboard-main" style={{ 
              flex: 1, 
              background: '#fff',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 4px 24px rgba(44, 62, 80, 0.10)',
              minHeight: '500px'
            }}>
              {selectedView === 'browse' ? (
                // Browse Products View
                <div className="product-list-area">
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '2rem',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <h2 style={{ color: '#43a047', margin: 0 }}>Browse Products</h2>
                    <button 
                      className="modern-add-cart-btn solid-green-btn" 
                      onClick={onShowCart}
                      style={{ 
                        background: 'linear-gradient(90deg, #43a047 60%, #66bb6a 100%)',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.7rem 1.5rem',
                        color: 'white',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      🛒 View Cart ({cart.length})
                    </button>
                  </div>

                  {loading ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>
                      <div style={{ fontSize: '1.1rem' }}>Loading products...</div>
                    </div>
                  ) : error ? (
                    <div style={{ 
                      color: '#d32f2f', 
                      padding: '2rem', 
                      textAlign: 'center',
                      background: '#ffebee',
                      borderRadius: '8px',
                      border: '1px solid #ffcdd2'
                    }}>
                      {error}
                    </div>
                  ) : (
                    <div className="product-list" style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                      gap: '1.5rem',
                      marginTop: '1rem'
                    }}>
                      {items.length === 0 ? (
                        <div style={{ 
                          color: '#666', 
                          padding: '3rem', 
                          textAlign: 'center',
                          gridColumn: '1 / -1',
                          background: '#f5f5f5',
                          borderRadius: '8px'
                        }}>
                          No products found.
                        </div>
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
                </div>
              ) : (
                // View Shops
                <div className="shops-view-area">
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '2rem',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <h2 style={{ color: '#43a047', margin: 0 }}>My Shops</h2>
                    <button 
                      className="modern-add-cart-btn solid-green-btn" 
                      onClick={() => setShowShopCodeModal(true)}
                      style={{ 
                        background: 'linear-gradient(90deg, #43a047 60%, #66bb6a 100%)',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.7rem 1.5rem',
                        color: 'white',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      ➕ Add Shop by Code
                    </button>
                  </div>

                  <div className="shops-grid" style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                    gap: '1.5rem' 
                  }}>
                    {userShops.length === 0 ? (
                      <div style={{ 
                        color: '#666', 
                        padding: '3rem', 
                        textAlign: 'center', 
                        gridColumn: '1 / -1',
                        background: '#f5f5f5',
                        borderRadius: '8px'
                      }}>
                        No shops added yet. Add a shop using its unique code!
                      </div>
                    ) : (
                      userShops.map(shop => (
                        <div key={shop._id} className="shop-card" style={{
                          background: '#fff',
                          borderRadius: '16px',
                          boxShadow: '0 4px 18px rgba(67, 160, 71, 0.10)',
                          padding: '1.5rem',
                          border: '1.5px solid #c8e6c9',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          cursor: 'pointer'
                        }}>
                          <h3 style={{ color: '#43a047', marginBottom: '0.5rem', fontSize: '1.2rem' }}>{shop.name}</h3>
                          <p style={{ color: '#6C63FF', marginBottom: '0.5rem', fontWeight: '600' }}>Code: {shop.code}</p>
                          <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>
                            Address: {shop.address || 'Not provided'}
                          </p>
                          <button 
                            style={{ 
                              width: '100%', 
                              background: 'linear-gradient(90deg, #43a047 60%, #66bb6a 100%)',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '0.7rem 1rem',
                              color: 'white',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onClick={() => setSelectedShop(shop)}
                          >
                            View Details
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {nearbyShops.length > 0 && (
                    <div style={{ marginTop: '3rem' }}>
                      <h3 style={{ color: '#43a047', marginBottom: '1.5rem', textAlign: 'center' }}>Nearby Shops</h3>
                      <div className="shops-grid" style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                        gap: '1.5rem' 
                      }}>
                        {nearbyShops.map(shop => (
                          <div key={shop._id} className="shop-card" style={{
                            background: '#fff',
                            borderRadius: '16px',
                            boxShadow: '0 4px 18px rgba(33, 150, 243, 0.10)',
                            padding: '1.5rem',
                            border: '1.5px solid #bbdefb',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            cursor: 'pointer'
                          }}>
                            <h3 style={{ color: '#1976d2', marginBottom: '0.5rem', fontSize: '1.2rem' }}>{shop.name}</h3>
                            <p style={{ color: '#6C63FF', marginBottom: '0.5rem', fontWeight: '600' }}>Code: {shop.code}</p>
                            <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>
                              Address: {shop.address || 'Not provided'}
                            </p>
                            <button 
                              style={{ 
                                width: '100%', 
                                background: '#1976d2',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '0.7rem 1rem',
                                color: 'white',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onClick={() => setSelectedShop(shop)}
                            >
                              View Details
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem',
            color: '#666',
            background: '#f5f5f5',
            borderRadius: '8px'
          }}>
            <p>Please log in to access dashboard features.</p>
          </div>
        )}

        {/* Shop view modal */}
        {selectedShop && (
          <div className="modal-overlay">
            <div className="modal-content" style={{
              background: '#fff',
              padding: '2rem',
              borderRadius: '16px',
              minWidth: '400px',
              boxShadow: '0 8px 32px rgba(44, 62, 80, 0.15)',
              border: '1px solid #e0e0e0'
            }}>
              <h3 style={{ color: '#43a047', marginTop: 0 }}>Shop: {selectedShop.name}</h3>
              <p><strong>Code:</strong> {selectedShop.code}</p>
              <p><strong>Address:</strong> {selectedShop.address || 'N/A'}</p>
              <button 
                style={{ 
                  marginTop: '1.5rem',
                  background: 'linear-gradient(90deg, #43a047 60%, #66bb6a 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.7rem 1.5rem',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer'
                }} 
                onClick={() => setSelectedShop(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {role === 'customer' && showListModal && (
          <div className="modal-overlay">
            <div className="modal-content" style={{
              background: '#fff',
              padding: '2rem',
              borderRadius: '16px',
              minWidth: '400px',
              boxShadow: '0 8px 32px rgba(44, 62, 80, 0.15)',
              border: '1px solid #e0e0e0'
            }}>
              <h3 style={{ color: '#43a047', marginTop: 0 }}>Add Grocery Item</h3>
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
                  style={{ 
                    padding: '0.7rem', 
                    width: '100%',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    marginBottom: '1rem'
                  }}
                  autoFocus
                  required
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                  <button 
                    type="button" 
                    onClick={() => setShowListModal(false)}
                    style={{
                      background: '#f5f5f5',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      padding: '0.7rem 1.5rem',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    style={{
                      background: 'linear-gradient(90deg, #43a047 60%, #66bb6a 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.7rem 1.5rem',
                      color: 'white',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {shopCodeModal}
      </div>
    </div>
  );
};

export default Dashboard;
