import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import RowComponent from '../component/atoms/RowComponent';
import TextComponent from '../component/atoms/TextComponent';
import Button from '../component/atoms/Button';
import Space from '../component/atoms/Space';
import {COLOR} from '../constants/colorConstants';
import IconStyles from '../constants/IconStyle';
import {useNavigation, useRoute} from '@react-navigation/native';
import {ICON_TYPE} from '../constants/iconConstants';
import {getFormattedTime} from '../utill/time';
import {FONT} from '../constants/fontConstants';

const MyRoomScreen = () => {
  const route = useRoute();
  const {item} = route.params;
  const navigation = useNavigation();
  const userImage = item?.user?.imageUser; // Example: Safely access nested data
  const userName = item?.user?.nameUser || 'Unknown User'; // Example: Provide fallback
  const postImage = item?.images; // Example: Get post image URI
  const userAddress = item?.user?.addressUser;
  const statusText = item?.statusText;
  const amenities = item?.amenities;
  const description = item?.description;
  const numberLikes = item?.likes ? Object.keys(item.likes).length : '';
  return (
    <>
      <ScrollView>
        {/* <PostComponent key={item.id} item={item} typeImg="detail" /> */}
        <RowComponent
          flexDirection="column"
          alignItems="flex-start"
          styles={{width: '100%'}}>
          <Image
            style={{width: '100%', height: 200}}
            source={{uri: item?.images[0]}}
          />
        </RowComponent>
        <RowComponent
          flexDirection="column"
          justify="flex-start"
          alignItems="flex-start"
          styles={{
            paddingVertical: 10,
            paddingHorizontal: 15,
            backgroundColor: COLOR.WHITE,
          }}>
          <TextComponent
            numberOfLines={4}
            font={FONT.BOLD}
            size={16}
            color={COLOR.BLACK1}
            text={`Phòng số 2 `}
          />
          <TextComponent
            numberOfLines={4}
            font={FONT.BOLD}
            size={12}
            color={COLOR.GRAY}
            text={`${item?.nameLocation}`}
          />
          <Space height={10} />
          {/* <RowComponent
            flexDirection="row"
            alignItems="center"
            justify="space-between"
            styles={{width: '100%'}}>
            <RowComponent
              flexDirection="column"
              justify="flex-start"
              alignItems="flex-start">
              <RowComponent flexDirection="row">
                {[1, 2, 3, 4, 5].map(star => (
                  <IconStyles
                    key={star}
                    size={16}
                    color={COLOR.PRIMARY}
                    name={'star'}
                    iconSet="AntDesign"
                    style={{marginHorizontal: 1}}
                  />
                ))}
              </RowComponent>
              <Image source={require('../assets/images/location.png')} />
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
          </RowComponent> */}
        </RowComponent>
        <Space height={10} />
        <RowComponent
          flexDirection="column"
          alignItems="flex-start"
          styles={{
            paddingVertical: 10,
            paddingHorizontal: 15,
            backgroundColor: COLOR.WHITE,
          }}>
          <TextComponent
            size={15}
            styles={{fontWeight: 'bold'}}
            color={COLOR.BLACK1}
            text={'Nhà/ Phòng trọ'}
          />
          <TextComponent
            size={13}
            styles={{fontStyle: 'italic'}}
            color={COLOR.BLACK1}
            text={'Phương án giá rẻ bao gồm'}
          />
          <RowComponent
            flexDirection="row"
            alignItems="center"
            justify="space-between"
            styles={{
              paddingVertical: 15,
            }}>
            <RowComponent>
              <IconStyles name={ICON_TYPE.ICON_PEOPLE} size={22} />
              <TextComponent size={13} text={'Tối đa hai người'} />
            </RowComponent>
            <Space width={40} />
            <RowComponent>
              <IconStyles
                name={ICON_TYPE.ICON_DOOR}
                iconSet="FontAwesome6"
                size={18}
              />
              <TextComponent size={13} text={'Có gác'} />
            </RowComponent>
          </RowComponent>
        </RowComponent>
        <Space height={10} />
        {amenities && (
          <RowComponent
            flexDirection="column"
            alignItems="flex-start"
            styles={{
              paddingVertical: 10,
              paddingHorizontal: 15,
              backgroundColor: COLOR.WHITE,
            }}>
            <TextComponent
              size={15}
              styles={{fontWeight: 'bold'}}
              color={COLOR.BLACK1}
              text={'Các tiện nghi khác'}
            />
            <Space height={10} />
            {Array.isArray(amenities) &&
              amenities.map((amenity, index) => (
                <RowComponent
                  key={index}
                  style={{marginBottom: 5, alignItems: 'flex-start'}}>
                  <IconStyles
                    name={'check'}
                    iconSet="Entypo"
                    color={COLOR.SUCCESSFUL}
                    size={20}
                  />
                  <TextComponent
                    size={13}
                    styles={{fontStyle: 'italic', marginLeft: 5, flexShrink: 1}}
                    color={COLOR.BLACK1}
                    text={amenity}
                    numberOfLines={0}
                  />
                </RowComponent>
              ))}
          </RowComponent>
        )}
        <Space height={10} />
        {description && (
          <RowComponent
            flexDirection="column"
            alignItems="flex-start"
            styles={{
              paddingVertical: 10,
              paddingHorizontal: 15,
              backgroundColor: COLOR.WHITE,
            }}>
            <TextComponent
              size={15}
              styles={{fontWeight: 'bold'}}
              color={COLOR.BLACK1}
              text={'Mô tả'}
            />
            <Space height={10} />
            <TextComponent
              size={13}
              numberOfLines={5}
              styles={{fontStyle: 'italic', marginLeft: 5}}
              color={COLOR.BLACK1}
              text={description}
            />
          </RowComponent>
        )}
        <Space height={10} />
        <RowComponent
          flexDirection="column"
          alignItems="flex-start"
          styles={{
            paddingVertical: 10,
            paddingHorizontal: 15,
            backgroundColor: COLOR.WHITE,
          }}>
          <TextComponent
            size={15}
            styles={{fontWeight: 'bold'}}
            color={COLOR.BLACK1}
            text={'Thời gian thuê'}
          />
          <Space height={10} />
          <TextComponent
            size={13}
            numberOfLines={5}
            styles={{fontStyle: 'italic', marginLeft: 5}}
            color={COLOR.BLACK1}
            text={'26/9/2024 -> 26/9/2025'}
          />
        </RowComponent>
      </ScrollView>
      <RowComponent
        justify="space-between"
        styles={{
          backgroundColor: COLOR.WHITE,
          paddingHorizontal: 15,
          paddingVertical: 20,
          elevation: 4,
          borderWidth: 2,
          borderColor: COLOR.GRAY2,
        }}>
        <RowComponent flexDirection="column">
          <TextComponent color={COLOR.PRIMARY} text={'1.000.000đ'} />
          <TextComponent size={12} color={COLOR.GRAY} text={'Tháng 3/2025'} />
        </RowComponent>
        <Button title={'Đóng tiền'} />
      </RowComponent>
    </>
  );
};

export default MyRoomScreen;

const styles = StyleSheet.create({});
