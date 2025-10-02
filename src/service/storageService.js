import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEYS} from '../constants/keyStorageConstants.js';

const setItem = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error(`Error storing ${key}`, error);
  }
};

export const storeTokens = async (
  accessToken,
  expires,
  refreshToken,
  userId,
  role,
) => {
  const expirationTime = Date.now() + expires;
  await Promise.all([
    setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken),
    setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken),
    setItem(STORAGE_KEYS.ROLE, role),

    setItem(STORAGE_KEYS.USER_ID, userId.toString()),
    setItem(STORAGE_KEYS.EXPIRES, expirationTime.toString()),
  ]);
};

export const getAccessToken = () =>
  AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

export const getRefreshToken = () =>
  AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

export const getRole = () => AsyncStorage.getItem(STORAGE_KEYS.ROLE);

export const getUserId = () => AsyncStorage.getItem(STORAGE_KEYS.USER_ID);

export const logout = () => {
  AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  AsyncStorage.removeItem(STORAGE_KEYS.USER_ID);
  AsyncStorage.removeItem(STORAGE_KEYS.EXPIRES);
  AsyncStorage.removeItem(STORAGE_KEYS.ROLE);
  AsyncStorage.removeItem(STORAGE_KEYS.FCM_TOKEN);
};

export const signedIn = async () => {
  try {
    const [[, accessToken], [, expiration]] = await AsyncStorage.multiGet([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.EXPIRES,
    ]);

    if (!accessToken) {
      return false; // Không có token => chưa đăng nhập
    }

    const isExpired = !expiration || Date.now() > parseInt(expiration, 10);

    return !isExpired; // Trả về true nếu token không hết hạn, ngược lại trả về false
  } catch (error) {
    console.error('Error checking signed-in status', error);
    return false;
  }
};
