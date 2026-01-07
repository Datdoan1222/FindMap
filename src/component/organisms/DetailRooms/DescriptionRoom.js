import React, {useState} from 'react';
import {View, TextInput, TouchableOpacity} from 'react-native';
import {COLOR} from '../../../constants/colorConstants';
import IconStyles from '../../../constants/IconStyle';
import RowComponent from '../../atoms/RowComponent';
import TextComponent from '../../atoms/TextComponent';
import {Controller} from 'react-hook-form';
import Input from '../../atoms/Input';
import {FONT} from '../../../constants/fontConstants';

const DescriptionRoom = ({description = '', isLook, control, errors}) => {
  return (
    <RowComponent
      styles={{padding: 15, backgroundColor: COLOR.WHITE, marginTop: 10}}>
      {description && isLook ? (
        <RowComponent
          flexDirection="column"
          justify="flex-start"
          alignItems="flex-start">
          <TextComponent
            size={15}
            styles={{fontWeight: 'bold'}}
            color={COLOR.BLACK1}
            text="Mô tả"
          />
          <TextComponent
            numberOfLines={4}
            size={14}
            text={description || 'Phòng trọ'}
          />
        </RowComponent>
      ) : (
        <Controller
          name="description"
          control={control}
          defaultValue={description}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              style={{width: '100%'}}
              label={'Nhập mô tả phòng trọ'}
              placeholder={'Nhập mô tả phòng trọ'}
              onChangeValue={onChange}
              onBlur={onBlur}
              value={value}
              error={errors.title?.message}
            />
          )}
        />
      )}
    </RowComponent>
  );
};

export default DescriptionRoom;
