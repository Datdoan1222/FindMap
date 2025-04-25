import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import IconStyles from '../../constants/IconStyle';
import {COLOR} from '../../constants/colorConstants';

const ButtonIcon = ({onPress, name, iconSet, color, size = 25}) => {
  return (
    <View style={styles.btn}>
      <TouchableOpacity onPress={onPress}>
        <IconStyles name={name} iconSet={iconSet} color={color} size={size} />
      </TouchableOpacity>
    </View>
  );
};

export default ButtonIcon;

const styles = StyleSheet.create({
  btn: {
    width: 40,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
});
