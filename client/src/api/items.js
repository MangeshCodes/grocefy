import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/items';

export const fetchItems = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};
