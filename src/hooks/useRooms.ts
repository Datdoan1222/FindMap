import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import axios from 'axios';
import {END_POINT} from '../constants/envConstants';

const ROOMS_URL = `${END_POINT}/rooms`;

/** ------------------ GET LIST OF ROOMS ------------------ */
export const useRooms = () =>
  useQuery(['rooms'], async () => {
    const {data} = await axios.get(ROOMS_URL);
    return data; // danh sách tất cả phòng
  });
export const useGetRoomByID = (roomId?: string) => {
  return useQuery(
    ['room', roomId],
    async () => {
      if (!roomId) throw new Error('Room ID is required');
      const {data} = await axios.get(`${ROOMS_URL}/${roomId}`);
      return data; // server trả về object room
    },
    {
      enabled: !!roomId, // chỉ gọi API khi có roomId
      retry: 1, // (tùy chọn) chỉ retry 1 lần nếu lỗi
      staleTime: 1000 * 60, // (tùy chọn) cache trong 1 phút
    },
  );
};
export const useMyRooms = (userId: string) =>
  useQuery(
    ['myRooms', userId],
    async () => {
      const {data} = await axios.get(ROOMS_URL);

      // lấy tất cả phòng mà user là chủ hoặc đang thuê
      const myRooms = data.filter((room: any) => room.user_id === userId);

      return myRooms[0];
    },
    {
      enabled: !!userId,
    },
  );
export const useManagerRooms = (userId: string) =>
  useQuery(
    ['myRooms', userId],
    async () => {
      const {data} = await axios.get(ROOMS_URL);

      // lấy tất cả phòng mà user là chủ hoặc đang thuê
      const myRooms = data.filter((room: any) => room.owner_id === userId);

      return myRooms[0];
    },
    {
      enabled: !!userId,
    },
  );

/** ------------------ CREATE ROOM ------------------ */
export const useCreateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (payload: {
      owner_id: string;
      title: string;
      description: string;
      address: string;
      region: string;
      latitude?: number;
      longitude?: number;
      price: number;
      area?: number;
      amenities?: string[];
      images?: string[];
    }) => {
      const {data} = await axios.post(ROOMS_URL, payload);
      return data;
    },
    {
      onSuccess: () => {
        // invalidate list phòng để cập nhật UI
        queryClient.invalidateQueries(['rooms']);
      },
      onError: error => {
        if (axios.isAxiosError(error)) {
          console.log('❌ Tạo phònxg thất bại:', {
            status: error.response?.status,
            data: error.response?.data, // 👉 thông tin lỗi chi tiết
            headers: error.response?.headers,
          });
        } else {
          console.log('❌ Lỗi khác:', error);
        }
      },
    },
  );
};

/** ------------------ UPDATE ROOM ------------------ */
export const useUpdateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (params: {
      roomId: string;
      data: Partial<{
        title: string;
        description: string;
        address: string;
        region: string;
        latitude: number;
        longitude: number;
        price: number;
        area: number;
        amenities: string[];
        images: string[];
        status: boolean;
        rent_price: number;
        rent_start_date: string;
        due_date: string;
        user_id: string | null;
      }>;
    }) => {
      const {roomId, data} = params;
      const {data: resData} = await axios.put(`${ROOMS_URL}/${roomId}`, data);
      return resData;
    },
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(['rooms']);
        queryClient.invalidateQueries(['room', variables.roomId]);
      },
    },
  );
};

/** ------------------ DELETE ROOM ------------------ */
export const useDeleteRoom = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (roomId: string) => {
      const {data} = await axios.delete(`${ROOMS_URL}/${roomId}`);
      return data;
    },
    {
      onSuccess: () => {
        // xóa xong thì refresh lại list phòng
        queryClient.invalidateQueries(['rooms']);
      },
      onError: error => {
        console.log('❌ Xóa phòng thất bại:', error);
      },
    },
  );
};

/** ------------------ GET USER FAVOURITES ------------------ */
export const useUserFavourites = (userId: string) =>
  useQuery(
    ['userFavourites', userId],
    async () => {
      const {data} = await axios.get(`${END_POINT}/users/${userId}/favourites`);
      return data; // danh sách phòng yêu thích
    },
    {enabled: !!userId},
  );

/** ------------------ UPDATE FAVOURITE ------------------ */
export const useUpdateFavourite = () =>
  useMutation(
    async (params: {
      roomId: string;
      userId: string;
      action: 'add' | 'remove';
    }) => {
      const {roomId, userId, action} = params;
      const {data} = await axios.patch(`${ROOMS_URL}/${roomId}/favourite`, {
        action,
        user_id: userId,
      });
      return data;
    },
  );

/** ------------------ RENT ROOM ------------------ */
export const useRentRoom = () =>
  useMutation(
    async (params: {
      roomId: string;
      userId: string;
      rent_price: number;
      rent_start_date: string; // ISO string
      due_date: string; // ISO string
    }) => {
      const {roomId, userId, rent_price, rent_start_date, due_date} = params;
      const {data} = await axios.patch(`${ROOMS_URL}/${roomId}`, {
        user_id: userId,
        status: false,
        rent_price,
        rent_start_date,
        due_date,
      });
      return data;
    },
  );
export const useGetManyRooms = (roomIds?: string[]) => {
  return useQuery(
    ['rooms', roomIds],
    async () => {
      if (!roomIds || roomIds.length === 0) return [];
      const {data} = await axios.get(
        `${ROOMS_URL}/many/ids?ids=${roomIds.join(',')}`,
      );
      return data;
    },
    {
      enabled: !!roomIds && roomIds.length > 0,
    },
  );
};
