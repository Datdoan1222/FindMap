import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Modal as RNModal,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import PostComponent from '../../../component/molecules/PostComponent';
import RowComponent from '../../../component/atoms/RowComponent';
import {FONT, FONT_SIZE} from '../../../constants/fontConstants';
import {COLOR} from '../../../constants/colorConstants';
import ButtonIcon from '../../../component/atoms/ButtonIcon';
import {getFormattedTime} from '../../../utill/time';
import TextComponent from '../../../component/atoms/TextComponent';
import IconStyles from '../../../constants/IconStyle';
import {ICON_TYPE} from '../../../constants/iconConstants';
import Space from '../../../component/atoms/Space';
import Button from '../../../component/atoms/Button';
import auth from '@react-native-firebase/auth';
import {useDispatch} from 'react-redux';
import {toggleLike} from '../../../redux/postsSlide';
import Modal from '../../../component/molecules/Modal';
import {NAVIGATION_NAME} from '../../../constants/navigtionConstants';
import {roomsAPI} from '../../../utill/api/apiRoom';
import {usersAPI} from '../../../utill/api/apiUsers';
import {ROLE} from '../../../constants/assetsConstants';
import {showMessage, hideMessage} from 'react-native-flash-message';
import {updateRoom} from '../../../redux/slideNew/roomsSlice';
import Banner from '../../../component/atoms/Banner';

