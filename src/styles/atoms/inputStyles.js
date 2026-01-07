import {StyleSheet} from 'react-native';
import {COLOR} from '../../constants/colorConstants';
import {FONT_SIZE} from '../../constants/fontConstants';

export const inputStyles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    active: {
      marginBottom: 5,
      color: COLOR.GREY_900,
      fontWeight: '500',
      fontSize: FONT_SIZE.TITLE,
    },
    unActive: {
      marginBottom: 5,
      color: COLOR.GREY_300,
      fontWeight: '500',
      fontSize: FONT_SIZE.TITLE,
    },
  },

  input: {
    borderWidth: 1,
    borderColor: COLOR.GREY_100,
    backgroundColor: COLOR.WHITE,
    borderRadius: 5,
    paddingLeft: 10,
  },

  focusedInput: {
    borderColor: COLOR.PRIMARY,
  },

  disabledInput: {
    backgroundColor: COLOR.GREY_50,
  },

  errorInput: {
    borderColor: COLOR.DANGER,
  },
  errorText: {
    color: COLOR.DANGER,
    marginTop: 5,
  },

  flagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRightWidth: 0.5,
    borderRightColor: COLOR.GREY_300,
    paddingRight: 10,
    height: '100%',
  },

  flag: {
    width: 42,
    height: 21,
    marginHorizontal: 10,
  },
  countryCode: {
    fontSize: FONT_SIZE.H5,
    color: COLOR.GREY_900,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
  },
  phoneInput: {
    flex: 1,
    fontSize: FONT_SIZE.H5,
    marginLeft: 10,
    height: 38,
    color: COLOR.GREY_950,
    padding: 0,
  },
  arrowButton: {
    padding: 7,
    backgroundColor: COLOR.PRIMARY,
    borderStartEndRadius: 4,
    borderBottomEndRadius: 4,
    zIndex: 99,
  },
  leftIcon: {
    marginRight: 10,
    alignSelf: 'center',
  },
  prefix: {
    marginRight: 10,
    padding: 5,
  },
  suffix: {
    marginLeft: 10,
    padding: 5,
  },
});
