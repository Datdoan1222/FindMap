import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import RowComponent from '../../component/atoms/RowComponent';
import {useRooms} from '../../hooks/useRooms';
import ItemCard from '../../component/molecules/ItemCard';
import {USER_ID} from '../../constants/envConstants';
import {WIDTH} from '../../constants/distance';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {COLOR} from '../../constants/colorConstants';
import {BUTTON_SIZE} from '../../constants/buttonConstants';
import {height, width} from '../ManagerRoomScreen';

const SelectRoomScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const handleSelectRoom = room => {
    route.params.onSelect(room); // gọi callback
    navigation.goBack();
  };
  const swipeableRefs = useRef({});
  const {data: dataRooms} = useRooms();
  const dataRoom = dataRooms
    ? dataRooms.filter(r => r.owner_id === USER_ID)
    : [];
  const [isSelect, setIsSelect] = useState(false);
  const [selectRoom, setSelectRoom] = useState(null);
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
      <SafeAreaView>
        <RowComponent
          flexDirection="column"
          styles={{width: '100%', height: '94%'}}>
          <FlatList
            data={dataRoom}
            renderItem={({item}) => (
              <ItemCard
                item={item}
                swipeableRefs={swipeableRefs}
                onPress={item => {
                  setSelectRoom(item);
                  setIsSelect(true);
                }}
                // onDelete={handleDelete}
                width={WIDTH - 40} // Chiều rộng 200px
                height={120} // Chiều cao 120px
                imageSize={80} // Ảnh 60x60px
                styleDesgin={
                  selectRoom?.id === item.id
                    ? {borderColor: COLOR.PRIMARY, borderWidth: 2}
                    : {}
                }
              />
            )}
            keyExtractor={item => item.id}
            horizontal={false}
            // scrollEnabled={false}
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

        <RowComponent justify="center" styles={{width: '100%', height: 60}}>
          <TouchableOpacity
            style={[
              styles.button,
              isSelect
                ? {backgroundColor: COLOR.PRIMARY}
                : {backgroundColor: COLOR.SECONDARY},
            ]}
            disabled={!isSelect}
            onPress={() => handleSelectRoom(selectRoom)}>
            <Text style={styles.textButton}>Xác nhận</Text>
          </TouchableOpacity>
        </RowComponent>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default SelectRoomScreen;

const styles = StyleSheet.create({
  gestureContainer: {flex: 1, backgroundColor: COLOR.WHITE},
  flatListContent: {
    paddingVertical: 10,
  },
  button: {
    width: '80%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  textButton: {
    color: COLOR.WHITE,
    fontSize: 16,
  },
});
