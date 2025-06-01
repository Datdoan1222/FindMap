import {StyleSheet, Text, Image, View, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import ButtonIcon from '../../component/atoms/ButtonIcon';
import {useNavigation} from '@react-navigation/native';
import {NAVIGATION_NAME} from '../../constants/navigtionConstants';
import Button from '../../component/atoms/Button';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../../redux/authSlide';
import {BUTTON_SIZE} from '../../constants/buttonConstants';
import RowComponent from '../../component/atoms/RowComponent';
import TextComponent from '../../component/atoms/TextComponent';
import {addUser, fetchUserById} from '../../redux/usersSlide';
import auth from '@react-native-firebase/auth';
import {COLOR} from '../../constants/colorConstants';
import IconStyles from '../../constants/IconStyle';
import Space from '../../component/atoms/Space';
import {selectFilteredOwners} from '../../redux/ownersSlide';
import Modal from '../../component/molecules/Modal';

const AccountScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = auth().currentUser;
  const {currentUser} = useSelector(state => state.users);
  const ownerSearch = useSelector(selectFilteredOwners);
  const [isModalStatus, setIsModalStatus] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchUserById(user?.uid));
    }
  }, []);


  return (
    <>
      <Modal
        visible={isModalStatus}
        title={'Thông báo'}
        text={'Bạn chưa đăng kí phòng trọ. Hãy đăng kí phòng'}
        textConfirm={'Đăng kí'}
        textCancel={'Hủy'}
        onConfirm={() =>
          navigation.navigate(NAVIGATION_NAME.INFOR_ROOMS_DETAIL_SCREEN, {
            status: false,
          })
        }
        onCancel={() => setIsModalStatus(false)}
      />
      <ScrollView
        showsVerticalScrollIndicator={false} // Ẩn thanh cuộn dọc
        style={styles.container}>
        <RowComponent
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          styles={{marginVertical: 20}}>
          <RowComponent
            alignItems="center"
            justifyContent="center"
            styles={styles.imgContai}>
            {user?.photoURL ? (
              <Image
                source={{uri: user?.photoURL}}
                style={{width: '100%', height: '100%', backgroundColor: 'red'}}
              />
            ) : (
              <IconStyles
                name="person"
                size={100}
                color={COLOR.GRAY1}
                style={{
                  width: '100%',
                  textAlign: 'center',
                  textAlignVertical: 'center',
                }}
              />
            )}
          </RowComponent>
          <Space height={10} />
          <RowComponent>
            <TextComponent
              size={25}
              title={true}
              text={user?.displayName ? user?.displayName : 'Người dùng user'}
            />
          </RowComponent>
        </RowComponent>
        {/*  */}
        <RowComponent
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          styles={{
            marginVertical: 10,
            backgroundColor: COLOR.WHITE,
            borderRadius: 10,
            padding: 20,
          }}
          onPress={() =>
            navigation.navigate(NAVIGATION_NAME.INFOR_ROOMS_DETAIL_SCREEN, {
              status: currentUser?.status,
            })
          }>
          {currentUser?.status ? (
            <RowComponent
              flexDirection="column"
              alignItems="center"
              styles={{width: '100%'}}>
              <TextComponent
                styles={{justifyContent: 'flex-start'}}
                text="Tiền tháng 3/2025"
              />
              <Space height={20} />
              <TextComponent text={'2.190.000 đ'} size={30} />
              <Space height={20} />
              <RowComponent
                flexDirection="row"
                alignItems="center"
                justify="center">
                <RowComponent onPress={() => console.log('Tiền nước')}>
                  <IconStyles name="water" color={COLOR.PRIMARY} size={25} />
                  <TextComponent text={'190.000 đ'} />
                </RowComponent>
                <Space width={10} />
                <RowComponent onPress={() => console.log('Tiền điện')}>
                  <IconStyles name="flash" color={COLOR.PRIMARY} size={25} />
                  <TextComponent text={'220.000 đ'} />
                </RowComponent>
              </RowComponent>
            </RowComponent>
          ) : (
            <>
              <IconStyles name="add" color={COLOR.GRAY3} />
              <TextComponent color={COLOR.GRAY3} text="Đăng ký phòng mới" />
            </>
          )}
        </RowComponent>

        {/*  */}
        <RowComponent flexDirection="column" styles={{marginVertical: 10}}>
          <RowComponent
            styles={[
              currentUser?.status
                ? {backgroundColor: COLOR.WHITE}
                : {backgroundColor: COLOR.GRAY1},
              styles.itemMenu,
            ]}
            onPress={() =>
              currentUser?.status
                ? navigation.navigate(NAVIGATION_NAME.INFOR_ROOMS_SCREEN)
                : setIsModalStatus(true)
            }>
            <IconStyles
              name="home-lightbulb"
              iconSet="MaterialCommunityIcons"
              color={COLOR.PRIMARY}
              size={30}
              style={styles.icon}
            />
            <TextComponent text="Phòng trọ của tôi" />
            {/* chứa thông tin hình ảnh phòng giá phòng, giá cọc, hợp đồng, tiền điện nước, tiền rác, chi phí..v..v */}
          </RowComponent>
          <RowComponent
            styles={[
              currentUser?.status
                ? {backgroundColor: COLOR.WHITE}
                : {backgroundColor: COLOR.GRAY1},
              styles.itemMenu,
            ]}
            onPress={() =>
              currentUser?.status
                ? navigation.navigate(NAVIGATION_NAME.INFOR_TRANSFER_SCREEN)
                : setIsModalStatus(true)
            }>
            <IconStyles
              name="payments"
              iconSet="MaterialIcons"
              color={COLOR.PRIMARY}
              size={25}
              style={styles.icon}
            />
            <TextComponent text="Thanh toán" />
          </RowComponent>
          <RowComponent
            styles={[
              currentUser?.status
                ? {backgroundColor: COLOR.WHITE}
                : {backgroundColor: COLOR.GRAY1},
              styles.itemMenu,
            ]}
            onPress={() =>
              currentUser?.status
                ? navigation.navigate(NAVIGATION_NAME.INFOR_CAMERA_SCREEN)
                : setIsModalStatus(true)
            }>
            <IconStyles
              name="camera"
              iconSet="FontAwesome"
              color={COLOR.PRIMARY}
              size={21}
              style={styles.icon}
            />
            <TextComponent text="Camera" />
          </RowComponent>
          <RowComponent
            styles={[
                currentUser?.status
                ? {backgroundColor: COLOR.WHITE}
                : {backgroundColor: COLOR.GRAY1},
              styles.itemMenu,
            ]}
            onPress={() =>
              currentUser?.status
                ? navigation.navigate(NAVIGATION_NAME.INFOR_OWNER_SCREEN)
                : setIsModalStatus(true)
            }>
            <IconStyles
              name="info"
              iconSet="MaterialIcons"
              color={COLOR.PRIMARY}
              size={25}
              style={styles.icon}
            />
            <TextComponent text="Liên hệ" />
          </RowComponent>
        </RowComponent>
        <Button
          title={user ? 'Đăng xuất' : 'Đăng nhập'}
          size={BUTTON_SIZE.MEDIUM}
          onPress={() =>
            user
              ? dispatch(logout())
              : navigation.navigate(NAVIGATION_NAME.LOGIN_SCREEN)
          }
        />
      </ScrollView>
    </>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 30,
    marginVertical: 10,
    paddingBottom: 20,
  },
  imgContai: {
    width: 150,
    height: 150,
    borderRadius: 100,
    backgroundColor: COLOR.GRAY3,
  },
  itemMenu: {
    // flex: 1,
    width: '100%',
    padding: 15,
    margin: 7,
    borderRadius: 10,
  },
  icon: {
    width: 40,
  },
});
