import axios from 'axios';

export const addShopToUser = async (userId, shopCode) => {
  const res = await axios.post('/api/shops/add-shop', { userId, shopCode });
  return res.data;
};

export const getNearbyShops = async (lng, lat, maxDistance = 5000) => {
  const res = await axios.get('/api/shops/nearby', { params: { lng, lat, maxDistance } });
  return res.data;
};

export const getUserShops = async (userId) => {
  const res = await axios.get(`/api/shops/user/${userId}`);
  return res.data;
};
