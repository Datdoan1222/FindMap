import {StyleSheet} from 'react-native';
import {COLOR} from '../../constants/colorConstants';
import {FONT_SIZE} from '../../constants/fontConstants';

export const loginFormStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.SECONDARY,
    paddingHorizontal: 14,
    paddingVertical: 54,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 21,
    fontWeight: '500',
    color: COLOR.GREY_900,
    lineHeight: 23,
    textAlign: 'center',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  separator: {
    height: 1,
    width: '40%',
    backgroundColor: COLOR.GREY_400,
  },
  centerText: {
    textAlign: 'center',
    color: COLOR.PRIMARY,
    fontSize: FONT_SIZE.BODY_2,
  },
  orText: {
    textAlign: 'center',
    marginVertical: 20,
    fontWeight: '600',
    fontSize: FONT_SIZE.TITLE,
    color: COLOR.GREY_400,
  },
});
