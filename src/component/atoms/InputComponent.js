import {StyleSheet, Text, View, TextInput} from 'react-native';
import React from 'react';
import {COLOR} from '../../constants/colorConstants';

const InputComponent = ({
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  style,
  value,
  onChangeText,
  ...props
}) => {
  return (
    <View style={styles.contaiInput}>
      <TextInput
        style={[styles.input, style]}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        value={value}
        onChangeText={onChangeText}
        {...props}
      />
    </View>
  );
};

export default InputComponent;

const styles = StyleSheet.create({
  contaiInput: {
    width: '100%',
    marginVertical: 10,
  },
  input: {
    backgroundColor: 'white',
    width: '100%',
    padding: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: COLOR.GRAY1,
    fontSize: 11,
    fontStyle: 'italic',
    fontFamily: 'Roboto-Regular',
  },
});
