import {createSlice} from '@reduxjs/toolkit';
import auth from '@react-native-firebase/auth';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    error: null,
    isLoggedIn: false,
  },
  reducers: {
    loginSuccess(state, action) {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.error = null;
    },
    loginFail(state, action) {
      state.error = action.payload;
      state.isLoggedIn = false;
    },
    registerSuccess(state, action) {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.error = null;
    },
    registerFail(state, action) {
      state.error = action.payload;
      state.isLoggedIn = false;
    },
    logoutUser(state) {
      state.user = null;
      state.isLoggedIn = false;
      state.error = null;
    },
  },
});

export const {
  loginSuccess,
  loginFail,
  registerSuccess,
  registerFail,
  logoutUser,
} = authSlice.actions;

export default authSlice.reducer;

const extractUserData = user => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  photoURL: user.photoURL,
  phoneNumber: user.phoneNumber,
  emailVerified: user.emailVerified,
});

// Thunk actions
export const login = (email, password) => async dispatch => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(
      email,
      password,
    );
    const userData = extractUserData(userCredential.user);
    dispatch(loginSuccess(userData));
  } catch (error) {
    dispatch(loginFail(error.message));
    console.log('Login Error:', error.message);
  }
};

export const register = (email, password) => async dispatch => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(
      email,
      password,
    );
    const userData = extractUserData(userCredential.user);
    dispatch(registerSuccess(userData));
  } catch (error) {
    dispatch(registerFail(error.message));
    console.log('Register Error:', error.message);
  }
};

export const logout = () => async dispatch => {
  try {
    await auth().signOut();
    dispatch(logoutUser());
  } catch (error) {
    console.log('Logout Error:', error.message);
    dispatch(loginFail(error.message));
  }
};
