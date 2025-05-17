import {StyleSheet} from 'react-native';
import {FONTFAMILIES, fontFamilies} from '../constants/fontFamilies';
import {COLOR} from '../constants/colorConstants';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.GRAY2,
    justifyContent: 'center',
  },

  button: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    minHeight: 40,
    backgroundColor: COLOR.PRIMARY,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLOR.PRIMARY,
    // marginHorizontal: 10,
  },

  section: {
    marginTop: 10,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  shadow: {
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },

  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
    borderRadius: 100,
  },

  text: {
    fontFamily: FONTFAMILIES.regular,
    fontSize: 14,
    color: COLOR.BLACK1,
  },
});
