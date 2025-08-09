import axios from 'axios';
import { fetchItems } from './items';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

describe('Items API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchItems', () => {
    test('successfully fetches items', async () => {
      const mockItems = [
        { _id: '1', itemName: 'Apple', price: 2.99 },
        { _id: '2', itemName: 'Banana', price: 1.99 }
      ];

      mockedAxios.get.mockResolvedValue({ data: mockItems });

      const result = await fetchItems();

      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:5000/api/items');
      expect(result).toEqual(mockItems);
    });

    test('handles API errors', async () => {
      const errorMessage = 'Network Error';
      mockedAxios.get.mockRejectedValue(new Error(errorMessage));

      await expect(fetchItems()).rejects.toThrow(errorMessage);
      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:5000/api/items');
    });

    test('uses environment variable for API URL', async () => {
      const originalEnv = process.env.REACT_APP_API_URL;
      process.env.REACT_APP_API_URL = 'https://api.grocefy.com/api/items';

      const mockItems = [];
      mockedAxios.get.mockResolvedValue({ data: mockItems });

      await fetchItems();

      expect(mockedAxios.get).toHaveBeenCalledWith('https://api.grocefy.com/api/items');

      // Restore original environment
      process.env.REACT_APP_API_URL = originalEnv;
    });

    test('returns empty array when no items found', async () => {
      mockedAxios.get.mockResolvedValue({ data: [] });

      const result = await fetchItems();

      expect(result).toEqual([]);
    });
  });
});
