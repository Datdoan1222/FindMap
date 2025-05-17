import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {inputStyles} from '../../styles/atoms/inputStyles';
// import IconButton from './IconButton';
import {ICON_NAME, ICON_TYPE} from '../../constants/iconConstants';
import {COLOR} from '../../constants/colorConstants';
import {ICON_NAME_URL, IMAGE_NAME} from '../../constants/assetsConstants';
import TextComponent from './TextComponent';
import ButtonIcon from './ButtonIcon';

const Input = ({
  loading,
  isPhone,
  label,
  error,
  disabled,
  onPress,
  placeholder,
  onChangeValue,
  onBlur,
  value,
  isPassword,
  search,
  prefix,
  suffix,
  optional,
  keyboardType,
  required,
  style,
  placeholderTextColor,
  ...res
}) => {
  const isActive = disabled ? 'unActive' : 'active';
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[inputStyles.container, style]}>
      {!isPhone && (
        <View style={{display: 'flex', flexDirection: 'row', gap: 5}}>
          {label && (
            <Text allowFontScaling={false} style={inputStyles.label[isActive]}>
              {label}
            </Text>
          )}
          {required && <TextComponent text={'*'} color={COLOR.DANGER} />}
        </View>
      )}
      <View
        style={[
          inputStyles.input,
          inputStyles.phoneInputContainer,
          isFocused && inputStyles.focusedInput,
          error && inputStyles.errorInput,
          disabled && inputStyles.disabledInput,
        ]}>
        {isPhone && (
          <View
            style={[
              inputStyles.flagContainer,
              error
                ? {borderRightColor: COLOR.DANGER}
                : isFocused && {borderRightColor: COLOR.PRIMARY},
            ]}>
            <Image
              source={{uri: IMAGE_NAME.VIETNAM_FLAG}}
              style={inputStyles.flag}
            />
            <Text allowFontScaling={false} style={inputStyles.countryCode}>
              +84
            </Text>
          </View>
        )}
        {search && (
          <View
            style={{
              paddingLeft: 8,
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center',
            }}>
            <Image source={{uri: ICON_NAME_URL.SEARCH}} style={{width: 32}} />
          </View>
        )}
        {prefix && <View style={inputStyles.prefix}>{prefix}</View>}
        <TextInput
          allowFontScaling={false}
          style={inputStyles.phoneInput}
          secureTextEntry={isPassword}
          keyboardType={keyboardType ?? 'default'}
          placeholderTextColor={placeholderTextColor ?? COLOR.GREY_400}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={!disabled && !optional}
          value={value}
          onChangeText={onChangeValue}
          {...res}
        />
        {suffix && <View style={inputStyles.suffix}>{suffix}</View>}
        {isPhone && (
          <TouchableOpacity style={inputStyles.arrowButton} onPress={onPress}>
            {!loading ? (
              <ButtonIcon
                type={ICON_TYPE.FONT_AWESOME}
                name={ICON_NAME.ARROW_RIGHT}
                color={COLOR.SECONDARY}
                size={32}
                onPress={onPress}
              />
            ) : (
              <ActivityIndicator size="large" color={COLOR.WHITE} />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text allowFontScaling={false} style={inputStyles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
};

export default Input;
