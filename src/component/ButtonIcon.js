import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import IconStyles from '../constants/IconStyle';
import {COLOR} from '../constants/colorConstants';

const ButtonIcon = ({onPress, name, iconSet, color, size}) => {
  return (
    <View style={styles.btn}>
      <TouchableOpacity onPress={onPress}>
        <IconStyles name={name} iconSet={iconSet} color={color} size={27} />
      </TouchableOpacity>
    </View>
  );
};

export default ButtonIcon;

const styles = StyleSheet.create({
  btn: {
    width: 50,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
});
