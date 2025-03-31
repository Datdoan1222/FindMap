import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {COLOR} from '../../constants/colorConstants';
import ButtonIcon from '../../component/ButtonIcon';
import {ICON_TYPE} from '../../constants/iconConstants';
import Header from '../../component/Header';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Header />
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
    // backgroundColor: 'black',
  },
});
