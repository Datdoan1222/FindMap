import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import HeaderComponent from '../../component/molecules/HeaderComponent';
import {COLOR} from '../../constants/colorConstants';
import {useNavigation} from '@react-navigation/native';
import {NAVIGATION_NAME} from '../../constants/navigtionConstants';

const HomeScreen = () => {
  const navigation = useNavigation();
  const onPressRight = () => {
    navigation.navigate(NAVIGATION_NAME.SEARCH_SCREEN);
  };
  const onPressLeft = () => {};
  return (
    <View style={styles.container}>
      <HeaderComponent
        title="Trang chủ"
        onPressRight={() => {
          onPressRight();
        }}
        onPressLeft={() => {
          onPressLeft();
        }}
        iconLeft="heart-outline"
        iconRight="search"
        masterScreen={true}
      />
      <View style={styles.feed}>
        {/* 1 bài đăng */}
        <View style={styles.post}>
          <View style={styles.header_post}>
            <View style={styles.imgUser_post}></View>
            <View style={styles.nameUser_post}></View>
          </View>
          <View style={styles.content_post}>{/* image */}</View>
          <View style={styles.interact_post}></View>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.WHITE,
    flex: 1,
  },
});
