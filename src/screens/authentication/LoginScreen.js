import {StyleSheet, View, Alert, Dimensions} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';

import LoginForm from '../../component/organisms/LoginForm';
import {useSelector, useDispatch} from 'react-redux';
import {login} from '../../redux/authSlide';
import {COLOR} from '../../constants/colorConstants';
import {NAVIGATION_NAME} from '../../constants/navigtionConstants';
import ButtonIcon from '../../component/atoms/ButtonIcon';
const {width, height} = Dimensions.get('window');

const LoginScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const error = useSelector(state => state.auth.error);

  const LoginWithEmail = data => {
    const email = data.email;
    const password = data.password;
    // dispatch(login("zxc@gmail.com", "zxczxc"));
    dispatch(login(email, password));
  };
  useEffect(() => {
    if (user) {
      console.log('Đăng nhập thành công', user);
      navigation.navigate(NAVIGATION_NAME.BOTTOM_TAB, {
        screen: NAVIGATION_NAME.MAIN_SCREEN,
      });
    }

    if (error) {
      console.log('Đăng nhập thất bại', error);
      Alert.alert('Đăng Nhập', 'Tài khoản không tồn tại', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
    }
  }, [user, error]);

  return (
    <>
      <ButtonIcon
        onPress={() =>
          navigation.navigate(NAVIGATION_NAME.BOTTOM_TAB, {
            screen: NAVIGATION_NAME.ACCOUNT_SCREEN,
          })
        }
        name="arrow-back-outline"
        color="black"
        size={25}
      />
      <View style={styles.container}>
        <LoginForm
          login
          title="Đăng nhập"
          onPress={() => navigation.navigate(NAVIGATION_NAME.REGISTER_SCREEN)}
          onsubmit={LoginWithEmail}
        />
      </View>
    </>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.BACKGROUND,
    marginHorizontal: 30,
    marginVertical: 10,
  },
});
