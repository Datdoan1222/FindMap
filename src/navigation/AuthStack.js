import React from 'react';
import {StyleSheet} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Import your Home-related screens here
import HomeScreen from '../screens/Home/HomeScreen';
import {NAVIGATION_NAME} from '../constants/navigtionConstants';
import {COLOR} from '../constants/colorConstants';
import SearchScreen from '../screens/SearchScreen';
import LognInScreen from '../screens/authentication/LoginScreen';
import RegisterScreen from '../screens/authentication/RegisterScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName={NAVIGATION_NAME.LOGIN_SCREEN}>
        <Stack.Screen
          name={NAVIGATION_NAME.LOGIN_SCREEN}
          component={LognInScreen}
          options={{
            headerShown: false,
            title: 'Đăng nhập',
          }}
        />
        <Stack.Screen
          name={NAVIGATION_NAME.REGISTER}
          component={RegisterScreen}
          options={{
            title: 'Đăng ký',
          }}
        />
    </Stack.Navigator>
  );
};

export default AuthStack;

const headerStyles = StyleSheet.create({
  header: {
    backgroundColor: COLOR.WHITE,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  widthIcon: {
    width: '20%',
  },
});

const styles = StyleSheet.create({});
