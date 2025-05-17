import React from 'react';
import {buttonStyles} from '../../styles/atoms/buttonStyles';
import {BUTTON_TYPE, BUTTON_SIZE} from '../../constants/buttonConstants';
import {Text, TouchableOpacity} from 'react-native';
import Space from './Space';

const Button = ({
  title,
  type = BUTTON_TYPE.PRIMARY,
  size = BUTTON_SIZE.MEDIUM,
  onPress,
  prefix,
  suffix,
  disabled,
  ...res
}) => {
  const buttonStyle = [
    buttonStyles.container,
    buttonStyles.containerTypes[type],
    buttonStyles.containerSizes[size],
  ];

  const textStyle = [buttonStyles.title, buttonStyles.textColors[type]];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      {...res}
      disabled={disabled}>
      {prefix ?? null}
      <Space width={10} />
      <Text allowFontScaling={false} style={textStyle}>
        {title}
      </Text>
      <Space width={10} />

      {suffix ?? null}
    </TouchableOpacity>
  );
};

export default Button;
