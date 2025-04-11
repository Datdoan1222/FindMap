import React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {globalStyles} from '../../styles/globalStyles';
import {FONTFAMILIES} from '../../constants/fontFamilies';
import Space from './Space';
import {COLOR} from '../../constants/colorConstants';

const TextComponent = ({
  text,
  size,
  flex,
  title,
  font,
  color,
  styles,
  onPress,
  required,
}) => {
  const fontSizeDefault = Platform.OS === 'ios' ? 14 : 16;

  return (
    <View style={{flex: flex ?? 0}}>
      <Text
        style={[
          globalStyles.text,
          {
            color: color ?? COLOR.BLACK1,
            fontSize: size ? size : title ? 20 : fontSizeDefault,
            fontFamily: font
              ? font
              : title
              ? FONTFAMILIES.bold
              : FONTFAMILIES.regular,
          },
          styles,
        ]}
        onPress={onPress}>
        {text}
        <Space width={4} />
        {required && <Text style={[styless.requiredText]}>*</Text>}
      </Text>
    </View>
  );
};

const styless = StyleSheet.create({
  requiredText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});

export default TextComponent;
