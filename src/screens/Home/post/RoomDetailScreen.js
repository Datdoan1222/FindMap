import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal as RNModal,
  View,
  TouchableWithoutFeedback,
  Linking,
  ActivityIndicator,
  Text,
} from 'react-native';
import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import RowComponent from '../../../component/atoms/RowComponent';
import {FONT, FONT_SIZE} from '../../../constants/fontConstants';
import {COLOR} from '../../../constants/colorConstants';
import TextComponent from '../../../component/atoms/TextComponent';
import IconStyles from '../../../constants/IconStyle';
import Space from '../../../component/atoms/Space';
import Button from '../../../component/atoms/Button';
import Modal from '../../../component/molecules/Modal';
import {NAVIGATION_NAME} from '../../../constants/navigtionConstants';
import {ROLE, TYPE} from '../../../constants/assetsConstants';
import {showMessage, hideMessage} from 'react-native-flash-message';
import {updateRoom} from '../../../redux/slideNew/roomsSlice';
import {SelectImage} from '../../../utils/SelectImage';
import Input from '../../../component/atoms/Input';
import {Controller, useForm} from 'react-hook-form';
import HeaderRoom from '../../../component/organisms/DetailRooms/HeaderRoom';
import {useToggleFavourite, useUser} from '../../../hooks/useGetInforUser';
import {useRooms, useUpdateRoom} from '../../../hooks/useRooms';
import {toPrice} from '../../../utill/toPrice';
import ImageRoom from '../../../component/organisms/DetailRooms/ImageRoom';
import Banner from '../../../component/atoms/Banner';
import TitleRoom from '../../../component/organisms/DetailRooms/TitleRoom';
import RatingRoom from '../../../component/organisms/DetailRooms/RatingRoom';
import AddressRoom from '../../../component/organisms/DetailRooms/AddressRoom';
import AmenitiesRoom from '../../../component/organisms/DetailRooms/AmenitiesRoom';
import DescriptionRoom from '../../../component/organisms/DetailRooms/DescriptionRoom';
import PriceRoom from '../../../component/organisms/DetailRooms/PriceRoom';
import {
  deleteImageFromFirebase,
  uploadImageToFirebase,
} from '../../../utill/uploadImageToFirebase';
import {USER_ID} from '../../../constants/envConstants';

