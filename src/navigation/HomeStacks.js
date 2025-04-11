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

const Stack = createNativeStackNavigator();

const HomeStacks = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={NAVIGATION_NAME.HOME_SCREEN}
        component={HomeScreen}
        options={{
          headerShown: false,
          title: 'Trang chủ',
        }}
      />
      {/* <Stack.Screen
        name={NAVIGATION_NAME.DETAIL_SCREEN}
        component={DetailScreen}
        options={{
          title: 'Chi tiết',
        }}
      /> */}
      <Stack.Screen
        name={NAVIGATION_NAME.SEARCH_SCREEN}
        component={SearchScreen}
        options={{
          headerShown: false,
          title: 'Tìm kiếm',
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
