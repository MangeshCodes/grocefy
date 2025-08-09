import axios from 'axios';
import { addShopToUser, getNearbyShops, getUserShops } from './shops';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

describe('Shops API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addShopToUser', () => {
    test('successfully adds shop to user', async () => {
      const mockResponse = {
        shop: { _id: 'shop1', name: 'Test Shop', code: '1234567' },
        message: 'Shop added successfully'
      };

      mockedAxios.post.mockResolvedValue({ data: mockResponse });

      const result = await addShopToUser('user123', '1234567');

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/shops/add-shop', {
        userId: 'user123',
        shopCode: '1234567'
      });
      expect(result).toEqual(mockResponse);
    });

    test('handles invalid shop code error', async () => {
      const errorResponse = {
        response: {
          status: 400,
          data: { message: 'Invalid shop code' }
        }
      };

      mockedAxios.post.mockRejectedValue(errorResponse);

      await expect(addShopToUser('user123', 'invalid')).rejects.toEqual(errorResponse);
    });

    test('handles network errors', async () => {
      const networkError = new Error('Network Error');
      mockedAxios.post.mockRejectedValue(networkError);

      await expect(addShopToUser('user123', '1234567')).rejects.toThrow('Network Error');
    });
  });

  describe('getNearbyShops', () => {
    test('successfully fetches nearby shops with default distance', async () => {
      const mockShops = [
        { _id: 'shop1', name: 'Nearby Shop 1', distance: 500 },
        { _id: 'shop2', name: 'Nearby Shop 2', distance: 1000 }
      ];

      mockedAxios.get.mockResolvedValue({ data: mockShops });

      const result = await getNearbyShops(-122.4194, 37.7749);

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/shops/nearby', {
        params: { lng: -122.4194, lat: 37.7749, maxDistance: 5000 }
      });
      expect(result).toEqual(mockShops);
    });

    test('successfully fetches nearby shops with custom distance', async () => {
      const mockShops = [];
      mockedAxios.get.mockResolvedValue({ data: mockShops });

      const result = await getNearbyShops(-122.4194, 37.7749, 2000);

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/shops/nearby', {
        params: { lng: -122.4194, lat: 37.7749, maxDistance: 2000 }
      });
      expect(result).toEqual(mockShops);
    });

    test('handles location service errors', async () => {
      const errorResponse = {
        response: {
          status: 500,
          data: { message: 'Location service unavailable' }
        }
      };

      mockedAxios.get.mockRejectedValue(errorResponse);

      await expect(getNearbyShops(-122.4194, 37.7749)).rejects.toEqual(errorResponse);
    });

    test('returns empty array when no nearby shops found', async () => {
      mockedAxios.get.mockResolvedValue({ data: [] });

      const result = await getNearbyShops(-122.4194, 37.7749);

      expect(result).toEqual([]);
    });
  });

  describe('getUserShops', () => {
    test('successfully fetches user shops', async () => {
      const mockShops = [
        { _id: 'shop1', name: 'My Shop 1', code: '1111111' },
        { _id: 'shop2', name: 'My Shop 2', code: '2222222' }
      ];

      mockedAxios.get.mockResolvedValue({ data: mockShops });

      const result = await getUserShops('user123');

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/shops/user/user123');
      expect(result).toEqual(mockShops);
    });

    test('handles user not found error', async () => {
      const errorResponse = {
        response: {
          status: 404,
          data: { message: 'User not found' }
        }
      };

      mockedAxios.get.mockRejectedValue(errorResponse);

      await expect(getUserShops('nonexistent')).rejects.toEqual(errorResponse);
    });

    test('returns empty array when user has no shops', async () => {
      mockedAxios.get.mockResolvedValue({ data: [] });

      const result = await getUserShops('user123');

      expect(result).toEqual([]);
    });

    test('handles unauthorized access', async () => {
      const errorResponse = {
        response: {
          status: 401,
          data: { message: 'Unauthorized access' }
        }
      };

      mockedAxios.get.mockRejectedValue(errorResponse);

      await expect(getUserShops('user123')).rejects.toEqual(errorResponse);
    });
  });
});
