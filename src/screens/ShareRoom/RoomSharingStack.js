import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NAVIGATION_NAME} from '../../constants/navigtionConstants';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RoomSharingScreen from './RoomSharingScreen';
import PostRoomSharingForm from './PostRoomSharingForm';

const RoomSharingStack = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={NAVIGATION_NAME.ROOM_SHARING_SCREEN}
        component={RoomSharingScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={NAVIGATION_NAME.POST_ROOM_SHARING_FORM}
        component={PostRoomSharingForm}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default RoomSharingStack;

const styles = StyleSheet.create({});
