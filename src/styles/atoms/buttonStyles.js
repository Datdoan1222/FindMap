import {StyleSheet} from 'react-native';
import {FONT, FONT_SIZE} from '../../constants/fontConstants';
import {COLOR} from '../../constants/colorConstants';

export const buttonStyles = StyleSheet.create({
  container: {
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontFamily: FONT.REGULAR,
    fontWeight: 'bold',
    lineHeight: 16.41,
    fontSize: FONT_SIZE.TITLE,
  },

  // Kiểu dáng cho các loại nút
  containerTypes: {
    primary: {
      backgroundColor: COLOR.PRIMARY,
      borderRadius: 999,
    },
    secondary: {
      borderWidth: 1,
      backgroundColor: COLOR.GRAY1,
      borderRadius: 999,
      borderColor: COLOR.PRIMARY,
    },
    danger: {
      borderWidth: 1,
      backgroundColor: COLOR.GRAY1,
      borderColor: COLOR.DANGER,
    },
    disabled: {
      backgroundColor: COLOR.GREY_100,
    },
    primaryBorder: {
      borderWidth: 1,
      borderColor: COLOR.PRIMARY,
      backgroundColor: COLOR.BLUE_100,
      borderRadius: 999,
    },
    outline: {
      borderWidth: 1,
      borderColor: COLOR.GREY_300,
      backgroundColor: COLOR.WHITE,
      borderRadius: 999,
    },
    outlineGrey: {
      borderWidth: 1,
      borderColor: COLOR.GREY_100,
      backgroundColor: COLOR.GREY_100,
      borderRadius: 999,
    },
  },

  // Kiểu dáng cho các kích thước nút
  containerSizes: {
    small: {paddingVertical: 10, paddingHorizontal: 15},
    medium: {paddingVertical: 10, paddingHorizontal: 20},
    large: {paddingVertical: 13, paddingHorizontal: 20},
    empty: {paddingVertical: 10, paddingHorizontal: 0},
  },

  // Kiểu dáng văn bản cho các loại nút
  textColors: {
    primary: {color: COLOR.WHITE},
    secondary: {color: COLOR.PRIMARY},
    danger: {color: COLOR.DANGER},
    empty: {color: COLOR.BLACK},
    disabled: {color: COLOR.GREY_400},
    primaryBorder: {color: COLOR.PRIMARY},
    outline: {color: COLOR.GREY_900},
    outlineGrey: {color: COLOR.GREY_900},
  },
});
