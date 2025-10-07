import {useQuery} from '@tanstack/react-query';
import axios from 'axios';
import {END_POINT} from '../constants/envConstants';

const SEARCH_URL = `${END_POINT}/search`;

// Kiểu dữ liệu của 1 phòng (tuỳ model thực tế)
interface Room {
  _id: string;
  title: string;
  description: string;
  region: string;
  price: number;
  status: boolean;
  images?: string[];
  updated_at?: string;
}

interface SearchParams {
  query?: string;
  region?: string;
  price_min?: number;
  price_max?: number;
  title?: string;
}

/**
 * Hook tìm kiếm phòng
 * @param params SearchParams - các tham số lọc như query, region, price_min, price_max
 */
export const useSearch = (params: SearchParams) => {
  return useQuery({
    queryKey: ['rooms', params], // để react-query cache theo bộ lọc
    queryFn: async () => {
      const {data} = await axios.get<Room[]>(SEARCH_URL, {params});
      return data;
    },
    enabled: !!params, // chỉ gọi khi có params
    onError: error => {
      if (axios.isAxiosError(error)) {
        console.log('❌ Lỗi khi tìm kiếm phòng:', {
          status: error.response?.status,
          data: error.response?.data,
        });
      } else {
        console.log('❌ Lỗi khác:', error);
      }
    },
  });
};