const {width, height} = Dimensions.get('window');
const RoomDetailScreen = ({handleToggleLike}) => {
  const route = useRoute();
  const {item, role} = route.params;
  const navigation = useNavigation();
  const [dataRoom, setDataRoom] = useState(roomsAPI[0]);
  const [dataUser, setDataUser] = useState(usersAPI[0]);
  const [isOpenImage, setIsOpenImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  //thông  tin user đăng bài thì lấy từ ID user gắn tạm id [0]
  const userImage = dataUser?.avatar;
  const userName = dataUser?.name || 'Unknown User';
  const userAddress = dataUser?.address;

  //thông  tin post đăng bài thì lấy từ ID đưuọc truyền prop component cha qua gắn tạm id [0]
  const id = dataRoom?.id;
  const postImage = dataRoom?.images;
  const address = dataRoom?.address;
  const statusText = dataRoom?.statusText;
  const amenities = dataRoom?.amenities;
  const description = dataRoom?.description;
  const title = dataRoom?.title;
  const image = dataRoom?.images;
  const [isToggleLike, setIsToggleLike] = useState(false);
  const [isOpenModalLogin, setIsOpenModalLogin] = useState(false);
  // Existing states
  const [isEditAddress, setIsEditAddress] = useState(false);
  const [isEditAmenities, setIsEditAmenities] = useState(false);
  const [isEditDescription, setIsEditDescription] = useState(false);

  // Edit states for form data
  const [editedAddress, setEditedAddress] = useState(address || '');
  const [editedAmenities, setEditedAmenities] = useState(amenities || []);
  console.log(item);

  const [editedDescription, setEditedDescription] = useState(description || '');
  const [newAmenity, setNewAmenity] = useState('');
  const [isHeart, setIsHeart] = useState('heart-outline');

  // Save functions
  const saveAddress = async () => {
    try {
      // API call to update address
      await updateRoom(id, editedAddress);
      setIsEditAddress(false);
      // Update local state or refetch data
      showMessage({
        message: 'Cập nhật địa chỉ thành công',
        type: 'success',
      });
    } catch (error) {
      showMessage({
        message: 'Có lỗi xảy ra khi cập nhật địa chỉ',
        type: 'danger',
      });
    }
  };

  const saveDescription = async () => {
    try {
      await updateRoom(id, editedDescription);
      setIsEditDescription(false);
      showMessage({
        message: 'Cập nhật mô tả thành công',
        type: 'success',
      });
    } catch (error) {
      showMessage({
        message: 'Có lỗi xảy ra khi cập nhật mô tả',
        type: 'danger',
      });
    }
  };

  const saveAmenities = async () => {
    try {
      await updateRoom(id, editedAmenities);
      setIsEditAmenities(false);
      showMessage({
        message: 'Cập nhật tiện nghi thành công',
        type: 'success',
      });
    } catch (error) {
      showMessage({
        message: 'Có lỗi xảy ra khi cập nhật tiện nghi',
        type: 'danger',
      });
    }
  };

  const addAmenity = () => {
    if (newAmenity.trim()) {
      setEditedAmenities([...editedAmenities, newAmenity.trim()]);
      setNewAmenity('');
    }
  };

  const removeAmenity = index => {
    Alert.alert('Xác nhận xóa', 'Bạn có chắc muốn xóa tiện nghi này?', [
      {text: 'Hủy', style: 'cancel'},
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => {
          const updated = editedAmenities.filter((_, i) => i !== index);
          setEditedAmenities(updated);
        },
      },
    ]);
  };

  // Cancel edit functions
  const cancelAddressEdit = () => {
    setEditedAddress(address || '');
    setIsEditAddress(false);
  };

  const cancelDescriptionEdit = () => {
    setEditedDescription(description || '');
    setIsEditDescription(false);
  };

  const cancelAmenitiesEdit = () => {
    setEditedAmenities(amenities || []);
    setIsEditAmenities(false);
    setNewAmenity('');
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `${title}` || 'Chi tiết bài viết',
      headerTitleStyle: {
        fontFamily: FONT.MEDIUM,
        fontSize: FONT_SIZE.BODY_1,
        color: COLOR.WHITE,
      },
      //   headerRight: () => (
      //     <View style={{flexDirection: 'row', alignItems: 'center'}}>
      //       {role === ROLE.OWNER && (
      //         <TouchableOpacity onPress={handleSelectHeart}>
      //           <IconStyles
      //             name={'edit'}
      //             iconSet="AntDesign"
      //             color={COLOR.WHITE}
      //             size={24}
      //           />
      //         </TouchableOpacity>
      //       )}
      //     </View>
      //   ),
    });
  }, [navigation, dataRoom, isHeart]); // Thêm isHeart vào đây

  const handleBannerPress = useCallback(item => {
    console.log('item', item);

    setSelectedImage(item); // hoặc item.images[0]
    setIsOpenImage(true);
  }, []);

  return (
    <View style={{flex: 1}}>
      <ScrollView>
        {/* Header section - unchanged */}
        <RowComponent
          flexDirection="row"
          alignItems="center"
          justify="space-between"
          styles={styles.header_post}>
          {/* ... existing header content ... */}
        </RowComponent>

        {/* Image section - unchanged */}
        {/* 
        {image && (
          <Banner data={image} onPress={() => handleBannerPress(item)} />
        )} */}
        {image?.map(item => {
          return (
            <TouchableOpacity onPress={() => handleBannerPress(item)}>
              <Image
                style={{width: '100%', height: 200}}
                source={{uri: item}}
              />
            </TouchableOpacity>
          );
        })}
        {/* Title and Rating section */}
        <RowComponent
          flexDirection="column"
          alignItems="center"
          styles={{
            paddingVertical: 10,
            paddingHorizontal: 15,
            backgroundColor: COLOR.WHITE,
          }}>
          <TextComponent
            numberOfLines={4}
            font={FONT.BOLD}
            size={16}
            // text={address}
          />
          <Space height={10} />

          <RowComponent
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

          {/* Address Section */}
          <RowComponent
            styles={{width: '100%', marginTop: 10}}
            justify="space-between"
            alignItems="flex-start">
            <Image source={require('../../../assets/images/location.png')} />

            <View style={styles.editableSection}>
              {isEditAddress ? (
                <View style={styles.editContainer}>
                  <TextInput
                    style={styles.editInput}
                    value={editedAddress}
                    onChangeText={setEditedAddress}
                    multiline
                    placeholder="Nhập địa chỉ..."
                    placeholderTextColor={COLOR.GRAY3}
                  />
                  <RowComponent styles={styles.editActions}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.cancelButton]}
                      onPress={cancelAddressEdit}>
                      <TextComponent text="Hủy" color={COLOR.GRAY3} size={12} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.saveButton]}
                      onPress={saveAddress}>
                      <TextComponent text="Lưu" color={COLOR.WHITE} size={12} />
                    </TouchableOpacity>
                  </RowComponent>
                </View>
              ) : (
                <TextComponent
                  size={15}
                  text={editedAddress || address}
                  styles={{fontStyle: 'italic', flex: 1}}
                />
              )}
            </View>

            {role === ROLE.OWNER && (
              <TouchableOpacity onPress={() => setIsEditAddress(prev => !prev)}>
                <IconStyles
                  iconSet={'AntDesign'}
                  name={isEditAddress ? 'close' : 'edit'}
                  size={20}
                  color={isEditAddress ? COLOR.FAIL : COLOR.GRAY3}
                />
              </TouchableOpacity>
            )}
          </RowComponent>
        </RowComponent>

        <Space height={10} />

        {/* Amenities Section */}
        {(editedAmenities?.length > 0 || role === ROLE.OWNER) && (
          <RowComponent
            flexDirection="column"
            alignItems="flex-start"
            styles={{
              paddingVertical: 10,
              paddingHorizontal: 15,
              backgroundColor: COLOR.WHITE,
            }}>
            <RowComponent justify="space-between" styles={{width: '100%'}}>
              <TextComponent
                size={15}
                styles={{fontWeight: 'bold'}}
                color={COLOR.BLACK1}
                text={'Các tiện nghi khác'}
              />
              {role === ROLE.OWNER && (
                <RowComponent>
                  {isEditAmenities && (
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        styles.cancelButton,
                        {marginRight: 8},
                      ]}
                      onPress={cancelAmenitiesEdit}>
                      <TextComponent text="Hủy" color={COLOR.GRAY3} size={12} />
                    </TouchableOpacity>
                  )}
                  {isEditAmenities && (
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        styles.saveButton,
                        {marginRight: 8},
                      ]}
                      onPress={saveAmenities}>
                      <TextComponent text="Lưu" color={COLOR.WHITE} size={12} />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={() => setIsEditAmenities(prev => !prev)}>
                    <IconStyles
                      iconSet={'AntDesign'}
                      name={isEditAmenities ? 'check' : 'edit'}
                      size={20}
                      color={isEditAmenities ? COLOR.SUCCESSFUL : COLOR.GRAY3}
                    />
                  </TouchableOpacity>
                </RowComponent>
              )}
            </RowComponent>

            <Space height={10} />

            {/* Amenities List */}
            {editedAmenities?.map((amenity, index) => (
              <RowComponent
                key={index}
                justify="space-between"
                styles={{width: '100%', marginBottom: 5}}>
                <RowComponent style={{alignItems: 'flex-start', flex: 1}}>
                  <IconStyles
                    name={'check'}
                    iconSet="Entypo"
                    color={COLOR.SUCCESSFUL}
                    size={20}
                  />
                  <TextComponent
                    size={13}
                    styles={{
                      fontStyle: 'italic',
                      marginLeft: 5,
                      flexShrink: 1,
                    }}
                    color={COLOR.BLACK1}
                    text={amenity}
                    numberOfLines={0}
                  />
                </RowComponent>
                {role === ROLE.OWNER && isEditAmenities && (
                  <TouchableOpacity onPress={() => removeAmenity(index)}>
                    <IconStyles
                      iconSet={'FontAwesome'}
                      name={'trash'}
                      size={16}
                      color={COLOR.FAIL}
                    />
                  </TouchableOpacity>
                )}
              </RowComponent>
            ))}

            {/* Add New Amenity */}
            {role === ROLE.OWNER && isEditAmenities && (
              <View style={styles.addAmenityContainer}>
                <TextInput
                  style={styles.addAmenityInput}
                  value={newAmenity}
                  onChangeText={setNewAmenity}
                  placeholder="Thêm tiện nghi mới..."
                  placeholderTextColor={COLOR.GRAY3}
                />
                <TouchableOpacity style={styles.addButton} onPress={addAmenity}>
                  <IconStyles
                    name="plus"
                    iconSet="AntDesign"
                    size={16}
                    color={COLOR.PRIMARY}
                  />
                </TouchableOpacity>
              </View>
            )}

            {/* Quick Add Button (when not in edit mode) */}
            {role === ROLE.OWNER && !isEditAmenities && (
              <TouchableOpacity
                onPress={() => setIsEditAmenities(true)}
                style={styles.quickAddButton}>
                <RowComponent>
                  <IconStyles
                    iconSet="Entypo"
                    name={'plus'}
                    size={20}
                    color={COLOR.GRAY4}
                  />
                  <TextComponent
                    styles={{fontStyle: 'italic', marginLeft: 8}}
                    size={13}
                    color={COLOR.GRAY4}
                    text={'Thêm các tiện nghi'}
                  />
                </RowComponent>
              </TouchableOpacity>
            )}
          </RowComponent>
        )}

        <Space height={10} />

        {/* Description Section */}
        {(editedDescription || role === ROLE.OWNER) && (
          <RowComponent
            flexDirection="column"
            alignItems="flex-start"
            styles={{
              paddingVertical: 10,
              paddingHorizontal: 15,
              backgroundColor: COLOR.WHITE,
            }}>
            <RowComponent
              flexDirection="row"
              justify="space-between"
              styles={{width: '100%'}}>
              <TextComponent
                size={15}
                styles={{fontWeight: 'bold'}}
                color={COLOR.BLACK1}
                text={'Mô tả'}
              />
              {role === ROLE.OWNER && (
                <RowComponent>
                  {isEditDescription && (
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        styles.cancelButton,
                        {marginRight: 8},
                      ]}
                      onPress={cancelDescriptionEdit}>
                      <TextComponent text="Hủy" color={COLOR.GRAY3} size={12} />
                    </TouchableOpacity>
                  )}
                  {isEditDescription && (
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        styles.saveButton,
                        {marginRight: 8},
                      ]}
                      onPress={saveDescription}>
                      <TextComponent text="Lưu" color={COLOR.WHITE} size={12} />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={() => setIsEditDescription(prev => !prev)}>
                    <IconStyles
                      iconSet="AntDesign"
                      name={isEditDescription ? 'check' : 'edit'}
                      size={20}
                      color={isEditDescription ? COLOR.SUCCESSFUL : COLOR.GRAY3}
                    />
                  </TouchableOpacity>
                </RowComponent>
              )}
            </RowComponent>

            <Space height={10} />

            {isEditDescription ? (
              <TextInput
                style={styles.descriptionInput}
                value={editedDescription}
                onChangeText={setEditedDescription}
                multiline
                numberOfLines={4}
                placeholder="Nhập mô tả..."
                placeholderTextColor={COLOR.GRAY3}
                textAlignVertical="top"
              />
            ) : (
              <TextComponent
                size={13}
                numberOfLines={isEditDescription ? 0 : 5}
                styles={{fontStyle: 'italic', marginLeft: 5}}
                color={COLOR.BLACK1}
                text={editedDescription || description || 'Chưa có mô tả'}
              />
            )}
          </RowComponent>
        )}
      </ScrollView>

      {/* Bottom section - unchanged */}
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
        <RowComponent>
          <TextComponent text={'1.000.000đ'} />
        </RowComponent>
        <Button title={'Xem mọi phòng'} />
      </RowComponent>

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
        // animationType="fade"
        // style={{zIndex: 99}}
        onRequestClose={() => setIsOpenImage(false)}>
        {selectedImage && (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ButtonIcon
              name={ICON_TYPE.DELETE}
              onPress={() => setIsOpenImage(false)}
            />
            <Image
              source={{uri: selectedImage}}
              style={{width: width, height: height - 600}}
            />
          </View>
        )}
      </RNModal>
    </View>
  );
};

export default RoomDetailScreen;

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
  editableSection: {
    flex: 1,
    marginHorizontal: 10,
  },
  editContainer: {
    flex: 1,
  },
  editInput: {
    borderWidth: 1,
    borderColor: COLOR.GRAY2,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: COLOR.BLACK1,
    backgroundColor: COLOR.WHITE,
    minHeight: 40,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: COLOR.GRAY2,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: COLOR.BLACK1,
    backgroundColor: COLOR.WHITE,
    minHeight: 100,
    width: '100%',
  },
  editActions: {
    marginTop: 8,
    justifyContent: 'flex-end',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: COLOR.GRAY1,
  },
  saveButton: {
    backgroundColor: COLOR.PRIMARY,
  },
  addAmenityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  addAmenityInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLOR.GRAY2,
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    color: COLOR.BLACK1,
    backgroundColor: COLOR.WHITE,
  },
  addButton: {
    marginLeft: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLOR.GRAY1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickAddButton: {
    backgroundColor: COLOR.GRAY1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginTop: 10,
  },
});
