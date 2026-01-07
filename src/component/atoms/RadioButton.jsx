import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {COLOR} from '../../constants/colorConstants';
import RowComponent from './RowComponent';
import TextComponent from './TextComponent';
import Space from './Space';
import { FONT_SIZE } from '../../constants/fontConstants';

const CloseButton = ({onClose}) => {
  return (
    <TouchableOpacity onPress={onClose}>
      <AntDesign name="closecircleo" size={20} color={COLOR.GRAYTAB} />
    </TouchableOpacity>
  );
};

const RadioButton = ({
  isChecked,
  text,
  onRadioButtonPress,
  close,
  onClose,
  size = 30, // Default size if not provided
  inline,
  ...res
}) => {
  const innerSize = size * 0.9;

  const _renderCheckedView = () => {
    return isChecked ? (
      <View
        style={[
          radioButtonStyles.radioButtonIconInnerIcon,
          {
            height: innerSize,
            width: innerSize,
            borderRadius: innerSize / 2,
          },
        ]}
      />
    ) : null;
  };

  return (
    <TouchableOpacity
      onPress={onRadioButtonPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        width: inline ? inline : 'auto',
        backgroundColor: 'white',
      }}
      {...res}>
      <RowComponent>
        {/* RadioBtn */}
        <RowComponent
          styles={[
            radioButtonStyles.radioButtonIcon,
            {
              height: size,
              width: size,
              borderRadius: size / 2,
            },
            isChecked && radioButtonStyles.checked,
          ]}>
          {_renderCheckedView()}
        </RowComponent>

        <Space width={10} />
        {text && (
          <TextComponent text={text} flex={1} styles={{paddingRight: 8}} />
        )}

        {close && <TextComponent text={<CloseButton onClose={onClose} />} />}
      </RowComponent>
    </TouchableOpacity>
  );
};

export default RadioButton;
const radioButtonStyles = StyleSheet.create({
  radioButtonIcon: {
    backgroundColor: COLOR.SECONDARY,
    borderWidth: 1.5,
    borderColor: COLOR.GREY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    borderColor: COLOR.PRIMARY, // Màu viền khi đã chọn
  },
  radioButtonIconInnerIcon: {
    backgroundColor: COLOR.PRIMARY,
    borderWidth: 3,
    borderColor: COLOR.SECONDARY,
  },
  radioButtonTextContainer: {
    paddingLeft: 10,
    marginRight: 12,
  },
  radioButtonText: {
    fontSize: FONT_SIZE.TITLE,
    color: COLOR.GRAYTAB,
  },
});
