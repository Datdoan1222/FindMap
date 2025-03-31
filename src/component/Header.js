import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import ButtonIcon from './ButtonIcon';
import {ICON_TYPE} from '../constants/iconConstants';
import {COLOR} from '../constants/colorConstants';

const Header = () => {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.title}>Trang chủ</Text>
      </View>
      <View>
        <ButtonIcon
          name={ICON_TYPE.ICON_SETTING}
          color={COLOR.WHITE}
          size={26}
        />
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  title: {
    width: '100%',
    fontSize: 20,
    fontWeight: 'bold',
    color: COLOR.WHITE,
  },
  header: {
    width: '100%',
    backgroundColor: COLOR.PRIMARY,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});
