import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import axios from 'axios';
import {END_POINT} from '../constants/envConstants';

const REGISTER_URL = `${END_POINT}/users/register`;
const LOGIN_URL = `${END_POINT}/users/login`;
const USER_URL = `${END_POINT}/users`;

/** ------------------ REGISTER ------------------ */
export const useRegister = () =>
  useMutation(
    async (payload: {
      name: string;
      email: string;
      password: string;
      phone?: string;
      role?: 'user' | 'owner';
    }) => {
      const {data} = await axios.post(REGISTER_URL, payload);
      return data;
    },
  );

/** ------------------ LOGIN ------------------ */
export const useLogin = () =>
  useMutation(async (payload: {email: string; password: string}) => {
    const {data} = await axios.post(LOGIN_URL, payload);
    return data; // thường trả về token + user info
  });

/** ------------------ GET USER ------------------ */
export const useUser = (userId?: string) => {
  return useQuery(
    ['user', userId],
    async () => {
      if (!userId) throw new Error('User ID is required');
      const {data} = await axios.get(`${USER_URL}/${userId}`);
      return data; // data trả về toàn bộ user object
    },
    {enabled: !!userId}, // chỉ fetch khi có userId
  );
};

/** ------------------ UPDATE USER ------------------ */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (params: {
      userId: string;
      data: Partial<{
        name: string;
        phone: string;
        address: string;
        avatar: string | null;
      }>;
    }) => {
      const {userId, data} = params;
      const {data: resData} = await axios.put(`${USER_URL}/${userId}`, data);
      return resData;
    },
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(['user', variables.userId]);
      },
    },
  );
};

/** ------------------ DELETE USER ------------------ */
export const useDeleteUser = () =>
  useMutation(async (userId: string) => {
    const {data} = await axios.delete(`${USER_URL}/${userId}`);
    return data;
  });
  
/** ------------------ TOGGLE FAVOURITE ------------------ */
export const useToggleFavourite = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (params: {userId: string; roomId: string}) => {
      const {userId, roomId} = params;
      const {data} = await axios.post(`${USER_URL}/${userId}/favourite`, {
        room_id: roomId,
      });
      return data;
    },
    {
      onSuccess: (_, variables) => {
        // Cập nhật lại thông tin user để đồng bộ favourite mới nhất
        queryClient.invalidateQueries(['user', variables.userId]);
      },
    },
  );
};
