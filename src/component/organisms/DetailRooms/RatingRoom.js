import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import RowComponent from '../../atoms/RowComponent';
import IconStyles from '../../../constants/IconStyle';
import {COLOR} from '../../../constants/colorConstants';
import TextComponent from '../../atoms/TextComponent';

const RatingRoom = () => {
  return (
    <RowComponent
      flexDirection="row"
      alignItems="center"
      justify="space-between"
      styles={{width: '100%'}}>
      <RowComponent
        flexDirection="column"
        justify="flex-start"
        alignItems="flex-start">
        <TextComponent
          styles={{
            fontWeight: 'bold',
            fontSize: 16,
            marginRight: 5,
            paddingBottom: 10,
          }}
          text={'Đánh giá'}
        />
        <RowComponent flexDirection="row">
          {[1, 2, 3, 4, 5].map(star => (
            <IconStyles
              key={star}
              size={16}
              color={COLOR.YELLOW_500}
              name={'star'}
              iconSet="AntDesign"
              style={{marginHorizontal: 1}}
            />
          ))}
        </RowComponent>
      </RowComponent>
      <RowComponent flexDirection="column">
        <TextComponent
          styles={{fontStyle: 'italic', color: COLOR.PRIMARY}}
          text={'7.8 Rất tốt'}
        />
        <TextComponent
          styles={{fontStyle: 'italic', color: COLOR.GRAY3}}
          text={'24 Nhận xét'}
        />
      </RowComponent>
    </RowComponent>
  );
};

export default RatingRoom;

const styles = StyleSheet.create({});
