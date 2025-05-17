import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import ButtonIcon from '../atoms/ButtonIcon';
import {COLOR} from '../../constants/colorConstants';
import RowComponent from '../atoms/RowComponent';
import TextComponent from '../atoms/TextComponent';
import {set} from '@react-native-firebase/database';
import InputComponent from '../atoms/InputComponent';
import {useNavigation} from '@react-navigation/native';
import {NAVIGATION_NAME} from '../../constants/navigtionConstants';
const {width, height} = Dimensions.get('window');
const HeaderComponent = ({
  title,
  onPressLeft,
  onPressRight,
  iconLeft = 'arrow-back',
  iconRight = 'menu',
  search = false,
  masterScreen = false,
}) => {
  const navigation = useNavigation();
  const [valueSearch, setValueSearch] = useState('');
  return (
    <RowComponent
      styles={styles.header}
      justify="space-between"
      alignItems="center"
      flexDirection="row">
      {search ? (
        <>
          <RowComponent
            styles={styles.widthIcon}
            justify="center"
            onPress={onPressLeft}>
            {onPressLeft && (
              <ButtonIcon
                color={COLOR.BLACK1}
                name={iconLeft}
                onPress={onPressLeft}
              />
            )}
          </RowComponent>
          <RowComponent
            styles={styles.widthTitle}
            justify="flex-start"
            onPress={() => navigation.navigate(NAVIGATION_NAME.SEARCH_SCREEN)}>
            <InputComponent
              placeholder="Bạn muốn tìm phòng trọ nào?"
              keyboardType="search"
              value={valueSearch}
              onChangeText={setValueSearch}
            />
          </RowComponent>

          <RowComponent styles={styles.widthIcon} justify="center">
            {onPressRight && (
              <ButtonIcon
                color={COLOR.BLACK1}
                name={search ? 'search' : iconRight}
                onPress={onPressRight}
                size={21}
              />
            )}
          </RowComponent>
        </>
      ) : masterScreen ? (
        <>
          <RowComponent styles={[styles.widthTitle]} justify="flex-start">
            <TextComponent
              styles={styles.textTitle}
              text={title}
              color={COLOR.TEXT}
              size={18}
            />
          </RowComponent>
          <RowComponent styles={styles.widthIcon} justify="center">
            {onPressLeft && (
              <ButtonIcon
                color={COLOR.BLACK1}
                name={iconLeft}
                onPress={onPressLeft}
              />
            )}
          </RowComponent>
          <RowComponent styles={styles.widthIcon} justify="center">
            {onPressRight && (
              <ButtonIcon
                color={COLOR.BLACK1}
                name={iconRight}
                onPress={onPressRight}
              />
            )}
          </RowComponent>
        </>
      ) : (
        <>
          <RowComponent styles={styles.widthIcon} justify="center">
            {onPressLeft && (
              <ButtonIcon
                color={COLOR.BLACK1}
                name={iconLeft}
                onPress={onPressLeft}
              />
            )}
          </RowComponent>
          <RowComponent justify="center">
            <TextComponent
              styles={styles.textTitle}
              text={title}
              color={COLOR.TEXT}
              size={18}
            />
          </RowComponent>
          <RowComponent styles={styles.widthIcon} justify="center">
            {onPressRight && (
              <ButtonIcon
                color={COLOR.BLACK1}
                name={iconRight}
                onPress={onPressRight}
              />
            )}
          </RowComponent>
        </>
      )}
    </RowComponent>
  );
};

export default HeaderComponent;

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLOR.WHITE,
    paddingTop: 5,
    marginHorizontal: 20,
    marginVertical: 20,
  },
  widthIcon: {
    width: width * 0.1,
  },

  widthTitle: {
    width: width * 0.67,
  },
  textTitle: {
    letterSpacing: 2,
    fontWeight: 'bold',
    fontSize: 20,
    color: COLOR.TEXT,
  },
});
