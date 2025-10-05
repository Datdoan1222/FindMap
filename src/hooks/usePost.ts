import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import axios from 'axios';
import {END_POINT} from '../constants/envConstants';

const POSTS_URL = `${END_POINT}/posts`;

/** ------------------ GET LIST OF POSTS ------------------ */
export const usePosts = () =>
  useQuery(['posts'], async () => {
    const {data} = await axios.get(POSTS_URL);
    return data; // danh sách tất cả tin đăng
  });

/** ------------------ CREATE POST ------------------ */

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (payload: {
      room_id: string;
      owner_id: string;
      title: string;
      address: string;
      region: string;
      description: string;
      images?: string[];
      is_active?: boolean;
    }) => {
      const {data} = await axios.post(POSTS_URL, payload);
      return data;
    },
    {
      onSuccess: () => {
        // invalidate danh sách post để cập nhật UI
        queryClient.invalidateQueries(['post']);
      },
      onError: error => {
        if (axios.isAxiosError(error)) {
          console.log('❌ Tạo post thất bại:', {
            status: error.response?.status,
            data: error.response?.data,
            headers: error.response?.headers,
          });
        } else {
          console.log('❌ Lỗi khác:', error);
        }
      },
    },
  );
};

/** ------------------ DELETE POST ------------------ */
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (postId: string) => {
      const {data} = await axios.delete(`${POSTS_URL}/${postId}`);
      return data;
    },
    {
      onSuccess: (_, postId) => {
        queryClient.invalidateQueries(['posts']); // tự động refetch danh sách
      },
    },
  );
};
