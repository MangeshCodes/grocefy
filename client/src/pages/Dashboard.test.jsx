import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dashboard from './Dashboard';
import * as itemsApi from '../api/items';
import * as shopsApi from '../api/shops';

// Mock the API modules
jest.mock('../api/items');
jest.mock('../api/shops');

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn()
};
Object.defineProperty(navigator, 'geolocation', { value: mockGeolocation });

// Mock data
const mockItems = [
  {
    _id: '1',
    itemName: 'Apple',
    shopName: 'Fresh Market',
    price: 2.99,
    imageUrl: 'apple.jpg',
    expiryDate: '2025-08-15'
  },
  {
    _id: '2',
    itemName: 'Banana',
    shopName: 'Fruit Store',
    price: 1.99,
    imageUrl: 'banana.jpg',
    expiryDate: '2025-08-10'
  }
];

const mockShops = [
  {
    _id: 'shop1',
    name: 'Fresh Market',
    code: '1234567',
    address: '123 Main St'
  },
  {
    _id: 'shop2',
    name: 'Grocery Plus',
    code: '7654321',
    address: '456 Oak Ave'
  }
];

describe('Dashboard Component', () => {
  let mockCart = [];
  const mockSetCart = jest.fn();
  const mockOnAddToCart = jest.fn();
  const mockOnShowCart = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue('user123');
    itemsApi.fetchItems.mockResolvedValue(mockItems);
    shopsApi.getUserShops.mockResolvedValue(mockShops);
    shopsApi.getNearbyShops.mockResolvedValue([]);
    mockCart = [];
  });

  describe('Customer Role Tests', () => {
    test('renders dashboard with customer features', async () => {
      render(
        <Dashboard
          role="customer"
          cart={mockCart}
          setCart={mockSetCart}
          onAddToCart={mockOnAddToCart}
          onShowCart={mockOnShowCart}
        />
      );

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Features')).toBeInTheDocument();
      expect(screen.getByText('Browse Products')).toBeInTheDocument();
      expect(screen.getByText('View Shops')).toBeInTheDocument();
      expect(screen.getByText('Add Shop by Code')).toBeInTheDocument();
    });

    test('displays products in browse view by default', async () => {
      render(
        <Dashboard
          role="customer"
          cart={mockCart}
          setCart={mockSetCart}
          onAddToCart={mockOnAddToCart}
          onShowCart={mockOnShowCart}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Browse Products')).toBeInTheDocument();
      });

      // Should show products
      await waitFor(() => {
        expect(screen.getByText('Apple')).toBeInTheDocument();
      });
      
      expect(screen.getByText('Banana')).toBeInTheDocument();
    });

    test('switches to shops view when clicking View Shops', async () => {
      const user = userEvent.setup();
      
      render(
        <Dashboard
          role="customer"
          cart={mockCart}
          setCart={mockSetCart}
          onAddToCart={mockOnAddToCart}
          onShowCart={mockOnShowCart}
        />
      );

      // Click View Shops button
      const viewShopsBtn = screen.getByText('View Shops');
      await user.click(viewShopsBtn);

      // Should show shops view
      expect(screen.getByText('My Shops')).toBeInTheDocument();
      
      await waitFor(() => {
        expect(screen.getByText('Fresh Market')).toBeInTheDocument();
      });
      
      expect(screen.getByText('Grocery Plus')).toBeInTheDocument();
    });

    test('shows cart button with correct count', () => {
      const cartWithItems = [
        { _id: '1', itemName: 'Apple' },
        { _id: '2', itemName: 'Banana' }
      ];

      render(
        <Dashboard
          role="customer"
          cart={cartWithItems}
          setCart={mockSetCart}
          onAddToCart={mockOnAddToCart}
          onShowCart={mockOnShowCart}
        />
      );

      expect(screen.getByText('🛒 View Cart (2)')).toBeInTheDocument();
    });

    test('calls onShowCart when cart button is clicked', async () => {
      const user = userEvent.setup();
      
      render(
        <Dashboard
          role="customer"
          cart={mockCart}
          setCart={mockSetCart}
          onAddToCart={mockOnAddToCart}
          onShowCart={mockOnShowCart}
        />
      );

      const cartButton = screen.getByText('🛒 View Cart (0)');
      await user.click(cartButton);

      expect(mockOnShowCart).toHaveBeenCalledTimes(1);
    });
  });

  describe('Shop Code Modal Tests', () => {
    test('opens shop code modal when button is clicked', async () => {
      const user = userEvent.setup();
      
      render(
        <Dashboard
          role="customer"
          cart={mockCart}
          setCart={mockSetCart}
          onAddToCart={mockOnAddToCart}
          onShowCart={mockOnShowCart}
        />
      );

      const addShopBtn = screen.getByText('Add Shop by Code');
      await user.click(addShopBtn);

      expect(screen.getByText('Enter Shop Code')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter 7-digit shop code')).toBeInTheDocument();
    });

    test('validates shop code length', async () => {
      const user = userEvent.setup();
      
      render(
        <Dashboard
          role="customer"
          cart={mockCart}
          setCart={mockSetCart}
          onAddToCart={mockOnAddToCart}
          onShowCart={mockOnShowCart}
        />
      );

      // Open modal
      const addShopBtn = screen.getByText('Add Shop by Code');
      await user.click(addShopBtn);

      // Enter invalid code
      const input = screen.getByPlaceholderText('Enter 7-digit shop code');
      await user.type(input, '123');

      const submitBtn = screen.getByText('Add');
      await user.click(submitBtn);

      expect(screen.getByText('Shop code must be 7 digits.')).toBeInTheDocument();
    });

    test('successfully adds shop with valid code', async () => {
      const user = userEvent.setup();
      const newShop = { _id: 'shop3', name: 'New Shop', code: '9999999' };
      shopsApi.addShopToUser.mockResolvedValue({ shop: newShop });

      render(
        <Dashboard
          role="customer"
          cart={mockCart}
          setCart={mockSetCart}
          onAddToCart={mockOnAddToCart}
          onShowCart={mockOnShowCart}
        />
      );

      // Open modal
      const addShopBtn = screen.getByText('Add Shop by Code');
      await user.click(addShopBtn);

      // Enter valid code
      const input = screen.getByPlaceholderText('Enter 7-digit shop code');
      await user.type(input, '9999999');

      const submitBtn = screen.getByText('Add');
      await user.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByText('Shop added successfully!')).toBeInTheDocument();
      });

      expect(shopsApi.addShopToUser).toHaveBeenCalledWith('user123', '9999999');
    });
  });

  describe('Geolocation Tests', () => {
    test('fetches nearby shops on location button click', async () => {
      const user = userEvent.setup();
      const mockPosition = {
        coords: { longitude: -122.4194, latitude: 37.7749 }
      };
      
      mockGeolocation.getCurrentPosition.mockImplementation((success) => {
        success(mockPosition);
      });

      const nearbyShops = [
        { _id: 'nearby1', name: 'Nearby Store', code: '1111111', address: '789 Close St' }
      ];
      shopsApi.getNearbyShops.mockResolvedValue(nearbyShops);

      render(
        <Dashboard
          role="customer"
          cart={mockCart}
          setCart={mockSetCart}
          onAddToCart={mockOnAddToCart}
          onShowCart={mockOnShowCart}
        />
      );

      // Switch to shops view to see nearby shops
      const viewShopsBtn = screen.getByText('View Shops');
      await user.click(viewShopsBtn);

      // Click location button
      const locationBtn = screen.getByText('Suggest Shops Nearby');
      await user.click(locationBtn);

      await waitFor(() => {
        expect(screen.getByText('Nearby shops loaded.')).toBeInTheDocument();
      });

      expect(shopsApi.getNearbyShops).toHaveBeenCalledWith(-122.4194, 37.7749);
    });

    test('handles geolocation errors', async () => {
      const user = userEvent.setup();
      
      mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
        error();
      });

      render(
        <Dashboard
          role="customer"
          cart={mockCart}
          setCart={mockSetCart}
          onAddToCart={mockOnAddToCart}
          onShowCart={mockOnShowCart}
        />
      );

      const locationBtn = screen.getByText('Suggest Shops Nearby');
      await user.click(locationBtn);

      await waitFor(() => {
        expect(screen.getByText('Location access denied.')).toBeInTheDocument();
      });
    });
  });

  describe('Shopkeeper Role Tests', () => {
    test('renders shopkeeper features', () => {
      render(
        <Dashboard
          role="shopkeeper"
          cart={mockCart}
          setCart={mockSetCart}
          onAddToCart={mockOnAddToCart}
          onShowCart={mockOnShowCart}
        />
      );

      expect(screen.getByText('Add Inventory Item')).toBeInTheDocument();
      expect(screen.getByText('Customer Requests')).toBeInTheDocument();
      expect(screen.getByText('Shop Performance')).toBeInTheDocument();
    });
  });

  describe('Error Handling Tests', () => {
    test('displays error when items fail to load', async () => {
      itemsApi.fetchItems.mockRejectedValue(new Error('Network error'));

      render(
        <Dashboard
          role="customer"
          cart={mockCart}
          setCart={mockSetCart}
          onAddToCart={mockOnAddToCart}
          onShowCart={mockOnShowCart}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Failed to load products.')).toBeInTheDocument();
      });
    });

    test('shows loading state while fetching items', () => {
      // Mock a delayed response
      itemsApi.fetchItems.mockImplementation(() => new Promise(() => {}));

      render(
        <Dashboard
          role="customer"
          cart={mockCart}
          setCart={mockSetCart}
          onAddToCart={mockOnAddToCart}
          onShowCart={mockOnShowCart}
        />
      );

      expect(screen.getByText('Loading products...')).toBeInTheDocument();
    });

    test('displays message when no products found', async () => {
      itemsApi.fetchItems.mockResolvedValue([]);

      render(
        <Dashboard
          role="customer"
          cart={mockCart}
          setCart={mockSetCart}
          onAddToCart={mockOnAddToCart}
          onShowCart={mockOnShowCart}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('No products found.')).toBeInTheDocument();
      });
    });
  });

  describe('Modal Tests', () => {
    test('closes modal when cancel button is clicked', async () => {
      const user = userEvent.setup();
      
      render(
        <Dashboard
          role="customer"
          cart={mockCart}
          setCart={mockSetCart}
          onAddToCart={mockOnAddToCart}
          onShowCart={mockOnShowCart}
        />
      );

      // Open shop code modal
      const addShopBtn = screen.getByText('Add Shop by Code');
      await user.click(addShopBtn);

      expect(screen.getByText('Enter Shop Code')).toBeInTheDocument();

      // Click cancel
      const cancelBtn = screen.getByText('Cancel');
      await user.click(cancelBtn);

      expect(screen.queryByText('Enter Shop Code')).not.toBeInTheDocument();
    });

    test('opens grocery list modal', async () => {
      const user = userEvent.setup();
      
      render(
        <Dashboard
          role="customer"
          cart={mockCart}
          setCart={mockSetCart}
          onAddToCart={mockOnAddToCart}
          onShowCart={mockOnShowCart}
        />
      );

      const groceryListBtn = screen.getByText('Add Grocery List');
      await user.click(groceryListBtn);

      expect(screen.getByText('Add Grocery Item')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter item name')).toBeInTheDocument();
    });
  });
});
