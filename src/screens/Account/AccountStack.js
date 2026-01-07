import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Import your Home-related screens here
import {NAVIGATION_NAME} from '../../constants/navigtionConstants';
import AccountScreen from './AccountScreen';
import InforRoomScreen from './InforRoomScreen';
import InforRoomDetailScreen from './InforRoomDetailScreen';
import InforTransferScreen from './InforTransferScreen';
import InforCameraScreen from './InforCameraScreen';
import InforOwnerScreen from './InforOwnerScreen';
import RoomDetailScreen from '../Home/post/RoomDetailScreen';
import { COLOR } from '../../constants/colorConstants';
import { FONT, FONT_SIZE } from '../../constants/fontConstants';

const Stack = createNativeStackNavigator();

const AccountStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={NAVIGATION_NAME.ACCOUNT_SCREEN}
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
        name={NAVIGATION_NAME.ACCOUNT_SCREEN}
        component={AccountScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={NAVIGATION_NAME.INFOR_ROOMS_SCREEN}
        component={InforRoomScreen}
        options={{
          //   headerShown: false,
          title: 'Phòng trọ của tôi',
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
        name={NAVIGATION_NAME.INFOR_ROOMS_DETAIL_SCREEN}
        component={InforRoomDetailScreen}
        options={{
          //   headerShown: false,
          title: 'Chi tiết phòng',
        }}
      />
      <Stack.Screen
        name={NAVIGATION_NAME.INFOR_TRANSFER_SCREEN}
        component={InforTransferScreen}
        options={{
          //   headerShown: false,
          title: 'Thanh toán',
        }}
      />
      <Stack.Screen
        name={NAVIGATION_NAME.INFOR_CAMERA_SCREEN}
        component={InforCameraScreen}
        options={{
          //   headerShown: false,
          title: 'Camera',
        }}
      />
      <Stack.Screen
        name={NAVIGATION_NAME.INFOR_OWNER_SCREEN}
        component={InforOwnerScreen}
        options={{
          //   headerShown: false,
          title: 'Liên hệ',
        }}
      />
    </Stack.Navigator>
  );
};

export default AccountStack;
