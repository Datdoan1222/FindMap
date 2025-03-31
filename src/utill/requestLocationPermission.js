import React, {useState} from 'react';
import {PermissionsAndroid, Platform, Alert} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Geolocation Permission',
        message: 'Can we access your location?',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === 'granted') {
      console.log('You can use Geolocation');
      return true;
    } else {
      console.log('You cannot use Geolocation');
      return false;
    }
  } catch (err) {
    return false;
  }
};
export const getLocation = async () => {
  const hasPermission = await requestLocationPermission();
  if (!hasPermission) {
    console.log('Quyền truy cập vị trí bị từ chối');
    return;
  }

  Geolocation.getCurrentPosition(
    position => {
      console.log('Vị trí:', position);
    },
    error => {
      console.log('Lỗi lấy vị trí:', error);
    },
    {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
  );
};
export const getUsersCureentLocation = ({mapRef}) => {
  Geolocation.getCurrentPosition(
    position => {
      const {latitude, longitude} = position.coords;
      console.log('getting location:');
    },
    error => {
      console.log('Error getting location:', error);
      Alert.alert('Error', 'Unable to fetch location');
    },
    {enableHighAccuracy: true, timeout: 20000, maximumAge: 10000},
  );
};
