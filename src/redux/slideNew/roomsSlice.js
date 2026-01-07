import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

const initialState = {
  // Rooms data grouped by region for efficient access
  roomsByRegion: {},

  // All rooms (for search, user's rooms, etc.)
  allRooms: [],

  // Current user's owned rooms
  ownedRooms: [],

  // Current user's rented rooms
  rentedRooms: [],

  // Selected room details
  selectedRoom: null,

  // UI states
  loading: {
    fetch: false,
    create: false,
    update: false,
    delete: false,
    rent: false,
  },

  error: null,

  // Pagination and filters
  filters: {
    region: null,
    minPrice: null,
    maxPrice: null,
    amenities: [],
    status: null, // null, true (available), false (rented)
  },

  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    hasMore: true,
  },
};

// Async thunks
export const fetchRoomsByRegion = createAsyncThunk(
  'rooms/fetchByRegion',
  async (region, {rejectWithValue}) => {
    try {
      const response = await fetch(`/api/rooms/${region}`);
      if (!response.ok) {
        throw new Error('Failed to fetch rooms');
      }
      const data = await response.json();
      return {region, rooms: data};
    } catch (error) {
      return rejectWithValue(error.message || 'Unknown error');
    }
  },
);

export const createRoom = createAsyncThunk(
  'rooms/create',
  async (roomData, {rejectWithValue}) => {
    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(roomData),
      });
      if (!response.ok) {
        throw new Error('Failed to create room');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || 'Unknown error');
    }
  },
);

