import {createSlice} from '@reduxjs/toolkit';
import database from '@react-native-firebase/database';

const usersSlice = createSlice({
  name: 'usersData',
  initialState: {
    users: [],
    currentUser: null,
    error: null,
    loading: false,
  },
  reducers: {
    fetchUsersStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchUsersSuccess(state, action) {
      state.users = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchUserByIdSuccess(state, action) {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchUsersFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    addUserSuccess(state, action) {
      state.users.push(action.payload);
    },
  },
});

export const {
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUserByIdSuccess,
  fetchUsersFail,
  addUserSuccess,
} = usersSlice.actions;
export default usersSlice.reducer;
export const fetchUserById = id => async dispatch => {
  dispatch(fetchUsersStart());
  try {
    const snapshot = await database().ref(`/users/${id}`).once('value');
    const data = snapshot.val();
    if (data) {
      dispatch(fetchUserByIdSuccess({id, ...data}));
    } else {
      dispatch(fetchUsersFail('Người dùng không tồn tại.'));
    }
  } catch (error) {
    dispatch(fetchUsersFail(error.message));
    console.log('Fetch User By ID Error:', error.message);
  }
};

export const addUser = (id, userData) => async dispatch => {
  try {
    await database().ref(`/users/${id}`).set(userData);
    const newUser = {id, ...userData};
    dispatch(addUserSuccess(newUser));
  } catch (error) {
    dispatch(fetchUsersFail(error.message));
    console.log('Add User Error:', error.message);
  }
};
export const updateStatusUser = (id, newStatus) => async dispatch => {
  try {
    await database().ref(`/users/${id}/status`).set(newStatus);
  } catch (error) {
    dispatch(fetchUsersFail(error.message));
    console.log('Update Status User Error:', error.message);
  }
};
