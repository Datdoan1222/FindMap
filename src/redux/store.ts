import {configureStore} from '@reduxjs/toolkit';
import ownersReducer from './ownersSlide';

// Tạo store
const store = configureStore({
  reducer: {
    owners: ownersReducer,
  },
});

// Định nghĩa RootState để sử dụng trong các hook
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