export const updateRoom = createAsyncThunk(
  'rooms/update',
  async ({id, data}, {rejectWithValue}) => {
    try {
      const response = await fetch(`/api/rooms/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update room');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || 'Unknown error');
    }
  },
);

export const deleteRoom = createAsyncThunk(
  'rooms/delete',
  async (roomId, {rejectWithValue}) => {
    try {
      const response = await fetch(`/api/rooms/${roomId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete room');
      }
      return roomId;
    } catch (error) {
      return rejectWithValue(error.message || 'Unknown error');
    }
  },
);

export const rentRoom = createAsyncThunk(
  'rooms/rent',
  async (rentData, {rejectWithValue}) => {
    try {
      const response = await fetch(`/api/rooms/${rentData.id}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          user_id: rentData.user_id,
          status: false,
          rent_price: rentData.rent_price,
          rent_start_date: rentData.rent_start_date,
          due_date: rentData.due_date,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to rent room');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || 'Unknown error');
    }
  },
);

// Slice
const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    // Sync actions
    setSelectedRoom: (state, action) => {
      state.selectedRoom = action.payload;
    },

    clearError: state => {
      state.error = null;
    },

    updateFilters: (state, action) => {
      state.filters = {...state.filters, ...action.payload};
    },

    resetFilters: state => {
      state.filters = initialState.filters;
    },

    updatePagination: (state, action) => {
      state.pagination = {...state.pagination, ...action.payload};
    },

    // Helper action để cập nhật rooms khi user data thay đổi
    syncUserRooms: (state, action) => {
      state.ownedRooms = action.payload.ownedRooms;
      state.rentedRooms = action.payload.rentedRooms;
    },

    // Optimistic update cho rent room
    optimisticRentRoom: (state, action) => {
      const {id, user_id, rent_price, rent_start_date, due_date} =
        action.payload;

      // Update trong allRooms
      const roomIndex = state.allRooms.findIndex(room => room.id === id);
      if (roomIndex !== -1) {
        state.allRooms[roomIndex] = {
          ...state.allRooms[roomIndex],
          user_id,
          status: false,
          rent_price,
          rent_start_date,
          due_date,
        };
      }

      // Update trong roomsByRegion
      Object.keys(state.roomsByRegion).forEach(region => {
        const regionRoomIndex = state.roomsByRegion[region].findIndex(
          room => room.id === id,
        );
        if (regionRoomIndex !== -1) {
          state.roomsByRegion[region][regionRoomIndex] = {
            ...state.roomsByRegion[region][regionRoomIndex],
            user_id,
            status: false,
            rent_price,
            rent_start_date,
            due_date,
          };
        }
      });
    },

    // Rollback optimistic update nếu thất bại
    rollbackRentRoom: (state, action) => {
      const {id} = action.payload;

      // Revert lại trạng thái cũ
      const roomIndex = state.allRooms.findIndex(room => room.id === id);
      if (roomIndex !== -1) {
        state.allRooms[roomIndex] = {
          ...state.allRooms[roomIndex],
          user_id: null,
          status: true,
          rent_price: null,
          rent_start_date: null,
          due_date: null,
        };
      }

      Object.keys(state.roomsByRegion).forEach(region => {
        const regionRoomIndex = state.roomsByRegion[region].findIndex(
          room => room.id === id,
        );
        if (regionRoomIndex !== -1) {
          state.roomsByRegion[region][regionRoomIndex] = {
            ...state.roomsByRegion[region][regionRoomIndex],
            user_id: null,
            status: true,
            rent_price: null,
            rent_start_date: null,
            due_date: null,
          };
        }
      });
    },

    // Clear all rooms data (khi logout)
    clearRoomsData: state => {
      return initialState;
    },
  },

  extraReducers: builder => {
    builder
      // Fetch rooms by region
      .addCase(fetchRoomsByRegion.pending, state => {
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(fetchRoomsByRegion.fulfilled, (state, action) => {
        state.loading.fetch = false;
        const {region, rooms} = action.payload;
        state.roomsByRegion[region] = rooms;

        // Merge vào allRooms (tránh duplicate)
        const existingIds = new Set(state.allRooms.map(room => room.id));
        const newRooms = rooms.filter(room => !existingIds.has(room.id));
        state.allRooms = [...state.allRooms, ...newRooms];
      })
      .addCase(fetchRoomsByRegion.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.payload;
      })

      // Create room
      .addCase(createRoom.pending, state => {
        state.loading.create = true;
        state.error = null;
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.loading.create = false;
        const newRoom = action.payload;

        // Add to allRooms
        state.allRooms.unshift(newRoom);

        // Add to ownedRooms
        state.ownedRooms.unshift(newRoom);

        // Add to region
        const region = newRoom.region;
        if (!state.roomsByRegion[region]) {
          state.roomsByRegion[region] = [];
        }
        state.roomsByRegion[region].unshift(newRoom);
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.loading.create = false;
        state.error = action.payload;
      })

      // Update room
      .addCase(updateRoom.pending, state => {
        state.loading.update = true;
        state.error = null;
      })
      .addCase(updateRoom.fulfilled, (state, action) => {
        state.loading.update = false;
        const updatedRoom = action.payload;

        // Helper function để update room trong array
        const updateRoomInArray = rooms => {
          const index = rooms.findIndex(room => room.id === updatedRoom.id);
          if (index !== -1) {
            rooms[index] = updatedRoom;
          }
        };

        // Update trong các array
        updateRoomInArray(state.allRooms);
        updateRoomInArray(state.ownedRooms);
        updateRoomInArray(state.rentedRooms);

        // Update trong roomsByRegion
        Object.keys(state.roomsByRegion).forEach(region => {
          updateRoomInArray(state.roomsByRegion[region]);
        });

        // Update selectedRoom nếu đang được chọn
        if (state.selectedRoom?.id === updatedRoom.id) {
          state.selectedRoom = updatedRoom;
        }
      })
      .addCase(updateRoom.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload;
      })

      // Delete room
      .addCase(deleteRoom.pending, state => {
        state.loading.delete = true;
        state.error = null;
      })
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.loading.delete = false;
        const deletedRoomId = action.payload;

        // Helper function để remove room từ array
        const removeRoomFromArray = rooms => {
          return rooms.filter(room => room.id !== deletedRoomId);
        };

        // Remove từ các array
        state.allRooms = removeRoomFromArray(state.allRooms);
        state.ownedRooms = removeRoomFromArray(state.ownedRooms);
        state.rentedRooms = removeRoomFromArray(state.rentedRooms);

        // Remove từ roomsByRegion
        Object.keys(state.roomsByRegion).forEach(region => {
          state.roomsByRegion[region] = removeRoomFromArray(
            state.roomsByRegion[region],
          );
        });

        // Clear selectedRoom nếu đang được chọn
        if (state.selectedRoom?.id === deletedRoomId) {
          state.selectedRoom = null;
        }
      })
      .addCase(deleteRoom.rejected, (state, action) => {
        state.loading.delete = false;
        state.error = action.payload;
      })

      // Rent room
      .addCase(rentRoom.pending, state => {
        state.loading.rent = true;
        state.error = null;
      })
      .addCase(rentRoom.fulfilled, (state, action) => {
        state.loading.rent = false;
        const rentedRoom = action.payload;

        // Update room trong tất cả các array (tương tự update)
        const updateRoomInArray = rooms => {
          const index = rooms.findIndex(room => room.id === rentedRoom.id);
          if (index !== -1) {
            rooms[index] = rentedRoom;
          }
        };

        updateRoomInArray(state.allRooms);
        updateRoomInArray(state.ownedRooms);

        // Add vào rentedRooms nếu user hiện tại thuê
        // (logic này sẽ phụ thuộc vào current user id từ auth state)

        Object.keys(state.roomsByRegion).forEach(region => {
          updateRoomInArray(state.roomsByRegion[region]);
        });

        if (state.selectedRoom?.id === rentedRoom.id) {
          state.selectedRoom = rentedRoom;
        }
      })
      .addCase(rentRoom.rejected, (state, action) => {
        state.loading.rent = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSelectedRoom,
  clearError,
  updateFilters,
  resetFilters,
  updatePagination,
  syncUserRooms,
  optimisticRentRoom,
  rollbackRentRoom,
  clearRoomsData,
} = roomsSlice.actions;

export default roomsSlice.reducer;
