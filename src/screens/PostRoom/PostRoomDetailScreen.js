import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useLayoutEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import HeaderComponent from '../../component/molecules/HeaderComponent';
import {ICON_NAME, ICON_TYPE} from '../../constants/iconConstants';
import {COLOR} from '../../constants/colorConstants';
import userStore from '../../store/userStore';
import RowComponent from '../../component/atoms/RowComponent';
import IconStyles from '../../constants/IconStyle';
import Space from '../../component/atoms/Space';
import TextComponent from '../../component/atoms/TextComponent';
import {Controller, useForm} from 'react-hook-form';
import {WIDTH} from '../../constants/distance';
import PostImages from '../../component/organisms/PostRoom/PostImages';
import {NAVIGATION_NAME} from '../../constants/navigtionConstants';
import {useCreatePost} from '../../hooks/usePost';

const PostRoomDetailScreen = () => {
  const navigation = useNavigation();
  const inforUser = userStore(state => state.inforUser);

  const [selectRoom, setSelectRoom] = useState(null);
  const [postDescription, setPostDescription] = useState(
    selectRoom?.description,
  );
  const {mutate, isLoading} = useCreatePost();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity onPress={onSubmit}>
            <IconStyles
              name={'check'}
              iconSet="AntDesign"
              color={COLOR.WHITE}
              size={24}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]); // Thêm isHeart vào đây
  const onSubmit = async () => {
    mutate(
      {
        room_id: selectRoom?.id,
        owner_id: inforUser?.id,
        title: selectRoom?.title,
        address: selectRoom?.address,
        region: selectRoom?.region,
        description: selectRoom?.description,
        images: selectRoom?.images,
        price: selectRoom?.rent_price,
        is_active: false,
      },
      {
        onSuccess: () => {
          Alert.alert('Thành công', 'Bạn đã tạo bài đăng thành công');
          navigation.navigate(NAVIGATION_NAME.HOME_SCREEN);
        },
        onError: error => {
          Alert.alert(
            'Thất bại',
            'Kết nối mạng không ổn định xin vui lòng thử lại',
          );
          console.log('thất bại ❌❌❌❌', error.response?.data);
        },
      },
    );
  };
  return (
    <View style={styles.container}>
      <RowComponent styles={styles.postContainer}></RowComponent>
      <ScrollView>
        <RowComponent
          flexDirection="column"
          alignItems="flex-start"
          justify="center"
          styles={styles.postContainer}>
          <RowComponent flexDirection="row" styles={styles.avatarPost}>
            <RowComponent
              alignItems="center"
              justify="center"
              styles={styles.postAvatar}>
              {inforUser?.avatar ? (
                <Image
                  source={{uri: inforUser?.avatar}}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatar}>
                  <IconStyles
                    iconSet="FontAwesome6"
                    name={ICON_TYPE.ICON_ACCOUNT}
                    size={25}
                    color={COLOR.GREY_600}
                  />
                </View>
              )}
            </RowComponent>
            <Space width={5} />
            <TextComponent styles={styles.name} text={inforUser?.name} />
          </RowComponent>
          <RowComponent>
            <Text
              style={{paddingVertical: 10, fontSize: 17, color: COLOR.BLACK1}}>
              {postDescription}
            </Text>
          </RowComponent>
          <PostImages data={selectRoom?.images} height={300} />
          <RowComponent
            justify="flex-start"
            alignItems="flex-start"
            flexDirection="column">
            <Text style={styles.titlePost}>{selectRoom?.title}</Text>
            <Text style={styles.addressPost}>{selectRoom?.address}</Text>
          </RowComponent>
        </RowComponent>
      </ScrollView>
      <RowComponent
        flexDirection="column"
        justify=""
        alignItems="center"
        styles={styles.optionContainer}>
        <RowComponent
          styles={{
            borderWidth: 2,
            borderColor: COLOR.GREY_300,
            height: 2,
            width: '30%',
            marginTop: 25,
          }}
        />
        <Space height={10} />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(NAVIGATION_NAME.SELECT_ROOM_SCREEN, {
              onSelect: room => {
                setSelectRoom(room);
              },
            });
          }}
          style={{
            width: '100%',
            paddingHorizontal: 20,
            paddingTop: 10,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            source={require('../../assets/images/icon_add_room.png')}
            style={{width: 40, height: 40}}
          />
          <Space width={10} />
          <Text
            style={[
              selectRoom?.title
                ? {fontWeight: 'bold', color: COLOR.BLACK1}
                : {fontStyle: 'italic', color: COLOR.SECONDARY},
              {fontSize: 18},
            ]}>
            {selectRoom?.title ? selectRoom?.title : 'Chọn phòng của bạn'}
          </Text>
        </TouchableOpacity>
        <RowComponent alignItems="flex-start" styles={styles.inputDescription}>
          <TextInput
            onChangeText={setPostDescription}
            value={postDescription}
            placeholder="Nhập mô tả phòng cho thuê của bạn"
            style={styles.textInput}
          />
        </RowComponent>
      </RowComponent>
    </View>
  );
};

export default PostRoomDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  postContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  postAvatar: {
    borderRadius: 50,
    width: 60,
    height: 60,
    alignContent: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: COLOR.GREY_300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLOR.BLACK1,
  },
  optionContainer: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    elevation: 4,
    height: '20%',
  },
  inputDescription: {
    width: '100%',
    padding: 10,
  },
  textInput: {
    paddingHorizontal: 10,
    fontSize: 16,
    color: COLOR.BLACK1,
    padding: 10,
    alignContent: 'flex-start',
  },
  titlePost: {
    paddingVertical: 5,
    fontSize: 18,
    color: COLOR.BLACK1,
    width: '100%',
    fontWeight: 'bold',
  },
  addressPost: {
    paddingVertical: 5,
    fontSize: 14,
    color: COLOR.BLACK2,
    fontStyle: 'italic',
  },
});
