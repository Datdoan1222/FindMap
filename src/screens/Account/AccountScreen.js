import React, {useEffect, useState} from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  View,
  Alert,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Controller, useForm} from 'react-hook-form';
import {globalStyles} from '../../styles/globalStyles';
import {FONT, FONT_SIZE} from '../../constants/fontConstants';
import {SelectImage} from '../../utils/SelectImage.js';
import Space from '../../component/atoms/Space';
import {COLOR} from '../../constants/colorConstants';
import {ICON_NAME, ICON_TYPE} from '../../constants/iconConstants';
import ButtonIcon from '../../component/atoms/ButtonIcon.js';
import TextComponent from '../../component/atoms/TextComponent.js';
import Input from '../../component/atoms/Input.js';
import RowComponent from '../../component/atoms/RowComponent.js';
import IconStyles from '../../constants/IconStyle.js';
import {usersAPI} from '../../utill/api/apiUsers.js';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ROLE} from '../../constants/assetsConstants.js';
import {roomsAPI} from '../../utill/api/apiRoom.js';
import {formatDate} from '../../utill/convertTime.js';
import {convertToK} from '../../utill/convertToK.js';
import Button from '../../component/atoms/Button.jsx';
import {BUTTON_TYPE} from '../../constants/buttonConstants.js';
import {NAVIGATION_NAME} from '../../constants/navigtionConstants.js';

const HeaderRightButton = ({onPress}) => (
  <ButtonIcon
    iconSet={'AntDesign'}
    name={ICON_NAME.CHECK}
    color={COLOR.WHITE}
    size={24}
    onPress={onPress}
  />
);

