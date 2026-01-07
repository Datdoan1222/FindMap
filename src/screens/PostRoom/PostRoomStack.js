import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NAVIGATION_NAME} from '../../constants/navigtionConstants';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PostRoomScreen from './PostRoomScreen';
import PostRoomDetailScreen from './PostRoomDetailScreen';
import {COLOR} from '../../constants/colorConstants';
import {FONT, FONT_SIZE} from '../../constants/fontConstants';
import SelectRoomScreen from './SelectRoomScreen';

const PostRoomStack = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLOR.PRIMARY,
        },
        headerTitleStyle: {
          fontSize: FONT_SIZE.H5,
          fontFamily: FONT.BOLD,
          fontWeight: 'bold',
        },
        headerTintColor: COLOR.WHITE,
      }}>
      <Stack.Screen
        name={NAVIGATION_NAME.POST_ROOM_SCREEN}
        component={PostRoomScreen}
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
          title: 'Đăng bài',
        }}
      />
      <Stack.Screen
        name={NAVIGATION_NAME.POST_ROOM_DETAIL_SCREEN}
        component={PostRoomDetailScreen}
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
          title: 'Đăng bài',
        }}
      />
      <Stack.Screen
        name={NAVIGATION_NAME.SELECT_ROOM_SCREEN}
        component={SelectRoomScreen}
        options={{
          headerShown: false,
          // headerTitleAlign: 'center',
          // title: 'Chọn phòng',
        }}
      />
    </Stack.Navigator>
  );
};

export default PostRoomStack;

const styles = StyleSheet.create({});
