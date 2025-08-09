import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TProductCard from './TProductCard';

// Mock CSS import
jest.mock('./ProductCard.css', () => ({}));

describe('TProductCard Component', () => {
  const mockProduct = {
    imageUrl: 'https://example.com/apple.jpg',
    itemName: 'Red Apple',
    shopName: 'Fresh Market',
    expiryDate: '2025-08-15',
    price: 2.99
  };

  const mockOnAddToCart = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders product information correctly', () => {
    render(
      <TProductCard
        {...mockProduct}
        onAddToCart={mockOnAddToCart}
      />
    );

    expect(screen.getByText('Red Apple')).toBeInTheDocument();
    expect(screen.getByText('Fresh Market')).toBeInTheDocument();
    expect(screen.getByText('₹2.99')).toBeInTheDocument();
    expect(screen.getByText(/Expiry:/)).toBeInTheDocument();
  });

  test('displays formatted expiry date', () => {
    render(
      <TProductCard
        {...mockProduct}
        onAddToCart={mockOnAddToCart}
      />
    );

    const expiryText = screen.getByText(/Expiry:/);
    expect(expiryText).toHaveTextContent('Expiry: 8/15/2025');
  });

  test('renders image with correct src and alt text', () => {
    render(
      <TProductCard
        {...mockProduct}
        onAddToCart={mockOnAddToCart}
      />
    );

    const image = screen.getByAltText('Red Apple');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/apple.jpg');
  });

  test('calls onAddToCart when add to cart button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <TProductCard
        {...mockProduct}
        onAddToCart={mockOnAddToCart}
      />
    );

    const addButton = screen.getByText(/Add to Cart/);
    await user.click(addButton);

    expect(mockOnAddToCart).toHaveBeenCalledTimes(1);
  });

  test('does not render add to cart button when onAddToCart is not provided', () => {
    render(
      <TProductCard
        {...mockProduct}
      />
    );

    const addButton = screen.queryByText(/Add to Cart/);
    expect(addButton).not.toBeInTheDocument();
  });

  test('handles image load error with fallback', () => {
    render(
      <TProductCard
        {...mockProduct}
        onAddToCart={mockOnAddToCart}
      />
    );

    const image = screen.getByAltText('Red Apple');
    
    // Simulate image error
    const imageErrorEvent = new Event('error');
    image.dispatchEvent(imageErrorEvent);

    // Check if fallback image is used
    expect(image).toHaveAttribute('src', 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png');
  });

  test('renders with minimum required props', () => {
    const minimalProps = {
      imageUrl: '',
      itemName: 'Test Item',
      shopName: 'Test Shop',
      expiryDate: '2025-08-01',
      price: 1.00
    };

    render(<TProductCard {...minimalProps} />);

    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByText('Test Shop')).toBeInTheDocument();
    expect(screen.getByText('₹1')).toBeInTheDocument();
  });

  test('handles different date formats correctly', () => {
    const productWithISODate = {
      ...mockProduct,
      expiryDate: '2025-12-25T00:00:00.000Z'
    };

    render(
      <TProductCard
        {...productWithISODate}
        onAddToCart={mockOnAddToCart}
      />
    );

    const expiryText = screen.getByText(/Expiry:/);
    expect(expiryText).toHaveTextContent('Expiry: 12/25/2025');
  });

  test('formats price correctly for different values', () => {
    const { rerender } = render(
      <TProductCard
        {...mockProduct}
        price={10}
        onAddToCart={mockOnAddToCart}
      />
    );

    expect(screen.getByText('₹10')).toBeInTheDocument();

    rerender(
      <TProductCard
        {...mockProduct}
        price={15.50}
        onAddToCart={mockOnAddToCart}
      />
    );

    expect(screen.getByText('₹15.5')).toBeInTheDocument();
  });
});