const AccountScreen = () => {
  const {setOptions, goBack, navigate} = useNavigation();
  const {
    control,
    handleSubmit,
    formState: {errors},
    getValues,
    setValue,
  } = useForm();

  const [dataUser, setDataUser] = useState(usersAPI[0]);
  const defaultAvatarUrl =
    'https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg';

  const {phone, name, email, address, owned_rooms, rented_rooms, role} =
    dataUser || {};
  const owned_roomsLength = owned_rooms?.length ?? 0;
  const [avatar, setAvatar] = useState(null);
  const url = defaultAvatarUrl;
  // API lấy chi tiết phòng tôi đang thuê user là rented
  // useEffect(() => {
  const [dataRoom, setDataRoom] = useState(roomsAPI[0]);
  const nameRoom = dataRoom?.title;
  const imageRoom = dataRoom?.images[0];
  const rented_rooms_start_date = rented_rooms[0]?.start_date ?? new Date(); // ngày bắt đầu thuê
  const rented_rooms_end_date = rented_rooms[0]?.end_date ?? new Date(); // ngày hết hạn hợp đồng
  const rented_rooms_due_date = rented_rooms[0]?.due_date ?? new Date(); // ngày hạn đóng tiền tháng
  const rented_rooms_rent_price = rented_rooms[0]?.rent_price ?? 0; // số tiền phải đóng
  // }, []);
  // Chọn ảnh từ thư viện
  const handleSelectImage = async () => {
    try {
      const uri = await SelectImage();
      if (uri) {
        setAvatar(uri);
      }
    } catch (error) {
      // console.log('Error selecting image', error);
    }
  };

  // Define the onPress function for the header right button
  const handleHeaderRightPress = async () => {
    const values = getValues();
    if (avatar && avatar !== url) {
    }
    Alert.alert('Thông báo', 'Thay đổi thông tin thành công', [
      {text: 'Xác nhận', onPress: () => console.log('OK Pressed')},
    ]);
    // gọi API update infomation user ở đây
  };

  useEffect(() => {
    setValue('phone', phone);
    setValue('nameRoom', nameRoom);
    setValue('owned_roomsLength', owned_roomsLength);
    setValue('name', name);
    setValue('email', email);
  }, [name, email, setValue]);
  const handleNavigate = () => {
    navigate(NAVIGATION_NAME.ROOM_DETAIL_SCREEN, {item: dataRoom});
  };
  const ItemDetailRoom = ({title, value, isDate}) => {
    return (
      <>
        <RowComponent
          flexDirection="row"
          justify="space-between"
          styles={{width: '100%'}}>
          <TextComponent size={13} text={title} />
          <RowComponent
            styles={{
              padding: 5,
              borderColor: COLOR.PRIMARY,
              borderWidth: 1,
              borderRadius: 5,
            }}>
            <TextComponent
              size={11}
              text={isDate ? formatDate(value) : convertToK(value)}
            />
          </RowComponent>
        </RowComponent>
        <Space height={10} />
      </>
    );
  };
  const ItemRoom = () => {
    return (
      <RowComponent flexDirection="column" alignItems="flex-start">
        <RowComponent
          flexDirection="row"
          justify="space-between"
          styles={{width: '100%'}}>
          <Text allowFontScaling={false} style={styles.label}>
            Phòng của tôi
          </Text>
          <TouchableOpacity
            onPress={handleNavigate}
            style={{width: '40%', alignItems: 'flex-end'}}>
            <Text
              allowFontScaling={false}
              style={[styles.label, {color: COLOR.PRIMARY}]}>
              Xem chi tiết
            </Text>
          </TouchableOpacity>
        </RowComponent>
        <RowComponent flexDirection="column">
          <RowComponent
            styles={{
              padding: 5,
              borderWidth: 1,
              borderColor: COLOR.PRIMARY,
              borderRadius: 15,
            }}>
            <Image
              source={{uri: imageRoom}}
              style={{width: '100%', height: 200, borderRadius: 10}}
            />
          </RowComponent>
          <Space height={10} />
          <RowComponent flexDirection="column" alignItems="flex-start">
            {ItemDetailRoom({
              title: 'Ngày bắt đầu thuê:',
              value: rented_rooms_start_date,
              isDate: true,
            })}
            {ItemDetailRoom({
              title: 'Ngày hết hợp đồng thuê:',
              value: rented_rooms_end_date,
              isDate: true,
            })}
            {ItemDetailRoom({
              title: 'Ngày hạn đóng tiền:',
              value: rented_rooms_due_date,
              isDate: true,
            })}
            {ItemDetailRoom({
              title: 'Số tiền thuê/tháng:',
              value: rented_rooms_rent_price,
              isDate: false,
            })}
          </RowComponent>
        </RowComponent>
      </RowComponent>
    );
  };

  return (
    <SafeAreaView style={[globalStyles.container, {padding: 0}]}>
      <RowComponent
        alignItems="center"
        justify="space-between"
        styles={{
          backgroundColor: COLOR.PRIMARY,
          height: 60,
          paddingHorizontal: 20,
        }}>
        <ButtonIcon
          iconSet={'AntDesign'}
          name={ICON_NAME.CHECK}
          color={COLOR.PRIMARY}
          size={24}
        />
        <TextComponent title text={'Thông tin tài khoản'} color={COLOR.WHITE} />
        <HeaderRightButton onPress={handleHeaderRightPress} />
      </RowComponent>
      {/* Avatar và tên */}
      <RowComponent flexDirection="column" styles={[styles.avatarSection]}>
        <TouchableOpacity
          styles={[styles.avatar]}
          flexDirection="column"
          onPress={handleSelectImage}>
          <Image
            source={{uri: avatar || url}}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              borderWidth: 2,
              borderColor: COLOR.WHITE,
            }}
          />
          <RowComponent styles={[styles.cameraIcon]}>
            <IconStyles
              iconSet="FontAwesome"
              name={'camera'}
              size={12}
              color={COLOR.WHITE}
            />
          </RowComponent>
        </TouchableOpacity>
        <Space width={10} />
      </RowComponent>
      <Space height={50} />

      {/* Thông tin */}
      <ScrollView style={{padding: 15}}>
        <Controller
          name="phone"
          control={control}
          defaultValue={phone}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              label={'Số điện thoại'}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              disabled={true}
              error={errors.phone?.message}
            />
          )}
        />

        <Controller
          name="name"
          control={control}
          defaultValue={name}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              label={'Họ và tên'}
              placeholder={'Nhập họ và tên'}
              onChangeValue={onChange}
              onBlur={onBlur}
              value={value}
              error={errors.name?.message}
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          defaultValue={email}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              label={'Email'}
              placeholder={'Nhập email'}
              onChangeValue={onChange}
              onBlur={onBlur}
              value={value}
              error={errors.email?.message}
            />
          )}
        />
        {role !== ROLE.OWNER ? (
          <Controller
            name="owned_roomsLength"
            control={control}
            defaultValue={owned_roomsLength}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                label={'Số phòng đang quản lý'}
                placeholder={'Số phòng đang quản lý'}
                onChangeValue={onChange}
                onBlur={onBlur}
                value={String(value)}
                disabled={true}
                error={errors.owned_roomsLength?.message}
              />
            )}
          />
        ) : (
          <>{ItemRoom()}</>
        )}
        <Space height={50} />
        <RowComponent
          styles={{flex: 1, width: '100%'}}
          alignItems="center"
          justify="center">
          <Button title={'Xóa tài khoản'} type={BUTTON_TYPE.DANGER} />
        </RowComponent>
        <Space height={100} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  avatarSection: {
    height: '7%',
    backgroundColor: COLOR.PRIMARY,
    zIndex: 10,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  avatar: {
    position: 'absolute',
  },
  cameraIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: COLOR.GREY_700,
    borderRadius: 20,
    padding: 8,
  },
  label: {
    marginBottom: 10,
    color: COLOR.GREY_900,
    fontWeight: '500',
    fontSize: FONT_SIZE.TITLE,
  },
});

export default AccountScreen;
