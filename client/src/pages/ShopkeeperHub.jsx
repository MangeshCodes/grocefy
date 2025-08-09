import React, { useState, useEffect, useCallback } from 'react';
import { addInventoryItem, getShopInventory, getCustomerRequests } from '../api/inventory';

const ShopkeeperHub = () => {
  const [selectedView, setSelectedView] = useState('inventory');
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [customerRequests, setCustomerRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form state for adding new item
  const [newItem, setNewItem] = useState({
    itemName: '',
    price: '',
    expiryDate: '',
    imageUrl: '',
    description: '',
    category: 'grocery',
    stock: ''
  });
  const [itemMessage, setItemMessage] = useState('');

  // Get shopkeeper info from localStorage
  const shopkeeperId = localStorage.getItem('userId');
  const shopCode = localStorage.getItem('shopCode') || 'SHOP001';

  const loadInventory = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getShopInventory(shopkeeperId);
      setInventory(data || []);
    } catch (err) {
      setError('Failed to load inventory.');
    } finally {
      setLoading(false);
    }
  }, [shopkeeperId]);

  const loadCustomerRequests = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getCustomerRequests(shopkeeperId);
      setCustomerRequests(data || []);
    } catch (err) {
      setError('Failed to load customer requests.');
    } finally {
      setLoading(false);
    }
  }, [shopkeeperId]);

  useEffect(() => {
    const loadData = async () => {
      if (selectedView === 'inventory') {
        await loadInventory();
      } else if (selectedView === 'requests') {
        await loadCustomerRequests();
      }
    };
    
    if (shopkeeperId) {
      loadData();
    }
  }, [selectedView, shopkeeperId, loadInventory, loadCustomerRequests]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!shopkeeperId) {
      setItemMessage('Shop information not found.');
      return;
    }

    try {
      const itemData = {
        ...newItem,
        shopkeeperId,
        shopCode,
        dateAdded: new Date().toISOString()
      };
      
      await addInventoryItem(itemData);
      setItemMessage('Item added successfully!');
      setNewItem({
        itemName: '',
        price: '',
        expiryDate: '',
        imageUrl: '',
        description: '',
        category: 'grocery',
        stock: ''
      });
      
      // Reload inventory
      loadInventory();
      
      setTimeout(() => {
        setItemMessage('');
        setShowAddItemModal(false);
      }, 2000);
    } catch (err) {
      setItemMessage(err.response?.data?.message || 'Failed to add item.');
    }
  };

  const addItemModal = showAddItemModal && (
    <div className="modal-overlay">
      <div className="modal-content" style={{
        background: '#fff',
        padding: '2rem',
        borderRadius: '16px',
        minWidth: '500px',
        maxWidth: '600px',
        boxShadow: '0 8px 32px rgba(44, 62, 80, 0.15)',
        border: '1px solid #e0e0e0',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        <h3 style={{ color: '#43a047', marginTop: 0, marginBottom: '1.5rem' }}>Add New Item to Inventory</h3>
        <form onSubmit={handleAddItem}>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Item Name *</label>
              <input
                type="text"
                name="itemName"
                value={newItem.itemName}
                onChange={handleInputChange}
                placeholder="Enter item name"
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={newItem.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Stock Quantity *</label>
                <input
                  type="number"
                  name="stock"
                  value={newItem.stock}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Expiry Date *</label>
              <input
                type="date"
                name="expiryDate"
                value={newItem.expiryDate}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Category</label>
              <select
                name="category"
                value={newItem.category}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              >
                <option value="grocery">Grocery</option>
                <option value="fruits">Fruits</option>
                <option value="vegetables">Vegetables</option>
                <option value="dairy">Dairy</option>
                <option value="beverages">Beverages</option>
                <option value="snacks">Snacks</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Image URL</label>
              <input
                type="url"
                name="imageUrl"
                value={newItem.imageUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Description</label>
              <textarea
                name="description"
                value={newItem.description}
                onChange={handleInputChange}
                placeholder="Enter item description"
                rows="3"
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <button
              type="button"
              onClick={() => setShowAddItemModal(false)}
              style={{
                background: '#f5f5f5',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '0.8rem 1.5rem',
                cursor: 'pointer',
                fontWeight: '600'
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
                padding: '0.8rem 1.5rem',
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Add Item
            </button>
          </div>

          {itemMessage && (
            <div style={{
              color: itemMessage.includes('success') ? '#43a047' : '#d32f2f',
              fontSize: '0.9rem',
              marginTop: '1rem',
              padding: '0.8rem',
              borderRadius: '8px',
              background: itemMessage.includes('success') ? '#e8f5e9' : '#ffebee',
              textAlign: 'center'
            }}>
              {itemMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );

  return (
    <div className="home-container" style={{ maxWidth: '1200px', margin: '40px auto' }}>
      <div className="shopkeeper-content">
        <h1 style={{ color: '#43a047', marginBottom: '1rem', textAlign: 'center' }}>Shopkeeper Hub</h1>
        <p className="subtitle" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          Manage your shop inventory and view customer requests
        </p>

        <div className="dashboard-flex" style={{
          display: 'flex',
          gap: '2rem',
          alignItems: 'stretch',
          flexWrap: 'wrap',
          minHeight: '500px'
        }}>
          {/* Features Sidebar */}
          <div className="dashboard-sidebar" style={{
            minWidth: '240px',
            background: '#f8f9fa',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 4px 24px rgba(44, 62, 80, 0.10)',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ marginBottom: '2rem', color: '#43a047', textAlign: 'center', fontSize: '1.3rem', fontWeight: '700' }}>Shop Management</h3>
            
            <div className="feature-buttons">
              <button 
                className="sidebar-btn" 
                onClick={() => setSelectedView('inventory')}
                style={{ 
                  background: selectedView === 'inventory' ? 'linear-gradient(90deg, #388e3c 60%, #43a047 100%)' : 'linear-gradient(90deg, #43a047 60%, #66bb6a 100%)'
                }}
              >
                📦 View Inventory
              </button>
              <button 
                className="sidebar-btn" 
                onClick={() => setShowAddItemModal(true)}
              >
                ➕ Add New Item
              </button>
              <button 
                className="sidebar-btn" 
                onClick={() => setSelectedView('requests')}
                style={{ 
                  background: selectedView === 'requests' ? 'linear-gradient(90deg, #388e3c 60%, #43a047 100%)' : 'linear-gradient(90deg, #43a047 60%, #66bb6a 100%)'
                }}
              >
                📋 Customer Requests
              </button>
              <button className="sidebar-btn" disabled style={{ opacity: 0.6 }}>
                📊 Sales Analytics
              </button>
              <button className="sidebar-btn" disabled style={{ opacity: 0.6 }}>
                ⚙️ Shop Settings
              </button>
            </div>

            <div style={{ marginTop: '1rem', padding: '1rem', background: '#fff', borderRadius: '12px', textAlign: 'center', border: '1px solid #e9ecef', boxShadow: '0 2px 8px rgba(44, 62, 80, 0.05)' }}>
              <strong style={{ color: '#43a047', fontSize: '1rem' }}>Shop Code: {shopCode}</strong>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="dashboard-main" style={{
            flex: 1,
            background: '#fff',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 4px 24px rgba(44, 62, 80, 0.10)',
            minHeight: '500px'
          }}>
            {selectedView === 'inventory' ? (
              // Inventory View
              <div className="inventory-area">
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '2rem',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <h2 style={{ color: '#43a047', margin: 0 }}>Shop Inventory</h2>
                  <button
                    onClick={() => setShowAddItemModal(true)}
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
                    ➕ Add New Item
                  </button>
                </div>

                {loading ? (
                  <div style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>
                    <div style={{ fontSize: '1.1rem' }}>Loading inventory...</div>
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
                  <div className="inventory-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '1.5rem',
                    marginTop: '1rem'
                  }}>
                    {inventory.length === 0 ? (
                      <div style={{
                        color: '#666',
                        padding: '3rem',
                        textAlign: 'center',
                        gridColumn: '1 / -1',
                        background: '#f5f5f5',
                        borderRadius: '8px'
                      }}>
                        No items in inventory. Add your first item to get started!
                      </div>
                    ) : (
                      inventory.map((item, idx) => (
                        <div key={item._id || idx} style={{
                          background: '#fff',
                          borderRadius: '16px',
                          boxShadow: '0 4px 18px rgba(67, 160, 71, 0.10)',
                          padding: '1.5rem',
                          border: '1.5px solid #c8e6c9',
                          transition: 'transform 0.2s, box-shadow 0.2s'
                        }}>
                          <div style={{
                            width: '100%',
                            height: '120px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            marginBottom: '1rem',
                            background: '#f8f9fa',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.itemName}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                                onError={(e) => {
                                  e.target.src = 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png';
                                }}
                              />
                            ) : (
                              <span style={{ color: '#999', fontSize: '0.9rem' }}>No Image</span>
                            )}
                          </div>
                          <h4 style={{ color: '#43a047', marginBottom: '0.5rem', fontSize: '1.1rem' }}>{item.itemName}</h4>
                          <p style={{ color: '#6C63FF', marginBottom: '0.5rem', fontWeight: '600' }}>₹{item.price}</p>
                          <p style={{ color: '#666', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                            Category: {item.category || 'General'}
                          </p>
                          <p style={{ color: '#666', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                            Stock: {item.stock || 'N/A'}
                          </p>
                          <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.85rem' }}>
                            Expires: {new Date(item.expiryDate).toLocaleDateString()}
                          </p>
                          {item.description && (
                            <p style={{ color: '#777', fontSize: '0.85rem', marginBottom: '1rem' }}>
                              {item.description}
                            </p>
                          )}
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
                          >
                            Edit Item
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ) : (
              // Customer Requests View
              <div className="requests-area">
                <h2 style={{ color: '#43a047', marginBottom: '2rem' }}>Customer Requests</h2>

                {loading ? (
                  <div style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>
                    <div style={{ fontSize: '1.1rem' }}>Loading customer requests...</div>
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
                  <div className="requests-list" style={{ marginTop: '1rem' }}>
                    {customerRequests.length === 0 ? (
                      <div style={{
                        color: '#666',
                        padding: '3rem',
                        textAlign: 'center',
                        background: '#f5f5f5',
                        borderRadius: '8px'
                      }}>
                        No customer requests yet.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {customerRequests.map((request, idx) => (
                          <div key={request._id || idx} style={{
                            background: '#fff',
                            borderRadius: '12px',
                            boxShadow: '0 2px 12px rgba(44, 62, 80, 0.08)',
                            padding: '1.5rem',
                            border: '1px solid #e0e0e0'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                              <div>
                                <h4 style={{ color: '#43a047', margin: '0 0 0.5rem 0' }}>{request.customerName}</h4>
                                <p style={{ color: '#666', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>
                                  Requested: {request.itemName}
                                </p>
                                <p style={{ color: '#777', margin: 0, fontSize: '0.85rem' }}>
                                  {new Date(request.requestDate).toLocaleDateString()}
                                </p>
                              </div>
                              <span style={{
                                background: request.status === 'pending' ? '#fff3cd' : '#d4edda',
                                color: request.status === 'pending' ? '#856404' : '#155724',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '12px',
                                fontSize: '0.8rem',
                                fontWeight: '600'
                              }}>
                                {request.status || 'Pending'}
                              </span>
                            </div>
                            {request.notes && (
                              <p style={{ color: '#555', fontSize: '0.9rem', fontStyle: 'italic' }}>
                                Notes: {request.notes}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {addItemModal}
      </div>
    </div>
  );
};

export default ShopkeeperHub;
