import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import RowComponent from '../../atoms/RowComponent';
import {WIDTH} from '../../../constants/distance';
import IconStyles from '../../../constants/IconStyle';
import {COLOR} from '../../../constants/colorConstants';

const ImageRoom = ({avatar, isEdit, isLook, onPressBanner, onPressImage}) => {
  return (
    <RowComponent justify="center" styles={{width: '100%', height: 200}}>
      {isLook && avatar?.length > 0 && (
        <TouchableOpacity onPress={onPressBanner}>
          <Image
            style={{width: WIDTH, height: 200}}
            source={{uri: avatar[0]}}
          />
        </TouchableOpacity>
      )}
      {isEdit && avatar?.length > 0 ? (
        <TouchableOpacity>
          <Image
            style={{width: WIDTH, height: 200}}
            source={{uri: avatar[0]}}
          />
        </TouchableOpacity>
      ) : (
        !isLook && (
          <TouchableOpacity onPress={onPressImage}>
            <IconStyles name={'add'} size={200} color={COLOR.GRAY4} />
          </TouchableOpacity>
        )
      )}
    </RowComponent>
  );
};

export default ImageRoom;

const styles = StyleSheet.create({});
