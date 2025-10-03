import React, {useState} from 'react';
import {View, TextInput, TouchableOpacity, Image} from 'react-native';
import {Controller} from 'react-hook-form';
import RowComponent from '../../atoms/RowComponent';
import {COLOR} from '../../../constants/colorConstants';
import Input from '../../atoms/Input';
import TextComponent from '../../atoms/TextComponent';
import IconStyles from '../../../constants/IconStyle';

const AddressRoom = ({
  addressRoom,
  control,
  errors,
  isLook,
  isEdit,
  isOwner,
  onPressOpenMap,
}) => {
  return (
    <RowComponent
      styles={{width: '100%', marginTop: 10}}
      justify="space-between"
      alignItems="center">
      <Image source={require('../../../assets/images/location.png')} />

      <View style={{flex: 1, marginLeft: 10}}>
        {addressRoom && isLook ? (
          <TextComponent
            size={15}
            text={addressRoom || 'Chưa cập nhật địa chỉ'}
            styles={{fontStyle: 'italic', flex: 1}}
          />
        ) : (
          <TouchableOpacity onPress={onPressOpenMap}>
            <Controller
              name="addressRoom"
              control={control}
              defaultValue={addressRoom}
              render={({field: {onChange, onBlur, value}}) => (
                <View style={{width: '100%'}}>
                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderColor: errors?.addressRoom ? COLOR.DANGER : COLOR.GRAY4,
                      borderRadius: 6,
                      padding: 10,
                      width: '100%',
                      color: COLOR.BLACK1,
                      fontSize: 15,
                    }}
                    placeholder="Nhập địa chỉ phòng trọ"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    editable={false} // thay cho disabled
                    multiline={true} // cho phép nhiều dòng
                  />
                  {errors?.addressRoom?.message && (
                    <Text style={{color: COLOR.DANGER, marginTop: 4}}>
                      {errors.addressRoom.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </TouchableOpacity>
        )}
      </View>
    </RowComponent>
  );
};

export default AddressRoom;
