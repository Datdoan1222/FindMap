import {StyleSheet} from 'react-native';
import {COLOR} from '../../constants/colorConstants';
import {FONT_SIZE} from '../../constants/fontConstants';

export const modalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  containerTransparent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: COLOR.WHITE,
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZE.H4,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: COLOR.TEXT,
  },
  text: {
    fontSize: FONT_SIZE.BODY_1,
    color: COLOR.TEXT,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 10,
  },
});
