import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';

// Mock dependencies
jest.mock('../api/items', () => ({
  fetchItems: jest.fn(() => Promise.resolve([
    { _id: '1', itemName: 'Test Apple', shopName: 'Test Shop', price: 2.99, imageUrl: 'test.jpg', expiryDate: '2025-08-15' }
  ]))
}));

jest.mock('../api/shops', () => ({
  getUserShops: jest.fn(() => Promise.resolve([])),
  addShopToUser: jest.fn(),
  getNearbyShops: jest.fn()
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(() => 'test-user-id'),
  setItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('Dashboard Features Visibility Test', () => {
  test('Customer role shows all expected features', async () => {
    const mockCart = [];
    const mockSetCart = jest.fn();
    const mockOnAddToCart = jest.fn();
    const mockOnShowCart = jest.fn();

    render(
      <BrowserRouter>
        <Dashboard
          role="customer"
          cart={mockCart}
          setCart={mockSetCart}
          onAddToCart={mockOnAddToCart}
          onShowCart={mockOnShowCart}
        />
      </BrowserRouter>
    );

    // Check if sidebar features are visible
    expect(screen.getByText('Features')).toBeInTheDocument();
    expect(screen.getByText('Browse Products')).toBeInTheDocument();
    expect(screen.getByText('View Shops')).toBeInTheDocument();
    expect(screen.getByText('Add Shop by Code')).toBeInTheDocument();
    expect(screen.getByText('Add Grocery List')).toBeInTheDocument();
    expect(screen.getByText('Suggest Shops Nearby')).toBeInTheDocument();

    // Check main dashboard content
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Browse Products')).toBeInTheDocument(); // Header in main area

    console.log('✅ All customer features are visible!');
  });

  test('Shopkeeper role shows correct features', () => {
    const mockCart = [];
    const mockSetCart = jest.fn();
    const mockOnAddToCart = jest.fn();
    const mockOnShowCart = jest.fn();

    render(
      <BrowserRouter>
        <Dashboard
          role="shopkeeper"
          cart={mockCart}
          setCart={mockSetCart}
          onAddToCart={mockOnAddToCart}
          onShowCart={mockOnShowCart}
        />
      </BrowserRouter>
    );

    // Check shopkeeper-specific features
    expect(screen.getByText('Features')).toBeInTheDocument();
    expect(screen.getByText('Add Inventory Item')).toBeInTheDocument();
    expect(screen.getByText('Customer Requests')).toBeInTheDocument();
    expect(screen.getByText('Shop Performance')).toBeInTheDocument();

    console.log('✅ All shopkeeper features are visible!');
  });

  test('No role provided shows no sidebar', () => {
    const mockCart = [];
    const mockSetCart = jest.fn();
    const mockOnAddToCart = jest.fn();
    const mockOnShowCart = jest.fn();

    render(
      <BrowserRouter>
        <Dashboard
          role={undefined}
          cart={mockCart}
          setCart={mockSetCart}
          onAddToCart={mockOnAddToCart}
          onShowCart={mockOnShowCart}
        />
      </BrowserRouter>
    );

    // Should not show sidebar features
    expect(screen.queryByText('Features')).not.toBeInTheDocument();
    
    // But should still show main dashboard
    expect(screen.getByText('Dashboard')).toBeInTheDocument();

    console.log('✅ No sidebar shown when role is undefined!');
  });
});
