import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import RowComponent from '../../atoms/RowComponent';
import {COLOR} from '../../../constants/colorConstants';
import TextComponent from '../../atoms/TextComponent';
import {toPrice} from '../../../utill/toPrice';
import {Controller} from 'react-hook-form';
import Input from '../../atoms/Input';
import Button from '../../atoms/Button';
import Space from '../../atoms/Space';
import {BUTTON_TYPE} from '../../../constants/buttonConstants';
import IconStyles from '../../../constants/IconStyle';
import {ICON_NAME} from '../../../constants/iconConstants';

const PriceRoom = ({
  price,
  isLook,
  control,
  errors,
  onPressSMS,
  onPressCall,
}) => {
  return (
    <RowComponent
      flexDirection="column"
      justify="space-between"
      alignItems="flex-start"
      styles={{
        backgroundColor: COLOR.WHITE,
        paddingHorizontal: 15,
        paddingVertical: 20,
        elevation: 4,
        borderWidth: 2,
        borderColor: COLOR.GRAY2,
      }}>
      {price && isLook ? (
        <RowComponent
          flexDirection="column"
          justify="flex-start"
          alignItems="flex-start">
          <TextComponent
            size={15}
            styles={{fontWeight: 'bold'}}
            color={COLOR.BLACK1}
            text="Giá thuê theo tháng"
          />
          <Space height={5} />
          <TextComponent
            size={20}
            styles={{fontWeight: 'bold'}}
            text={`${toPrice(price)} đ`}
            color={COLOR.DANGER}
          />
        </RowComponent>
      ) : (
        <RowComponent
          flexDirection="row"
          alignItems="center"
          justify="center"
          styles={{width: '50%'}}>
          <Controller
            name="price"
            control={control}
            defaultValue={price}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                style={{width: '100%'}}
                label={'Nhập tiền thuê trên tháng'}
                placeholder={'Nhập tiền'}
                onChangeValue={onChange}
                onBlur={onBlur}
                value={value}
                error={errors.price?.message}
              />
            )}
          />
          <TextComponent size={20} text={` đ`} />
        </RowComponent>
      )}
      <Space height={10} />
      {isLook && (
        <RowComponent
          flexDirection="row"
          justify="flex-end"
          styles={styles.buttonContainer}>
          <Button
            type={BUTTON_TYPE.OUTLINE}
            title={'Nhắn tin'}
            onPress={onPressSMS}
          />
          <Space width={5} />
          <Button
            title={
              <>
                <IconStyles
                  iconSet="Feather"
                  name={ICON_NAME.PHONE_CALL}
                  size={17}
                  color={COLOR.WHITE}
                />
                <Space width={5} />
                Gọi
              </>
            }
            onPress={onPressCall}
          />
        </RowComponent>
      )}
    </RowComponent>
  );
};

export default PriceRoom;

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
  },
});
