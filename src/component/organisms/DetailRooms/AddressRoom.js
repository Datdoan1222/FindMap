import React, {useState} from 'react';
import {View, TextInput, TouchableOpacity, Image} from 'react-native';
import {Controller} from 'react-hook-form';
import RowComponent from '../../atoms/RowComponent';
import {COLOR} from '../../../constants/colorConstants';
import Input from '../../atoms/Input';
import TextComponent from '../../atoms/TextComponent';
import IconStyles from '../../../constants/IconStyle';

const AddressRoom = ({
  titleRoom,
  addressRoom,
  control,
  errors,
  isLook,
  isEdit,
  isOwner,
}) => {
  return (
    <RowComponent
      styles={{width: '100%', marginTop: 10}}
      justify="space-between"
      alignItems="center">
      <Image source={require('../../../assets/images/location.png')} />

      <View style={{flex: 1, marginLeft: 10}}>
        {titleRoom && isLook ? (
          <TextComponent
            size={15}
            text={addressRoom || 'Chưa cập nhật địa chỉ'}
            styles={{fontStyle: 'italic', flex: 1}}
          />
        ) : (
          <Controller
            name="address"
            control={control}
            defaultValue={addressRoom}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                style={{width: '100%'}}
                label="Nhập địa chỉ phòng trọ"
                placeholder="Nhập địa chỉ phòng trọ"
                onChangeValue={onChange}
                onBlur={onBlur}
                value={value}
                error={errors?.address?.message}
              />
            )}
          />
        )}
      </View>
    </RowComponent>
  );
};

export default AddressRoom;
