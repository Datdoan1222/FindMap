import {createSlice} from '@reduxjs/toolkit';
import database from '@react-native-firebase/database';

const ownersSlide = createSlice({
  name: 'ownersData',
  initialState: {
    owners: [],
    error: null,
    loading: false,
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
  },
});

export const {fetchOwnersStart, fetchOwnersSuccess, fetchOwnersFail} =
  ownersSlide.actions;
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
