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
} from 'react-native';
import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {COLOR} from '../constants/colorConstants';
import HeaderRoom from '../component/organisms/DetailRooms/HeaderRoom';
import ImageRoom from '../component/organisms/DetailRooms/ImageRoom';
import RowComponent from '../component/atoms/RowComponent';
import TitleRoom from '../component/organisms/DetailRooms/TitleRoom';
import RatingRoom from '../component/organisms/DetailRooms/RatingRoom';
import AddressRoom from '../component/organisms/DetailRooms/AddressRoom';
import Space from '../component/atoms/Space';
import AmenitiesRoom from '../component/organisms/DetailRooms/AmenitiesRoom';
import DescriptionRoom from '../component/organisms/DetailRooms/DescriptionRoom';
import {toPrice} from '../utill/toPrice';
import Modal from '../component/molecules/Modal';
import {ROLE, TYPE} from '../constants/assetsConstants';
import {USER_ID} from '../constants/envConstants';
import {useUser} from '../hooks/useGetInforUser';
import {useRooms} from '../hooks/useRooms';
import {useToggleFavourite} from '../hooks/useFetchFavouriteData';
import {Controller, useForm} from 'react-hook-form';
import Banner from '../component/atoms/Banner';
import TextComponent from '../component/atoms/TextComponent';
import Button from '../component/atoms/Button';
import {FONT, FONT_SIZE} from '../constants/fontConstants';
import {SelectImage} from '../utils/SelectImage';
import Input from '../component/atoms/Input';
import PriceRoom from '../component/organisms/DetailRooms/PriceRoom';
import {NAVIGATION_NAME} from '../constants/navigtionConstants';
import IconStyles from '../constants/IconStyle';

const {width, height} = Dimensions.get('window');
const AddRoomScreen = ({handleToggleLike}) => {
  console.log('RoomDetailScreen renders');
  const route = useRoute();
  const {item, role, type} = route.params;
  const isLook = type === TYPE.LOOK;
  const isEdit = type === TYPE.EDIT;
  const isOwner = role === ROLE.OWNER;

  const navigation = useNavigation();
  const {data: dataUser, isLoading, error} = useUser(USER_ID);
  const {
    avatar: userImage,
    name: userName,
    address: userAddress,
  } = dataUser || {};
  const {data: dataRoom} = useRooms();
  const roomDetail = dataRoom?.find(room => room._id === item?.room_id) || {};
  console.log('roomDetail', item?.room_id);
  const {
    _id: idRoom,
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
    images,
    status,
    rent_price,
    rent_start_date,
    rent_end_date,
    due_date,
    updated_at,
  } = roomDetail || {};

  const [isOpenImage, setIsOpenImage] = useState(false);
  const [avatar, setAvatar] = useState([]);

  const [selectedImage, setSelectedImage] = useState('');
  const toggleFavourite = useToggleFavourite();

  const [isOpenModalLogin, setIsOpenModalLogin] = useState(false);
  // Existing states

  // Edit states for form data
  const [editedAddress, setEditedAddress] = useState(addressRoom || '');
  const [amenities, setAmenities] = useState(amenitiesRoom || []);

  const [editedDescription, setEditedDescription] = useState(
    descriptionRoom || '',
  );
  const [newAmenity, setNewAmenity] = useState('');
  const [isHeart, setIsHeart] = useState(false);

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
  // Save functions
  const saveAddress = async newAddress => {
    console.log('newAddress', newAddress);
  };

  const saveDescription = async newDescription => {
    console.log('newDescription', newDescription);
  };

  const saveAmenities = async newAmenities => {
    console.log('newAmenities', newAmenities);
  };

  const handleToggle = () => {
    toggleFavourite.mutate({dataRoom, user_id: USER_ID});
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
          {role === ROLE.USER && (
            <TouchableOpacity onPress={handleToggle}>
              <IconStyles
                name={'heart'}
                iconSet="AntDesign"
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
  console.log('====================================');
  console.log(imagesRoom, avatar);
  console.log('====================================');
  return (
    <View style={{flex: 1}}>
      <ScrollView>
        {/* Header section */}
        {isLook && (
          <HeaderRoom
            userImage={userImage}
            userName={userName}
            userAddress={userAddress}
            createdAt={item?.createdAt}
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
            isEdit={isEdit}
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
              saveAddress(newAddress);
            }}
          />
        </RowComponent>

        <Space height={10} />

        {/* Amenities Section */}
        <AmenitiesRoom amenities={amenities} onChange={setAmenities} />

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
    </View>
  );
};

export default AddRoomScreen;
