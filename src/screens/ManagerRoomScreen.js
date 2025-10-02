import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import Modal from '../component/molecules/Modal';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import HeaderComponent from '../component/molecules/HeaderComponent';
import {COLOR} from '../constants/colorConstants';
import RowComponent from '../component/atoms/RowComponent';
import TextComponent from '../component/atoms/TextComponent';
import {usersAPI} from '../utill/api/apiUsers';
import {roomsAPI} from '../utill/api/apiRoom';
import IconStyles from '../constants/IconStyle';
import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler';
import ItemCard from '../component/molecules/ItemCard';
import {NAVIGATION_NAME} from '../constants/navigtionConstants';
import {ROLE, TYPE} from '../constants/assetsConstants';
import {useRooms} from '../hooks/useRooms';
import {USER_ID} from '../constants/envConstants';
export const {width, height} = Dimensions.get('window');

const ManagerRoomScreen = () => {
  const navigation = useNavigation();
  const handleSearch = () => {};
  const [dataUser, setDataUser] = useState(usersAPI[0]);
  // const [dataRoom, setDataRoom] = useState(roomsAPI);
  const {data: dataRooms} = useRooms();
  const dataRoom = dataRooms
    ? dataRooms.filter(r => r.owner_id === USER_ID)
    : [];

  const swipeableRefs = useRef({});
  const nameUser = dataUser?.name;
  const addressUser = dataUser?.address;
  const handleDelete = () => {};
  // Close all open swipeables when needed
  const closeAllSwipeables = useCallback(() => {
    Object.values(swipeableRefs.current).forEach(ref => {
      if (ref && ref.close) {
        ref.close();
      }
    });
  }, []);
  // Handle FlatList scroll to close swipeables
  const handleScroll = useCallback(() => {
    closeAllSwipeables();
  }, [closeAllSwipeables]);
  return (
    <GestureHandlerRootView style={styles.gestureContainer}>
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          title="QUẢN LÝ "
          onPressLeft={handleSearch}
          onPressRight={() => {
            navigation.navigate(NAVIGATION_NAME.ADD_ROOM_SCREEN, {
              item: {},
              type: TYPE.EDIT,
              role: ROLE.OWNER,
            });
          }}
          iconLeft="search"
          iconRight="add"
          masterScreen={true}
        />
        <RowComponent
          flexDirection="column"
          justify="flex-start"
          alignItems="flex-start"
          styles={styles.body}>
          <TextComponent text={`Phòng trọ ${nameUser}`} size={25} />
          <TextComponent
            text={`${addressUser}`}
            size={15}
            styles={{fontStyle: 'italic'}}
            color={COLOR.BLACK2}
          />
          <RowComponent flexDirection="column" styles={{width: '100%'}}>
            <FlatList
              data={dataRoom}
              renderItem={({item}) => (
                <ItemCard
                  item={item}
                  swipeableRefs={swipeableRefs}
                  onPress={itm =>
                    navigation.navigate(NAVIGATION_NAME.ROOM_DETAIL_SCREEN, {
                      item: itm,
                      role: ROLE.OWNER,
                    })
                  }
                  onDelete={handleDelete}
                  width={width - 40} // Chiều rộng 200px
                  height={120} // Chiều cao 120px
                  imageSize={60} // Ảnh 60x60px
                />
              )}
              keyExtractor={item => item.id}
              horizontal={false}
              scrollEnabled={false}
              contentContainerStyle={styles.flatListContent}
              showsVerticalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              ListEmptyComponent={() => {}}
              // Add some performance optimizations
              removeClippedSubviews={true}
              maxToRenderPerBatch={10}
              windowSize={10}
              initialNumToRender={10}
              getItemLayout={(data, index) => ({
                length: 110, // Approximate item height
                offset: 110 * index,
                index,
              })}
            />
          </RowComponent>
        </RowComponent>
        <Modal
          isVisible={false}
          title={'Tính năng đang phát triển'}
          text={'Tính năng đang phát triển'}
          onConfirm={() => navigation.goBack()}
          textConfirm={'Quay lại'}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default ManagerRoomScreen;

const styles = StyleSheet.create({
  gestureContainer: {flex: 1, backgroundColor: COLOR.WHITE},
  container: {},
  body: {
    marginHorizontal: 10,
  },
  flatListContent: {
    paddingVertical: 10,
  },
});
