import React from 'react';
import {StyleSheet} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Import your Home-related screens here
import HomeScreen from '../screens/Home/HomeScreen';
// import DetailScreen from '../screens/Home/DetailScreen';
// import SearchScreen from '../screens/Home/SearchScreen';
import {NAVIGATION_NAME} from '../constants/navigtionConstants';
import {COLOR} from '../constants/colorConstants';
import HeaderComponent from '../component/molecules/HeaderComponent';
import SearchScreen from '../screens/SearchScreen';
import PostDetailScreen from '../screens/Home/post/PostDetailScreen';
import MyRoomScreen from '../screens/MyRoomScreen';
import RoomSharingScreen from '../screens/ShareRoom/RoomSharingScreen';
import FavouriteScreen from '../screens/FavouriteScreen';
import {FONT, FONT_SIZE} from '../constants/fontConstants';
import RoomSharingStack from '../screens/ShareRoom/RoomSharingStack';
import CurrentAddressScreen from '../screens/Home/CurrentAddressScreen';
import ManagerRoomScreen from '../screens/ManagerRoomScreen';
import RoomDetailScreen from '../screens/Home/post/RoomDetailScreen';
import AddRoomScreen from '../screens/AddRoomScreen';
import PostRoomStack from '../screens/PostRoom/PostRoomStack';
import RoomForRentScreen from '../screens/Home/post/RoomForRentScreen';

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
      {/* <Stack.Screen
        name={NAVIGATION_NAME.ROOM_SHARING_STACK}
        component={RoomSharingStack}
        options={{
          // headerShown: false,
          headerTitleAlign: 'center',
          title: 'Ghép phòng',
        }}
      /> */}
      <Stack.Screen
        name={NAVIGATION_NAME.POST_ROOM_STACK}
        component={PostRoomStack}
        options={{
          headerShown: false,
          headerTitleAlign: 'center',
          title: 'Đăng bài',
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
        name={NAVIGATION_NAME.MANAGER_ROOM_SCREEN}
        component={ManagerRoomScreen}
        options={{
          headerShown: false,
          headerTitleAlign: 'center',
          title: 'Quản lí phòng',
        }}
      />
      <Stack.Screen
        name={NAVIGATION_NAME.ADD_ROOM_SCREEN}
        component={AddRoomScreen}
        options={{
          // headerShown: false,
          headerTitleAlign: 'center',
          title: 'Thêm phòng',
        }}
      />
      <Stack.Screen
        name={NAVIGATION_NAME.ROOM_DETAIL_SCREEN}
        component={RoomDetailScreen}
        options={{
          // headerShown: false,
          headerTitleAlign: 'center',
          title: 'Chi tiết phòng',
        }}
      />
      <Stack.Screen
        name={NAVIGATION_NAME.ROOM_FORRENT_SCREEN}
        component={RoomForRentScreen}
        options={{
          // headerShown: false,
          headerTitleAlign: 'center',
          title: 'Cho thuê phòng',
        }}
      />
      {/* chọn khu vực */}
      <Stack.Screen
        name={NAVIGATION_NAME.CURRENT_ADDRESS_SCREEN}
        component={CurrentAddressScreen}
        options={{
          // headerShown: false,
          headerTitleAlign: 'center',
          title: 'Chọn khu vực',
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
