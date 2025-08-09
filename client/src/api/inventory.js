const API_BASE = 'http://localhost:5000';

// Add a new inventory item
export const addInventoryItem = async (shopkeeperId, itemData) => {
  try {
    const response = await fetch(`${API_BASE}/api/shopkeeper/inventory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        shopkeeperId,
        ...itemData
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding inventory item:', error);
    throw error;
  }
};

// Get shop inventory
export const getShopInventory = async (shopkeeperId) => {
  try {
    const response = await fetch(`${API_BASE}/api/shopkeeper/inventory/${shopkeeperId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching inventory:', error);
    throw error;
  }
};

// Get customer requests for shopkeeper
export const getCustomerRequests = async (shopkeeperId) => {
  try {
    const response = await fetch(`${API_BASE}/api/shopkeeper/requests/${shopkeeperId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching customer requests:', error);
    throw error;
  }
};

// Update inventory item
export const updateInventoryItem = async (itemId, updates) => {
  try {
    const response = await fetch(`${API_BASE}/api/shopkeeper/inventory/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating inventory item:', error);
    throw error;
  }
};

// Delete inventory item
export const deleteInventoryItem = async (itemId) => {
  try {
    const response = await fetch(`${API_BASE}/api/shopkeeper/inventory/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    throw error;
  }
};
