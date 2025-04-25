import {createSlice} from '@reduxjs/toolkit';
import database from '@react-native-firebase/database';

const ownersSlide = createSlice({
  name: 'ownersData',
  initialState: {
    owners: [],
    error: null,
    loading: false,
    searchKeyword: '',
  },
  reducers: {
    fetchOwnersStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchOwnersSuccess(state, action) {
      state.owners = action.payload;
      state.loading = false; // Đặt loading thành false khi thành công
      state.error = null;
    },
    fetchOwnersFail(state, action) {
      state.loading = false; // Đặt loading thành false khi thất bại
      state.error = action.payload;
    },
    setSearchKeyword(state, action) {
      state.searchKeyword = action.payload;
    },
  },
});

export const {
  fetchOwnersStart,
  fetchOwnersSuccess,
  fetchOwnersFail,
  setSearchKeyword,
} = ownersSlide.actions;
export default ownersSlide.reducer;
export const fetchOwners = () => async dispatch => {
  dispatch(fetchOwnersStart());
  try {
    const snapshot = await database().ref(`/owners`).once('value');
    const data = snapshot.val();
    const owners = data
      ? Object.keys(data).map(key => ({id: key, ...data[key]}))
      : [];
    dispatch(fetchOwnersSuccess(owners));

    database()
      .ref('/owners')
      .on('value', snapshot => {
        const data = snapshot.val();
        const updateowners = data
          ? Object.keys(data).map(key => ({id: key, ...data[key]}))
          : [];
        dispatch(fetchOwnersSuccess(updateowners));
      });
  } catch (error) {
    dispatch(fetchOwnersFail(error.message));
    console.log('Fetch Error:', error.message);
  }
};
export const selectFilteredOwners = state => {
  const keyword = (state.ownersData?.searchKeyword || '').toLowerCase(); // thêm giá trị mặc định ''
  return state.ownersData.owners.filter(
    owner =>
      owner.nameOwner?.toLowerCase().includes(keyword) ||
      owner.area?.toLowerCase().includes(keyword) ||
      String(owner.id).includes(keyword),
  );
};

export const updateRoomStatus =
  (ownerId, roomKey, newStatus, idUser) => async dispatch => {
    try {
      const updates = {};
      if (idUser !== undefined) {
        updates[`/owners/${ownerId}/rooms/${roomKey}/idUser`] = idUser;
      }
      updates[`/owners/${ownerId}/rooms/${roomKey}/status`] = newStatus;

      await database().ref().update(updates);
    } catch (error) {
      console.error('Update room status failed:', error);
    }
  };
