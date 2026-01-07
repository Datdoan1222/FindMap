import {Image, Modal, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
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
import ButtonIcon from '../component/atoms/ButtonIcon';
import {USER_ID} from '../constants/envConstants';
import {useUser} from '../hooks/useGetInforUser';
import {useManagerRooms, useMyRooms, useRooms} from '../hooks/useRooms';
import {formatDate} from '../utill/convertTime';
import {convertToK} from '../utill/convertToK';
const recipientName = 'Nguyễn Văn Sáu';
const bankName = 'Vietcombank';
const accountNumber = '0123456789';
const amount = 1000000;
const MyRoomScreen = () => {
  const route = useRoute();
  const {item} = route.params;
  const {data: dataUser, isLoading, error} = useUser(USER_ID);
  const {data: dataRoom} = useRooms(USER_ID);
  const dataMyRoom = dataRoom?.find(r => r.owner_id === USER_ID);
  console.log('dataRoom', JSON.stringify(dataMyRoom, null, 2));
  // console.log('room', room);

  const [isOpenPayment, setIsOpenPayment] = useState(false);
  const navigation = useNavigation();
  const {
    id,
    owner_id,
    user_id,
    title,
    description,
    address,
    region,
    amenities,
    images,
    status,
    rent_price,
    rent_start_date,
    rent_end_date,
    due_date,
    updated_at,
  } = dataMyRoom || {};
  const numberLikes = item?.likes ? Object.keys(item.likes).length : '';
  if (!dataMyRoom) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Đang tải dữ liệu...</Text>
      </View>
    );
  }

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
            source={{uri: item?.images[0]} ?? ''}
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
            text={title ?? 'Phòng trọ'}
          />
          <TextComponent
            numberOfLines={4}
            font={FONT.BOLD}
            size={12}
            color={COLOR.GRAY}
            text={address}
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
              text={description ?? ''}
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
            size={15}
            numberOfLines={5}
            styles={{fontStyle: 'italic', marginLeft: 5}}
            color={COLOR.BLACK1}
            text={
              rent_start_date && rent_end_date
                ? `${formatDate(rent_start_date)} - ${formatDate(
                    rent_end_date,
                  )}`
                : 'Chưa có thời gian'
            }
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
        <RowComponent
          flexDirection="column"
          justify="flex-start"
          alignItems="flex-start">
          <Text style={styles.amount}>
            {rent_price.toLocaleString() ?? '-----'}
          </Text>
          <Text style={styles.labelAmount}>{`Hạn đóng tiền tháng này ${
            formatDate(due_date) || '-----'
          }`}</Text>
          {/* <TextComponent
            font={18}
            // styles={{fontWeight: 'bold'}}
            color={COLOR.DANGER}
            // text={rent_price ? `${convertToK(rent_price)}` : '----'}
          /> */}
          {/* <TextComponent
            size={12}
            color={COLOR.GRAY}
            // text={due_date ? `Hạn đóng tiền tháng này ` : '1000000'}
          /> */}
        </RowComponent>
        <Button title={'Đóng tiền'} onPress={() => setIsOpenPayment(true)} />
      </RowComponent>
      <Modal
        visible={isOpenPayment}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsOpenPayment(false)}>
        <View style={styles.container}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              width: '100%',
              paddingHorizontal: 20,
            }}>
            <ButtonIcon
              name={'arrow-back'}
              onPress={() => setIsOpenPayment(false)}
            />
          </View>
          <Text style={styles.title}>Mã QR Chuyển Tiền</Text>

          <Image
            style={styles.qrImage}
            // source={{
            //   uri: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=NguyenVanSau_VCB_0123456789_500000',
            // }}
            source={require('../assets/images/QR.jpg')}
          />

          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              Chuyển tới: <Text style={styles.bold}>{recipientName}</Text>
            </Text>
            <Text style={styles.infoText}>
              Ngân hàng: <Text style={styles.bold}>{bankName}</Text>
            </Text>
            <Text style={styles.infoText}>
              Số tài khoản: <Text style={styles.bold}>{accountNumber}</Text>
            </Text>
            <Text style={styles.infoText}>
              Số tiền:{' '}
              <Text style={styles.amount}>
                {rent_price.toLocaleString()} VND
              </Text>
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default MyRoomScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
    backgroundColor: COLOR.PRIMARY1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: COLOR.PRIMARY,
  },
  qrImage: {
    width: 250,
    height: 250,
    marginBottom: 30,
    backgroundColor: COLOR.WHITE,
    borderRadius: 15,
  },
  infoContainer: {
    width: '80%',
    alignItems: 'flex-start',
  },
  infoText: {
    fontSize: 18,
    marginBottom: 10,
    color: COLOR.BLACK1,
  },
  bold: {
    fontWeight: '600',
  },
  amount: {
    color: '#d32f2f',
    fontWeight: 'bold',
    fontSize: 18,
  },
  labelAmount: {
    fontSize: 14,
    color: COLOR.BLACK1,
    fontStyle: 'italic',
  },
});
