import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import axios from 'axios';
import {END_POINT} from '../constants/envConstants';
// TỪ ROOM API
export const useFavouriteData = user_id => {
  return useQuery({
    queryKey: ['favourites', user_id],
    queryFn: async () => {
      const res = await axios.get(`${END_POINT}/rooms`); // lấy toàn bộ phòng
      const rooms = res.data;

      // lọc ra phòng mà user_id có trong danh sách favourite
      const favouriteRooms = rooms.filter(room =>
        room.favourite?.includes(user_id),
      );

      return favouriteRooms; // chỉ trả về phòng yêu thích
    },
    enabled: !!user_id, // chỉ chạy khi có user_id
  });
};

export const useToggleFavourite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({room, user_id}) => {
      // copy mảng favourite hiện tại
      let newFavourite = [...(room.favourite || [])];

      if (newFavourite.includes(user_id)) {
        // Nếu đã có user_id -> xóa đi
        newFavourite = newFavourite.filter(id => id !== user_id);
      } else {
        // Nếu chưa có -> thêm vào
        newFavourite.push(user_id);
      }

      // Gọi PATCH /rooms/:id
      const res = await axios.patch(`${END_POINT}/rooms/${room.id}`, {
        favourite: newFavourite,
      });

      return res.data;
    },
    onSuccess: (_, {user_id}) => {
      queryClient.invalidateQueries(['favourites', user_id]);
      queryClient.invalidateQueries(['rooms']);
    },
  });
};
