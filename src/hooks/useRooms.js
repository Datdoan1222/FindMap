import {useSelector, useDispatch} from 'react-redux';
import {
  fetchRoomsByRegion,
  createRoom,
  updateRoom,
  deleteRoom,
  rentRoom,
  setSelectedRoom,
  clearError,
  updateFilters,
  resetFilters,
  updatePagination,
  optimisticRentRoom,
  rollbackRentRoom,
  clearRoomsData,
} from '../store/roomsSlice';

// Main hook để access rooms state
export const useRooms = () => {
  return useSelector(state => state.rooms);
};

// Hook để get rooms theo region
export const useRoomsByRegion = region => {
  const roomsByRegion = useSelector(state => state.rooms.roomsByRegion);
  return roomsByRegion[region] || [];
};

// Hook để get available rooms (status = true)
export const useAvailableRooms = region => {
  return useSelector(state => {
    if (region) {
      return (state.rooms.roomsByRegion[region] || []).filter(
        room => room.status === true,
      );
    }
    return state.rooms.allRooms.filter(room => room.status === true);
  });
};

// Hook để get rented rooms của user hiện tại
export const useUserRentedRooms = () => {
  const currentUserId = useSelector(state => state.auth.user?.id);
  return useSelector(state =>
    state.rooms.allRooms.filter(room => room.user_id === currentUserId),
  );
};

// Hook để get owned rooms của user hiện tại
export const useUserOwnedRooms = () => {
  const currentUserId = useSelector(state => state.auth.user?.id);
  return useSelector(state =>
    state.rooms.allRooms.filter(room => room.owner_id === currentUserId),
  );
};

// Hook với filtered rooms
export const useFilteredRooms = () => {
  const {allRooms, filters} = useSelector(state => state.rooms);

  return allRooms.filter(room => {
    // Filter by region
    if (filters.region && room.region !== filters.region) {
      return false;
    }

    // Filter by price range
    if (filters.minPrice && room.price < filters.minPrice) {
      return false;
    }

    if (filters.maxPrice && room.price > filters.maxPrice) {
      return false;
    }

    // Filter by status
    if (filters.status !== null && room.status !== filters.status) {
      return false;
    }

    // Filter by amenities
    if (filters.amenities.length > 0) {
      const hasAllAmenities = filters.amenities.every(amenity =>
        room.amenities.includes(amenity),
      );
      if (!hasAllAmenities) {
        return false;
      }
    }

    return true;
  });
};

// Hook cho room actions
export const useRoomActions = () => {
  const dispatch = useDispatch();

  return {
    // Async actions
    fetchRoomsByRegion: region => dispatch(fetchRoomsByRegion(region)),

    createRoom: roomData => dispatch(createRoom(roomData)),

    updateRoom: updateData => dispatch(updateRoom(updateData)),

    deleteRoom: roomId => dispatch(deleteRoom(roomId)),

    rentRoom: rentData => dispatch(rentRoom(rentData)),

    // Sync actions
    setSelectedRoom: room => dispatch(setSelectedRoom(room)),

    clearError: () => dispatch(clearError()),

    updateFilters: filters => dispatch(updateFilters(filters)),

    resetFilters: () => dispatch(resetFilters()),

    updatePagination: pagination => dispatch(updatePagination(pagination)),

    // Optimistic update cho rent room (dùng khi muốn UI responsive)
    optimisticRentRoom: rentData => dispatch(optimisticRentRoom(rentData)),

    rollbackRentRoom: roomData => dispatch(rollbackRentRoom(roomData)),

    clearRoomsData: () => dispatch(clearRoomsData()),
  };
};

// Hook cho loading states
export const useRoomLoading = () => {
  return useSelector(state => state.rooms.loading);
};

// Hook cho error state
export const useRoomError = () => {
  return useSelector(state => state.rooms.error);
};

// Hook cho selected room
export const useSelectedRoom = () => {
  return useSelector(state => state.rooms.selectedRoom);
};

// Hook cho filters
export const useRoomFilters = () => {
  return useSelector(state => state.rooms.filters);
};

// Hook cho pagination
export const useRoomPagination = () => {
  return useSelector(state => state.rooms.pagination);
};

// Hook để search rooms
export const useSearchRooms = searchQuery => {
  return useSelector(state => {
    if (!searchQuery || searchQuery.trim() === '') {
      return state.rooms.allRooms;
    }

    const query = searchQuery.toLowerCase();
    return state.rooms.allRooms.filter(
      room =>
        room.title.toLowerCase().includes(query) ||
        room.description.toLowerCase().includes(query) ||
        room.address.toLowerCase().includes(query) ||
        room.region.toLowerCase().includes(query) ||
        room.amenities.some(amenity => amenity.toLowerCase().includes(query)),
    );
  });
};

// Hook cho room statistics
export const useRoomStats = () => {
  return useSelector(state => {
    const currentUserId = state.auth.user?.id;
    const {allRooms} = state.rooms;

    return {
      totalRooms: allRooms.length,
      availableRooms: allRooms.filter(room => room.status === true).length,
      rentedRooms: allRooms.filter(room => room.status === false).length,
      userOwnedRooms: allRooms.filter(room => room.owner_id === currentUserId)
        .length,
      userRentedRooms: allRooms.filter(room => room.user_id === currentUserId)
        .length,
    };
  });
};
