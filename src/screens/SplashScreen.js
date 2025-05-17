import {Image, StyleSheet, Text, View, Dimensions} from 'react-native';
import React from 'react';
import RowComponent from '../component/atoms/RowComponent';
import TextComponent from '../component/atoms/TextComponent';
import {COLOR} from '../constants/colorConstants';
import Button from '../component/atoms/Button';
import {BUTTON_SIZE, BUTTON_TYPE} from '../constants/buttonConstants';
import Space from '../component/atoms/Space';
import {useNavigation} from '@react-navigation/native';
import {NAVIGATION_NAME} from '../constants/navigtionConstants';
const {width, height} = Dimensions.get('window');
const SplashScreen = () => {
  const navigation = useNavigation();
  return (
    <RowComponent
      flexDirection="column"
      justify="center"
      alignItems="center"
      styles={styles.container}>
      <Image
        source={require('../assets/images/logo_phongtro.png')}
        style={styles.image_logo}
      />
      <TextComponent styles={styles.text_logo} text="PHONG TRO" />
      <Space height={100} />
      <Button
        size={BUTTON_SIZE.LARGE}
        type={BUTTON_TYPE.OUTLINE}
        title="Tiếp tục"
        onPress={() => {
          navigation.navigate(NAVIGATION_NAME.BOTTOM_TAB);
        }}
      />
    </RowComponent>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.PRIMARY,
    height: height,
    width: width,
  },
  image_logo: {
    width: 300,
    height: 300,
  },
  text_logo: {
    letterSpacing: 2,
    fontWeight: 'bold',
    fontSize: 27,
    color: COLOR.WHITE,
  },
});
