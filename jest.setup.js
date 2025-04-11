import 'react-native-gesture-handler/jestSetup';

// Mock các module native nếu cần
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // Cần mock thêm đặc biệt cho v3:
  Reanimated.default.call = () => {};
  return Reanimated;
});
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('react-native-maps', () => {
  const React = require('react');
  const {View} = require('react-native');
  const MockMapView = props => <View {...props} />;
  const MockMarker = props => <View {...props} />;
  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMarker,
  };
});

jest.mock('react-native-geolocation-service', () => {
  return {
    requestAuthorization: jest.fn(),
    getCurrentPosition: jest.fn(),
    watchPosition: jest.fn(),
    clearWatch: jest.fn(),
    stopObserving: jest.fn(),
  };
});
jest.mock('@react-native-firebase/database');
