import React, {useCallback, useEffect, useRef, useState, useMemo} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';

import Modal from '../component/molecules/Modal';
import HeaderComponent from '../component/molecules/HeaderComponent';
import RowComponent from '../component/atoms/RowComponent';
import TextComponent from '../component/atoms/TextComponent';
import ItemCard from '../component/molecules/ItemCard';
import Space from '../component/atoms/Space';

import {COLOR} from '../constants/colorConstants';
import {NAVIGATION_NAME} from '../constants/navigtionConstants';
import {ROLE, TYPE} from '../constants/assetsConstants';
import {USER_ID} from '../constants/envConstants';

import {usersAPI} from '../utill/api/apiUsers';
import {useDeleteRoom, useRooms} from '../hooks/useRooms';
import {useRentStatus} from '../hooks/useRentStatus';

export const {width} = Dimensions.get('window');

const ManagerRoomScreen = () => {
  const navigation = useNavigation();
  const deleteRoom = useDeleteRoom();

  const [dataUser] = useState(usersAPI[0]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [tab, setTab] = useState('rent');

  const {data: dataRooms} = useRooms();
  const swipeableRefs = useRef({});

  // --- Derived data ---
  const rooms = useMemo(() => {
    if (!dataRooms) return [];
    return dataRooms.filter(r => r.owner_id === USER_ID);
  }, [dataRooms]);

  const roomsRent = useMemo(
    () => rooms.filter(r => r.status === false), // đã thuê
    [rooms],
  );
  const roomsNoRent = useMemo(
    () => rooms.filter(r => r.status === true), // còn trống
    [rooms],
  );

  const roomList = tab === 'rent' ? roomsRent : roomsNoRent;

  // --- Handlers ---
  const handleTabChange = type => {
    setTab(type);
    setSelectedRoom(null);
  };

  const handleDelete = roomId => {
    deleteRoom.mutate(roomId, {
      onSuccess: () => Alert.alert('Thành công', 'Xóa phòng thành công!'),
      onError: e => {
        Alert.alert('Thất bại', 'Không thể xóa phòng!');
        console.log('❌ Lỗi:', e);
      },
    });
  };

  const handleEditRoom = () => {
    if (!selectedRoom) return;
    navigation.navigate(NAVIGATION_NAME.ROOM_DETAIL_SCREEN, {
      id: selectedRoom.id,
      role: ROLE.OWNER,
      type: TYPE.EDIT,
    });
  };

  const handleForRentRoom = () => {
    if (!selectedRoom) return;
    navigation.navigate(NAVIGATION_NAME.ROOM_FORRENT_SCREEN, {
      item: selectedRoom,
      status: selectedRoom?.status,
    });
  };

  const handleScroll = useCallback(() => {
    Object.values(swipeableRefs.current).forEach(ref => ref?.close?.());
  }, []);

  const RoomItem = ({
    item,
    selectedRoom,
    onSelect,
    onDelete,
    swipeableRefs,
  }) => {
    const isStatus = !item?.status; // true = đã thuê
    const data = {
      rent_start_date: item?.rent_start_date,
      rent_end_date: item?.rent_end_date,
      due_date: item?.due_date,
    };

    const {paymentStatus, warningContractStatus, daysLeft} =
      useRentStatus(data);
    const isWarningContractStatus = isStatus && warningContractStatus;
    const isPaymentStatus = isStatus && !paymentStatus; // true là đã thanh toán
    let borderStyle = {};
    if (selectedRoom?.id === item.id) {
      borderStyle = {borderColor: COLOR.PRIMARY, borderWidth: 2};
    }
    return (
      <ItemCard
        item={item}
        swipeEnabled={item?.status}
        swipeableRefs={swipeableRefs}
        onPress={() => onSelect(item)}
        onDelete={onDelete}
        width={width - 40}
        height={120}
        imageSize={80}
        styleDesgin={borderStyle}
        isWarningContractStatus={isWarningContractStatus}
        isPaymentStatus={isPaymentStatus}
        daysLeft={daysLeft}
      />
    );
  };

  // --- Render ---
  const renderRoomItem = ({item}) => (
    <RoomItem
      item={item}
      selectedRoom={selectedRoom}
      onSelect={setSelectedRoom}
      onDelete={handleDelete}
      swipeableRefs={swipeableRefs}
    />
  );

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          title="QUẢN LÝ"
          iconLeft="search"
          iconRight="add"
          masterScreen
          onPressLeft={() => {}}
          onPressRight={() =>
            navigation.navigate(NAVIGATION_NAME.ADD_ROOM_SCREEN, {
              item: {},
              type: TYPE.EDIT,
              role: ROLE.OWNER,
            })
          }
        />

        {/* Thông tin chủ trọ */}
        <RowComponent flexDirection="column" styles={styles.body}>
          <RowComponent flexDirection="column" alignItems="flex-start">
            <TextComponent text={`Phòng trọ ${dataUser?.name}`} size={25} />
            <TextComponent
              text={dataUser?.address}
              size={15}
              styles={{fontStyle: 'italic'}}
              color={COLOR.BLACK2}
            />
            <Space height={10} />

            <RowComponent justify="flex-end" styles={{width: '100%'}}>
              <TextComponent
                text={`Số phòng quản lý ${rooms.length}`}
                size={18}
                color={COLOR.GREY_300}
                styles={{fontStyle: 'italic'}}
              />
            </RowComponent>
          </RowComponent>

          {/* Tabbar */}
          <RowComponent justify="space-between" styles={styles.tabBar}>
            {[
              {label: 'Đã thuê', type: 'rent'},
              {label: 'Còn trống', type: 'norent'},
            ].map(({label, type}) => (
              <TouchableOpacity
                key={type}
                style={[styles.tabItem, tab === type && styles.tabItemActive]}
                onPress={() => handleTabChange(type)}>
                <Text style={styles.tabText}>{label}</Text>
              </TouchableOpacity>
            ))}
          </RowComponent>

          {/* Danh sách phòng */}
          <FlatList
            data={roomList}
            renderItem={renderRoomItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.flatListContent}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            removeClippedSubviews
            maxToRenderPerBatch={10}
            windowSize={10}
            initialNumToRender={10}
            getItemLayout={(_, index) => ({
              length: 110,
              offset: 110 * index,
              index,
            })}
            ListEmptyComponent={() => (
              <Text style={styles.emptyText}>Không có phòng nào</Text>
            )}
          />

          {/* Action Buttons */}
          {tab === 'norent' && (
            <RowComponent justify="center" styles={styles.actionRow}>
              <TouchableOpacity
                style={[
                  styles.button,
                  !selectedRoom?.status && styles.buttonDisabled,
                ]}
                disabled={!selectedRoom?.status}
                onPress={handleEditRoom}>
                <Text
                  style={[
                    styles.textButton,
                    !selectedRoom?.status && styles.textButtonDisabled,
                  ]}>
                  Chỉnh sửa
                </Text>
              </TouchableOpacity>
              <Space width={10} />
              <TouchableOpacity
                style={[
                  styles.button,
                  !selectedRoom?.status && styles.buttonDisabled,
                ]}
                disabled={!selectedRoom?.status}
                onPress={handleForRentRoom}>
                <Text
                  style={[
                    styles.textButton,
                    !selectedRoom?.status && styles.textButtonDisabled,
                  ]}>
                  Cho thuê
                </Text>
              </TouchableOpacity>
            </RowComponent>
          )}

          {tab === 'rent' && (
            <RowComponent justify="center" styles={styles.actionRow}>
              <TouchableOpacity
                style={[
                  styles.button,
                  {width: '100%'},
                  !selectedRoom && styles.buttonDisabled,
                ]}
                disabled={!selectedRoom}
                onPress={handleForRentRoom}>
                <Text
                  style={[
                    styles.textButton,
                    !selectedRoom && styles.textButtonDisabled,
                  ]}>
                  Xem thông tin người thuê
                </Text>
              </TouchableOpacity>
            </RowComponent>
          )}
        </RowComponent>

        {/* Modal placeholder */}
        <Modal
          isVisible={false}
          title="Tính năng đang phát triển"
          text="Tính năng đang phát triển"
          onConfirm={() => navigation.goBack()}
          textConfirm="Quay lại"
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default ManagerRoomScreen;

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: COLOR.WHITE},
  container: {flex: 1},
  body: {marginHorizontal: 10, flex: 1},
  tabBar: {width: '100%', paddingVertical: 10},
  tabItem: {
    width: '50%',
    padding: 5,
    alignItems: 'center',
  },
  tabItemActive: {
    borderBottomColor: COLOR.PRIMARY,
    borderBottomWidth: 3,
  },
  tabText: {fontSize: 16, fontWeight: 'bold'},
  flatListContent: {paddingVertical: 10},
  emptyText: {textAlign: 'center', color: COLOR.GREY_300, marginTop: 20},
  actionRow: {width: '100%', height: 60},
  button: {
    width: '40%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    backgroundColor: COLOR.PRIMARY,
  },
  buttonDisabled: {
    backgroundColor: COLOR.SECONDARY,
    borderColor: COLOR.BLACK1,
    borderWidth: 1,
  },
  textButton: {color: COLOR.WHITE, fontSize: 16, fontWeight: 'bold'},
  textButtonDisabled: {color: COLOR.BLACK1},
});
