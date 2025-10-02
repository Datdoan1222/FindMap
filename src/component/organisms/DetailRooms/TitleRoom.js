import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import RowComponent from '../../atoms/RowComponent';
import TextComponent from '../../atoms/TextComponent';
import {Controller} from 'react-hook-form';
import {FONT} from '../../../constants/fontConstants';
import Input from '../../atoms/Input';

const TitleRoom = ({titleRoom, isLook, isEdit, control, errors}) => {
  console.log(titleRoom, 'sss');

  return (
    <RowComponent>
      {titleRoom && isLook ? (
        <TextComponent
          numberOfLines={2}
          font={FONT.BOLD}
          title
          size={19}
          text={titleRoom || 'Phòng trọ'}
          styles={{fontWeight: 'bold'}}
        />
      ) : (
        <Controller
          name="title"
          control={control}
          defaultValue={titleRoom}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              style={{width: '100%'}}
              label={'Nhập tên phòng trọ'}
              placeholder={'Nhập tên phòng trọ'}
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

export default TitleRoom;

const styles = StyleSheet.create({});
