import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Modal from '../component/molecules/Modal';
import {useNavigation} from '@react-navigation/native';

const RegisterRoomScreen = () => {
  const navigation = useNavigation();
  return (
    <View>
      <Modal
        isVisible={true}
        title={'Tính năng đang phát triển'}
        text={'Tính năng đang phát triển'}
        onConfirm={() => navigation.goBack()}
        textConfirm={'Quay lại'}
      />
    </View>
  );
};

export default RegisterRoomScreen;

const styles = StyleSheet.create({});
