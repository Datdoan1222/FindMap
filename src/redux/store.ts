import {configureStore} from '@reduxjs/toolkit';
import ownersReducer from './ownersSlide';
import postsReducer from './postsSlide';
import authReducer from './authSlide';
import usersReducer from './usersSlide'

// Tạo store
const store = configureStore({
  reducer: {
    ownersData: ownersReducer,
    posts: postsReducer,
    auth: authReducer,
    users: usersReducer
  },
});

// Định nghĩa RootState để sử dụng trong các hook
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
