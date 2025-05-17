import {StyleSheet, TextInput, Text, Dimensions, View} from 'react-native';
import React from 'react';
import {Controller} from 'react-hook-form';
import {COLOR} from '../../constants/colorConstants';
const {width, height} = Dimensions.get('window');

const Inputs = ({
  control,
  name,
  rules,
  errors,
  placeholder,
  secureTextEntry = false,
  login,
  description,
}) => {
  return (
    <>
      <Controller
        control={control}
        rules={rules}
        render={({field: {onChange, onBlur, value}}) => (
          <View
            style={[styles.inputContainer, {width: width - 60, height: 50}]}>
            <TextInput
              style={[styles.input, errors && styles.inputError]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder={placeholder}
              secureTextEntry={secureTextEntry}
              autoCapitalize="none"
            />
          </View>
        )}
        name={name}
        defaultValue=""
      />
      {!login && description && (
        <Text style={[styles.description, errors && {color: COLOR.ERROR}]}>
          {description}
        </Text>
      )}
    </>
  );
};

export default Inputs;

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 10,
  },
  input: {
    height: 60,
    borderRadius: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    position: 'relative',
    backgroundColor: '#fff',
    overflow: 'hidden',
    fontSize: 15,
    fontStyle: 'italic',
    borderWidth: 0.5,
    borderColor: COLOR.GREY_100,
    color: COLOR.TEXT,
  },
  inputError: {
    borderWidth: 1,
    borderColor: COLOR.ERROR,
  },
  description: {
    marginTop: 15,
    marginHorizontal: 5,
    fontSize: 15,
    color: COLOR.SECONDARY,
    fontStyle: 'italic',
  },
});
