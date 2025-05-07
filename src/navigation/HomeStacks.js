import React from 'react';
import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import your Home-related screens here
import HomeScreen from '../screens/Home/HomeScreen';
// import DetailScreen from '../screens/Home/DetailScreen';
// import SearchScreen from '../screens/Home/SearchScreen';
import { NAVIGATION_NAME } from '../constants/navigtionConstants';
import { COLOR } from '../constants/colorConstants';
import HeaderComponent from '../component/molecules/HeaderComponent';
import SearchScreen from '../screens/SearchScreen';
import PostDetailScreen from '../screens/Home/post/PostDetailScreen';
import MyRoomScreen from '../screens/MyRoomScreen';
import RoomSharingScreen from '../screens/RoomSharingScreen';
import FavouriteScreen from '../screens/FavouriteScreen';
import RegisterRoomScreen from '../screens/RegisterRoomScreen';
import { FONT, FONT_SIZE } from '../constants/fontConstants';

const Stack = createNativeStackNavigator();

const HomeStacks = () => {
  return (
    <Stack.Navigator
      initialRouteName={NAVIGATION_NAME.HOME_SCREEN}
      screenOptions={{
        headerStyle: {
          backgroundColor: COLOR.PRIMARY,
        },
        headerTitleStyle: {
          fontSize: FONT_SIZE.H5, 
          fontFamily: FONT.BOLD, 
        },
        headerTintColor: COLOR.WHITE, 
      }}>
      <Stack.Screen
        name={NAVIGATION_NAME.HOME_SCREEN}
        component={HomeScreen}
        options={{
          headerShown: false,
          title: 'Trang chủ',
        }}
      />
      <Stack.Screen
        name={NAVIGATION_NAME.POST_DETAIL_SCREEN}
        component={PostDetailScreen}
        options={{
          title: 'Chi tiết',
        }}
      />
      <Stack.Screen
        name={NAVIGATION_NAME.SEARCH_SCREEN}
        component={SearchScreen}
        options={{
          headerShown: false,
          title: 'Tìm kiếm',
        }}
      />
      <Stack.Screen
        name={NAVIGATION_NAME.MY_ROOM_SCREEN}
        component={MyRoomScreen}
        options={{
          // headerShown: false,
          headerTitleAlign: 'center',
          title: 'Phòng của tôi',
        }}
      />
      <Stack.Screen
        name={NAVIGATION_NAME.SHARE_ROOM_SCREEN}
        component={RoomSharingScreen}
        options={{
          // headerShown: false,
          headerTitleAlign: 'center',
          title: 'Ghép phòng',
        }}
      />
      <Stack.Screen
        name={NAVIGATION_NAME.FAVOURITE_SCREEN}
        component={FavouriteScreen}
        options={{
          // headerShown: false,
          headerTitleAlign: 'center',
          title: 'Yêu thích',
        }}
      />
      <Stack.Screen
        name={NAVIGATION_NAME.REGISTER_ROOM_SCREEN}
        component={RegisterRoomScreen}
        options={{
          // headerShown: false,
          headerTitleAlign: 'center',
          title: 'Đăng kí phòng',
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeStacks;

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
