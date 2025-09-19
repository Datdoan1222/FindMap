import axios from 'axios';
import {END_POINT} from '../constants/envConstants';

export const useFetchSearchData = async ({
  query = '',
  region = '',
  price_min = '',
  price_max = '',
  name = '',
}) => {
  try {
    const response = await axios.get(`${END_POINT}`, {
      params: {query, region, price_min, price_max, name},
    });
    return response.data; // API trả về list data
  } catch (error) {
    console.error('Error fetching search data:', error);
    return [];
  }
};
