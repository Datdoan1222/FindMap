import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';

//CONSTANTS
import IconStyles from '../constants/IconStyle';
import {STYLES_TABBAR} from '../constants/tabBarStyle';
import {COLOR} from '../constants/colorConstants';
import {NAVIGATION_NAME} from '../constants/navigtionConstants';
import {ICON_TYPE} from '../constants/iconConstants';

//SCREEN
import MessengerScreen from '../screens/Messenger/MessengerScreen';
import MapScreen from '../screens/Map/MapScreen';
import AccountScreen from '../screens/Account/AccountScreen';
import HomeStacks from './HomeStacks';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const BottomTab = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused}) => {
          let iconName;
          let iconColor = focused ? COLOR.PRIMARY : COLOR.GRAY3;
          if (route.name === NAVIGATION_NAME.MAIN_SCREEN) {
            iconName = ICON_TYPE.ICON_HOME;
          } else if (route.name === NAVIGATION_NAME.MESSENGER_SCREEN) {
            iconName = ICON_TYPE.ICON_MESSENGER;
          } else if (route.name === NAVIGATION_NAME.MAP_SCREEN) {
            iconName = ICON_TYPE.ICON_MAP;
          } else if (route.name === NAVIGATION_NAME.ACCOUNT_SCREEN) {
            iconName = ICON_TYPE.ICON_ACCOUNT;
          }

          return <IconStyles name={iconName} color={iconColor} size={25} />;
        },
        tabBarActiveTintColor: COLOR.PRIMARY,
        tabBarInactiveTintColor: COLOR.GRAY,
        tabBarStyle: STYLES_TABBAR.tabBar,
        tabBarLabelStyle: STYLES_TABBAR.label,
      })}>
      <Tab.Screen
        name={NAVIGATION_NAME.MAIN_SCREEN}
        component={HomeStacks}
        options={{
          headerShown: false,
          gestureEnabled: false,
          tabBarLabel: 'Trang chủ',
        }}
      />
      <Tab.Screen
        name={NAVIGATION_NAME.MESSENGER_SCREEN}
        component={MessengerScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Tin nhắn',
          tabBarBadge: 3,
        }}
      />
      <Tab.Screen
        name={NAVIGATION_NAME.MAP_SCREEN}
        component={MapScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Bản đồ',
        }}
      />
      <Tab.Screen
        name={NAVIGATION_NAME.ACCOUNT_SCREEN}
        component={AccountScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Cá nhân',
        }}
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
