import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';

import IconStyles from '../constants/IconStyle';

import {STYLES_TABBAR} from '../constants/tabBarStyle';
import {COLOR} from '../constants/colorConstants';
import {NAVIGATION_NAME} from '../constants/navigtionConstants';
import {ICON_TYPE} from '../constants/iconConstants';

import HomeScreen from '../screens/Home/HomeScreen';
import MessengerScreen from '../screens/Messenger/MessengerScreen';
import MapScreen from '../screens/Map/MapScreen';
import AccountScreen from '../screens/Account/AccountScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const BottomTab = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === NAVIGATION_NAME.HOME_SCREEN) {
            iconName = focused
              ? ICON_TYPE.ICON_HOME
              : ICON_TYPE.ICON_HOME_OUTLINE;
          } else if (route.name === NAVIGATION_NAME.MESSENGER_SCREEN) {
            iconName = focused
              ? ICON_TYPE.ICON_MESSENGER
              : ICON_TYPE.ICON_MESSENGER_OUTLINE;
          } else if (route.name === NAVIGATION_NAME.MAP_SCREEN) {
            iconName = focused
              ? ICON_TYPE.ICON_MAP
              : ICON_TYPE.ICON_MAP_OUTLINE;
          } else if (route.name === NAVIGATION_NAME.ACCOUNT_SCREEN) {
            iconName = focused
              ? ICON_TYPE.ICON_ACCOUNT
              : ICON_TYPE.ICON_ACCOUNT_OUTLINE;
          }

          return <IconStyles name={iconName} color={COLOR.PRIMARY} size={23} />;
        },
        tabBarActiveTintColor: COLOR.PRIMARY,
        tabBarInactiveTintColor: COLOR.GRAY,
        tabBarStyle: STYLES_TABBAR.tabBar,
        tabBarLabelStyle: STYLES_TABBAR.label,
      })}>
      <Tab.Screen
        name={NAVIGATION_NAME.HOME_SCREEN}
        component={HomeScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
          tabBarLabel: 'Trang chủ',
        }}
      />
      <Tab.Screen
        name={NAVIGATION_NAME.MESSENGER_SCREEN}
        component={MessengerScreen}
        options={{headerShown: false, tabBarLabel: 'Tin nhắn', tabBarBadge: 3}}
      />
      <Tab.Screen
        name={NAVIGATION_NAME.MAP_SCREEN}
        component={MapScreen}
        options={{headerShown: false, tabBarLabel: 'Bản đồ'}}
      />
      <Tab.Screen
        name={NAVIGATION_NAME.ACCOUNT_SCREEN}
        component={AccountScreen}
        options={{headerShown: false, tabBarLabel: 'Cá nhân'}}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer independent={true}>
      <BottomTab />
    </NavigationContainer>
  );
};

export default AppNavigator;