const {width, height} = Dimensions.get('window');
const RoomDetailScreen = ({handleToggleLike}) => {
  console.log('RoomDetailScreen renders');
  const route = useRoute();
  const {id, role, type} = route.params;
  const isLook = type === TYPE.LOOK;
  const isEdit = type === TYPE.EDIT;
  const isOwner = role === ROLE.OWNER;

  const navigation = useNavigation();
  const {data: dataUser, error} = useUser(USER_ID);
  const {
    avatar: userImage,
    name: userName,
    address: userAddress,
    phone: userPhone,
  } = dataUser || {};
  console.log(id, '😁😁😁😁😁');

  const {data: dataRoom} = useRooms();
  const roomDetail = dataRoom ? dataRoom.filter(r => r.id === id) : [];

  const {
    id: idRoom,
    images: imagesRoom,
    address: addressRoom,
    amenities: amenitiesRoom,
    description: descriptionRoom,
    title: titleRoom,
    owner_id,
    user_id,
    region,
    latitude,
    longitude,
    price,
    area,
    status,
    rent_price,
    rent_start_date,
    rent_end_date,
    due_date,
    updated_at,
  } = roomDetail?.[0] || {};
  const {data: user} = useUser(USER_ID);
  const toggleFavourite = useToggleFavourite();
  const isFavourite = user?.favourite?.includes(idRoom);

  const [isLoading, setIsLoading] = useState(false);

  const [amenities, setAmenities] = useState(amenitiesRoom || []);
  const [isOpenImage, setIsOpenImage] = useState(false);
  const [avatar, setAvatar] = useState(imagesRoom || []);
  console.log(roomDetail, 'roomDetail');

  const [selectedImage, setSelectedImage] = useState('');

  const [isOpenModalLogin, setIsOpenModalLogin] = useState(false);

  const [isHeart, setIsHeart] = useState(false);
  const updateRoom = useUpdateRoom();
  const {
    control,
    handleSubmit,
    formState: {errors},
    getValues,
    setValue,
  } = useForm();

  useEffect(() => {
    if (imagesRoom && imagesRoom.length > 0) {
      setAvatar(imagesRoom);
    }
  }, [imagesRoom]);
  useEffect(() => {
    setValue('avatarRoom', avatar);
  }, [avatar]);
  useEffect(() => {
    const isFavourite = () => {
      const isFavourite = user?.favourite?.includes(idRoom);
      setIsHeart(isFavourite);
    };
    isFavourite();
  }, [user]);
  const handleSelectImage = async () => {
    try {
      const uri = await SelectImage();
      if (uri) {
        setAvatar(prev => [...prev, uri]);
      }
    } catch (error) {
      console.log('Error selecting image', error);
    }
  };
  const handleToggle = () => {
    toggleFavourite.mutate({userId: USER_ID, roomId: idRoom});
  };

  const onSubmit = async formData => {
    try {
      setIsLoading(true); // ⚡ bắt đầu loading

      const uri = formData?.avatarRoom[0];
      console.log(uri, 'uri');

      // Upload ảnh lên Firebase
      const uploadedUrls = await uploadImageToFirebase(uri, 0);
      const newUploadedUrls = Array.isArray(uploadedUrls)
        ? uploadedUrls
        : [uploadedUrls];

      // Gọi mutate cập nhật phòng
      updateRoom.mutate(
        {
          roomId: idRoom,
          data: {
            ...formData,
            price: Number(formData.price),
            amenities: amenities,
            images: newUploadedUrls,
          },
        },
        {
          onSuccess: () => {
            Alert.alert('Thành công', 'Cập nhật phòng thành công!');
            navigation.navigate(NAVIGATION_NAME.MANAGER_ROOM_SCREEN);
          },
          onError: async e => {
            console.log('Cập nhật phòng thất bại', e);
            Alert.alert('Thất bại', 'Cập nhật phòng thất bại');
            await deleteImageFromFirebase(newUploadedUrls[0]);
          },
          onSettled: () => {
            setIsLoading(false); // ⚡ kết thúc loading
          },
        },
      );
    } catch (err) {
      console.log('🔥 Lỗi trong onSubmit:', err);
      setIsLoading(false); // ⚡ kết thúc loading nếu có lỗi
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      titleRoom: `${type === TYPE.EDIT ? 'Thêm phòng' : 'Chi tiết phòng'}`,
      headerTitleStyle: {
        fontFamily: FONT.MEDIUM,
        fontSize: FONT_SIZE.H4,
        color: COLOR.WHITE,
      },
      headerRight: () => (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {role === ROLE.OWNER ? (
            <TouchableOpacity onPress={handleSubmit(onSubmit)}>
              <IconStyles
                name={'check'}
                iconSet="AntDesign"
                color={COLOR.WHITE}
                size={24}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleToggle}>
              <IconStyles
                name={isHeart ? 'heart' : 'heart-o'}
                iconSet="FontAwesome"
                color={COLOR.WHITE}
                size={24}
              />
            </TouchableOpacity>
          )}
        </View>
      ),
    });
  }, [navigation, dataRoom, isHeart]); // Thêm isHeart vào đây

  const handleBannerPress = useCallback(item => {
    console.log('item', item);

    setSelectedImage(item); // hoặc item.images[0]
    setIsOpenImage(true);
  }, []);
  const onPressCall = () => {
    if (userPhone) Linking.openURL(`tel:${userPhone}`);
  };
  const onPressSMS = () => {
    navigation.navigate(NAVIGATION_NAME.MESSENGER_STACK, {
      screen: NAVIGATION_NAME.MESSENGER_DETAIL_SCREEN,
      params: {dataUser: dataUser},
    });
  };
  return (
    <View style={{flex: 1}}>
      <ScrollView>
        {/* Header section */}
        {isLook && (
          <HeaderRoom
            userImage={userImage}
            userName={userName}
            userAddress={userAddress}
            createdAt={updated_at}
          />
        )}
        {/* Image section - unchanged */}
        <ImageRoom
          avatar={avatar}
          isEdit={isEdit}
          isLook={isLook}
          onPressBanner={() => handleBannerPress(avatar)}
          onPressImage={handleSelectImage}
        />
        <Space height={10} />
        {/* Title and Rating section */}
        <RowComponent
          flexDirection="column"
          alignItems="center"
          styles={{
            width: '100%',
            paddingVertical: 10,
            paddingHorizontal: 15,
            backgroundColor: COLOR.WHITE,
          }}>
          <TitleRoom
            titleRoom={titleRoom}
            isLook={isLook}
            control={control}
            errors={errors}
          />
          <Space height={10} />
          {/* Đánh giá */}
          <RatingRoom />

          {/* Address Section */}
          <AddressRoom
            titleRoom={titleRoom}
            type={type}
            addressRoom={addressRoom}
            control={control}
            errors={errors}
            isEdit={true}
            isLook={isLook}
            isOwner={isOwner}
            saveAddressCallback={newAddress => {
              // Xử lý lưu địa chỉ
              console.log('Địa chỉ mới:', newAddress);
              // saveAddress(newAddress);
            }}
          />
        </RowComponent>

        <Space height={10} />

        {/* Amenities Section */}
        <AmenitiesRoom
          amenities={amenities}
          isLook={isLook}
          onChange={setAmenities}
        />

        <Space height={10} />

        {/* Description Section */}
        <DescriptionRoom
          description={descriptionRoom}
          isLook={isLook}
          control={control}
          errors={errors}
        />
      </ScrollView>

      {/* Bottom section - unchanged */}
      <PriceRoom
        price={price}
        area={area}
        isLook={isLook}
        control={control}
        errors={errors}
        onPressCall={onPressCall}
        onPressSMS={onPressSMS}
      />

      {/* Existing Modal */}
      <Modal
        isVisible={isOpenModalLogin}
        title={'Bạn chưa đăng nhập'}
        text={'Hãy đăng nhập để có những trải nghiệm tốt nhất'}
        onConfirm={() => {
          setIsOpenModalLogin(false);
          navigation.reset({
            index: 0,
            routes: [{name: NAVIGATION_NAME.LOGIN_SCREEN}],
          });
        }}
        textConfirm={'Đăng nhập'}
      />
      <RNModal
        visible={isOpenImage}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpenImage(false)}>
        <TouchableWithoutFeedback onPress={() => setIsOpenImage(false)}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)', // 👈 lớp mờ
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {selectedImage && (
              <Banner
                isAutoPlay={false}
                isDisable={true}
                height={600}
                data={selectedImage}
              />
            )}
          </View>
        </TouchableWithoutFeedback>
      </RNModal>
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.text}>Đang xử lý...</Text>
        </View>
      )}
    </View>
  );
};

export default RoomDetailScreen;
const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', // lớp mờ
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  text: {
    marginTop: 10,
    color: '#fff',
    fontSize: 16,
  },
});
