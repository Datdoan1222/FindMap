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
  ActivityIndicator,
  Text,
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
import {useCreateRoom, useRooms} from '../hooks/useRooms';
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
import userStore from '../store/userStore';
import {
  deleteImageFromFirebase,
  uploadImageToFirebase,
} from '../utill/uploadImageToFirebase';

const {width, height} = Dimensions.get('window');
const AddRoomScreen = ({}) => {
  console.log('AddDetailScreen renders');
  const route = useRoute();
  const {item, role, type} = route.params;
  const isLook = type === TYPE.LOOK;
  const isEdit = type === TYPE.EDIT;
  const isOwner = role === ROLE.OWNER;

  const navigation = useNavigation();
  const {data: dataUser, error} = useUser(USER_ID);
  const {
    id: userID,
    avatar: userImage,
    name: userName,
    address: userAddress,
  } = dataUser || {};

  const {data: dataRoom} = useRooms();
  const roomDetail = dataRoom?.find(room => room._id === item?.room_id) || {};
  // console.log('roomDetail', item?.room_id);
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
  const [isLoading, setIsLoading] = useState(false);

  const [isOpenImage, setIsOpenImage] = useState(false);
  const [avatar, setAvatar] = useState([]);

  const [selectedImage, setSelectedImage] = useState('');
  const toggleFavourite = useToggleFavourite();

  const [isOpenModalLogin, setIsOpenModalLogin] = useState(false);
  // Existing states

  // Edit states for form data
  const [amenities, setAmenities] = useState(amenitiesRoom || []);

  const [editedDescription, setEditedDescription] = useState(
    descriptionRoom || '',
  );
  const [newAmenity, setNewAmenity] = useState('');
  const [isHeart, setIsHeart] = useState(false);
  const createRoom = useCreateRoom();
  const addAddress = userStore(state => state.addAddress);
  const currentLocation = userStore(state => state.currentLocation);
  console.log(addAddress, 'addAddress');
  console.log(addressRoom, 'addressRoom');
  const valueAddressRoom = addressRoom || addAddress?.display_name || '';
  const {
    control,
    handleSubmit,
    formState: {errors},
    getValues,
    setValue,
  } = useForm({
    defaultValues: {
      addressRoom: addressRoom || addAddress?.display_name,
    },
  });

  // useEffect(() => {
  //   if (imagesRoom && imagesRoom.length > 0) {
  //     setAvatar(imagesRoom);
  //   }
  // }, [imagesRoom]);
  // Chọn ảnh từ thư viện
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
  // console.log(avatar, '😁😁😁😁😁😁');
  useEffect(() => {
    if (addAddress?.display_name) {
      setValue('addressRoom', addAddress.display_name);
    }
  }, [addAddress]);
  useEffect(() => {
    setValue('avatarRoom', avatar);
  }, [avatar]);
  const handleToggle = () => {
    toggleFavourite.mutate({dataRoom, user_id: USER_ID});
  };
  const onSubmit = async formData => {
    try {
      setIsLoading(true);
      const uri = formData.avatarRoom[0];
      const uploadedUrls = await uploadImageToFirebase(uri, 0);
      const newUploadedUrls = !Array.isArray(uploadedUrls)
        ? [uploadedUrls]
        : uploadedUrls;
      // console.log(formData.avatarRoom,"formData.avatarRoom");

      const payload = {
        owner_id: userID,
        title: formData?.title,
        description: formData?.description,
        address: formData?.addressRoom,
        region: addAddress?.province,
        latitude: addAddress?.lat ? Number(addAddress?.lat) : undefined,
        longitude: addAddress?.lon ? Number(addAddress?.lon) : undefined,
        price: Number(formData.price),
        amenities,
        images: newUploadedUrls,
      };
      createRoom.mutate(payload, {
        onSuccess: () => {
          Alert.alert('Thành công', 'Tạo phòng thành công!', [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate(NAVIGATION_NAME.MANAGER_ROOM_SCREEN);
              },
            },
          ]);
        },
        onError: async e => {
          Alert.alert('Thất bại', 'Tạo phòng thất bại');
          console.log('Tạo phòng thất bại', e);
          await deleteImageFromFirebase(newUploadedUrls[0]);
        },
        onSettled: () => {
          setIsLoading(false);
        },
      });
    } catch (err) {
      setIsLoading(false);
      console.log('🔥 Lỗi trong onSubmit:', err);
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
  const onPressOpenMap = () => {
    navigation.navigate(NAVIGATION_NAME.MAP_SCREEN, {
      isSelectAddAddress: true,
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
            createdAt={item?.createdAt}
          />
        )}
        {/* Image section - unchanged */}
        <ImageRoom
          avatar={avatar}
          isEdit={isEdit}
          isLook={isLook}
          onPressBanner={handleSelectImage}
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
            type={type}
            addressRoom={valueAddressRoom}
            control={control}
            errors={errors}
            isEdit={true}
            isLook={isLook}
            isOwner={isOwner}
            onPressOpenMap={onPressOpenMap}
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
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.text}>Đang xử lý...</Text>
        </View>
      )}
    </View>
  );
};

export default AddRoomScreen;
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
