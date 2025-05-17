import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useLayoutEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import PostComponent from '../../../component/molecules/PostComponent';
import RowComponent from '../../../component/atoms/RowComponent';
import { FONT, FONT_SIZE } from '../../../constants/fontConstants';
import { COLOR } from '../../../constants/colorConstants';
import ButtonIcon from '../../../component/atoms/ButtonIcon';
import { getFormattedTime } from '../../../utill/time';
import TextComponent from '../../../component/atoms/TextComponent';
import IconStyles from '../../../constants/IconStyle';
import { ICON_TYPE } from '../../../constants/iconConstants';
import Space from '../../../component/atoms/Space';
import Button from '../../../component/atoms/Button';


const PostDetailScreen = () => {
  const route = useRoute();
  const { item } = route.params;
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      title: `${item?.nameLocation}` || 'Chi tiết bài viết',
      headerTitleStyle: {
        fontFamily: FONT.MEDIUM,
        fontSize: FONT_SIZE.BODY_1,
        color: COLOR.WHITE,
      },
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => console.log('Share pressed!')}>
            <ButtonIcon
              iconSet={'Feather'}
              name="share" // Thay bằng icon bạn muốn
              color={COLOR.WHITE}
              size={24}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('More pressed!')}>
            <ButtonIcon
              name="heart-outline" // Thay bằng icon bạn muốn
              color={COLOR.WHITE}
              size={24}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, item]);
  const userImage = item?.user?.imageUser; // Example: Safely access nested data
  const userName = item?.user?.nameUser || 'Unknown User'; // Example: Provide fallback
  const postImage = item?.images; // Example: Get post image URI
  const userAddress = item?.user?.addressUser;
  const statusText = item?.statusText;
  const amenities = item?.amenities;
  const description = item?.description;
  const numberLikes = item?.likes ? Object.keys(item.likes).length : '';
  console.log('====================================');
  console.log(item, "sss");
  console.log('====================================');
  return (
    <>

      <ScrollView>
        {/* <PostComponent key={item.id} item={item} typeImg="detail" /> */}
        <RowComponent
          flexDirection="row"
          alignItems="center"
          justify="space-between"
          styles={styles.header_post}>
          <RowComponent
            alignItems="center"
            justify="center"
            styles={styles.imgUser_post}>
            {userImage ? (
              <Image
                source={{
                  uri: userImage,
                }}
                style={styles.imgUser_post}
              />
            ) : (
              <IconStyles
                name={ICON_TYPE.ICON_ACCOUNT}
                color={COLOR.GRAY3}
                size={26}
              />
            )}
          </RowComponent>
          <RowComponent
            flexDirection="column"
            alignItems="flex-start"
            styles={styles.nameUser_post}>
            <TextComponent
              size={14}
              title
              styles={styles.text_userName}
              text={userName}
            />
            <TextComponent
              styles={styles.text_userAddress}
              size={12}
              text={userAddress}
            />
          </RowComponent>
          <RowComponent
            alignItems="flex-end"
            justify="flex-end"
            styles={styles.time_post}>
            <TextComponent
              size={12}
              text={getFormattedTime(item?.createdAt)}
              color={COLOR.GRAY3}
            />
          </RowComponent>
        </RowComponent>
        <RowComponent flexDirection='column' alignItems='flex-start' styles={{ width: "100%" }}>
          <Image style={{ width: "100%", height: 200 }} source={{ uri: item?.images[0] }} />
        </RowComponent>
        <RowComponent
          flexDirection='column' alignItems='center'
          styles={{ paddingVertical: 10, paddingHorizontal: 15, backgroundColor: COLOR.WHITE }}>
          <TextComponent numberOfLines={4} font={FONT.BOLD} size={16} text={item?.nameLocation} />
          <Space height={10} />
          <RowComponent flexDirection='row' alignItems='center' justify='space-between' styles={{ width: "100%" }}>
            <RowComponent flexDirection='column' justify='flex-start' alignItems='flex-start'>
              <RowComponent flexDirection='row'>
                {[1, 2, 3, 4, 5].map((star) => (
                  <IconStyles key={star} size={16} color={COLOR.PRIMARY} name={'star'} iconSet='AntDesign' style={{ marginHorizontal: 1 }} />
                ))}
              </RowComponent>
              <Image source={require('../../../assets/images/location.png')} />
            </RowComponent>
            <RowComponent flexDirection='column'>
              <TextComponent styles={{ fontStyle: 'italic', color: COLOR.PRIMARY }} text={'7.8 Rất tốt'} />
              <TextComponent styles={{ fontStyle: 'italic', color: COLOR.GRAY3 }} text={'24 Nhận xét'} />
            </RowComponent>
          </RowComponent>
        </RowComponent>
        <Space height={10} />
        <RowComponent
          flexDirection='column'
          alignItems='flex-start'
          styles={{ paddingVertical: 10, paddingHorizontal: 15, backgroundColor: COLOR.WHITE }}>
          <TextComponent size={15} styles={{ fontWeight: 'bold' }} color={COLOR.BLACK1} text={'Nhà/ Phòng trọ'} />
          <TextComponent size={13} styles={{ fontStyle: 'italic' }} color={COLOR.BLACK1} text={'Phương án giá rẻ bao gồm'} />
          <RowComponent flexDirection='row' alignItems='center' justify='space-between' styles={{
            paddingVertical: 15,
          }}>
            <RowComponent >
              <IconStyles name={ICON_TYPE.ICON_PEOPLE} size={22} />
              <TextComponent size={13} text={'Tối đa hai người'} />
            </RowComponent>
            <Space width={40} />
            <RowComponent>
              <IconStyles name={ICON_TYPE.ICON_DOOR} iconSet='FontAwesome6' size={18} />
              <TextComponent size={13} text={'Có gác'} />
            </RowComponent>
          </RowComponent>
        </RowComponent>
        <Space height={10} />
        {amenities && (
          <RowComponent
            flexDirection='column'
            alignItems='flex-start'
            styles={{ paddingVertical: 10, paddingHorizontal: 15, backgroundColor: COLOR.WHITE }}>
            <TextComponent size={15} styles={{ fontWeight: 'bold' }} color={COLOR.BLACK1} text={'Các tiện nghi khác'} />
            <Space height={10} />
            {Array.isArray(amenities) &&
              amenities.map((amenity, index) => (
                <RowComponent key={index} style={{ marginBottom: 5, alignItems: 'flex-start' }}>
                  <IconStyles name={'check'} iconSet='Entypo' color={COLOR.SUCCESSFUL} size={20} />
                  <TextComponent size={13} styles={{ fontStyle: 'italic', marginLeft: 5, flexShrink: 1 }} color={COLOR.BLACK1} text={amenity} numberOfLines={0} />
                </RowComponent>
              ))}
          </RowComponent>
        )}
        <Space height={10} />
        {description && (
          <RowComponent
            flexDirection='column'
            alignItems='flex-start'
            styles={{ paddingVertical: 10, paddingHorizontal: 15, backgroundColor: COLOR.WHITE }}>
            <TextComponent size={15} styles={{ fontWeight: 'bold' }} color={COLOR.BLACK1} text={'Mô tả'} />
            <Space height={10} />
            <TextComponent size={13} numberOfLines={5} styles={{ fontStyle: 'italic', marginLeft: 5 }} color={COLOR.BLACK1} text={description} />
          </RowComponent>
        )}
      </ScrollView>
      <RowComponent justify='space-between' styles={{ backgroundColor: COLOR.WHITE, paddingHorizontal: 15, paddingVertical: 20, elevation: 4, borderWidth: 2, borderColor: COLOR.GRAY2, }}>
        <RowComponent>
          <TextComponent text={'1.000.000đ'} />
        </RowComponent>
        <Button title={'Xem mọi phòng'} />
      </RowComponent>
    </>

  );
};

export default PostDetailScreen;

const styles = StyleSheet.create({
  header_post: {
    padding: 10,
    backgroundColor: COLOR.WHITE,
    width: '100%',
  },
  imgUser_post: {
    width: 40,
    height: 50,
    borderRadius: 100,
    backgroundColor: COLOR.GRAY1,
    flex: 1,
  },
  nameUser_post: {
    marginHorizontal: 10,
    paddingHorizontal: 10,
    flex: 5,
  },
  time_post: {
    flex: 2,

  },


  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },

  overlayText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },

  text_userName: {
    color: COLOR.TEXT,
  },
  text_userAddress: {
    color: COLOR.GRAY3,



  },
});
