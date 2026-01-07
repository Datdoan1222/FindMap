import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import MessengerScreen from './MessengerScreen';
import MessengerDetail from './MessengerDetail';
import {NAVIGATION_NAME} from '../../constants/navigtionConstants';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const MesengerStack = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={NAVIGATION_NAME.MESSENGER_SCREEN}
        component={MessengerScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={NAVIGATION_NAME.MESSENGER_DETAIL_SCREEN}
        component={MessengerDetail}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default MesengerStack;

const styles = StyleSheet.create({});
