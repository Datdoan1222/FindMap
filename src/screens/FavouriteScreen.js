import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {use, useCallback, useEffect, useRef, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import Carousel from 'react-native-reanimated-carousel';
import Space from '../component/atoms/Space';
import {COLOR} from '../constants/colorConstants';
import TextComponent from '../component/atoms/TextComponent';
import RowComponent from '../component/atoms/RowComponent';
import IconStyles from '../constants/IconStyle';
import {ICON_TYPE} from '../constants/iconConstants';
import ButtonIcon from '../component/atoms/ButtonIcon';
import auth from '@react-native-firebase/auth';
import {useDispatch, useSelector} from 'react-redux';
import {fetchPosts, toggleLike} from '../redux/postsSlide';
import Button from '../component/atoms/Button';
import {NAVIGATION_NAME} from '../constants/navigtionConstants';
import {roomsAPI} from '../utill/api/apiRoom';
import ItemCard from '../component/molecules/ItemCard';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  useFavouriteData,
  useToggleFavourite,
} from '../hooks/useFetchFavouriteData';

const currentUserId = '1';
const {width: widthScreen} = Dimensions.get('window');
const bannerWidth = widthScreen * 0.92;
const bannerHeight = (widthScreen - 68) / 2.34;
const FavouriteScreen = () => {
  const route = useRoute();
  const {item} = route.params;
  const [selectedRoom, setSelectedRoom] = useState(null);
  const {navigate} = useNavigation();
  const swipeableRefs = useRef({});

  const userid = auth().currentUser?.uid;
  const {data: favouriteRooms, isLoading} = useFavouriteData(currentUserId); // lấy api data room yêu thích từ id user
  const [isToggleLike, setIsToggleLike] = useState(false);
  const [isHeart, setIsHeart] = useState('heart-outline');
  const dispatch = useDispatch();
  const toggleFavourite = useToggleFavourite();

  const [dataFavourite, setDataFavourite] = useState(
    roomsAPI || favouriteRooms,
  );
  useEffect(() => {}, []);

  // Close all open swipeables when needed
  const closeAllSwipeables = useCallback(() => {
    Object.values(swipeableRefs.current).forEach(ref => {
      if (ref && ref.close) {
        ref.close();
      }
    });
  }, []);
  const handleScroll = useCallback(() => {
    closeAllSwipeables();
  }, [closeAllSwipeables]);

  return (
    <GestureHandlerRootView style={styles.gestureContainer}>
      <View style={{flex: 1}}>
        <FlatList
          data={dataFavourite}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <ItemCard
              swipeEnabled={false}
              iconDelete={ICON_TYPE.ICON_HEART_O_DIS}
              item={item}
              swipeableRefs={swipeableRefs}
              onPress={itm =>
                navigate(NAVIGATION_NAME.ROOM_DETAIL_SCREEN, {
                  item: itm,
                })
              }
              // onDelete={handleDelete}
            />
          )}
          contentContainerStyle={styles.flatListContent}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <IconStyles
                name={searchText.trim() ? ICON_TYPE.SEARCH : ICON_TYPE.HOME}
                color={COLOR.GRAY2}
                size={50}
              />
              <Space height={16} />
              <TextComponent
                text={
                  searchText.trim()
                    ? 'Không có kết quả tìm kiếm'
                    : 'Nhập từ khóa để tìm kiếm phòng trọ'
                }
                color={COLOR.GRAY4}
                size={16}
                textAlign="center"
              />
            </View>
          )}
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
      </View>
    </GestureHandlerRootView>
  );
};

export default FavouriteScreen;

const styles = StyleSheet.create({
  gestureContainer: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  card: {
    flexDirection: 'row',
    padding: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 6,
    marginRight: 10,
  },
  content: {
    // flex: 1,
    padding: 15,
    height: '100%',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLOR.BLACK1,
  },
  price: {
    color: 'green',
    marginTop: 4,
  },
  modalContainer: {
    marginTop: 60,
    backgroundColor: 'white',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: COLOR.BLACK1,
  },
  modalImage: {
    width: 300,
    height: 200,
    borderRadius: 10,
    marginRight: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: COLOR.PRIMARY,
    alignItems: 'center',
    borderRadius: 8,
  },
  bannerContainer: {
    height: bannerHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerContai: {
    alignItems: 'center',
  },
  bannerItem: {
    width: bannerWidth,
    height: bannerHeight,
    borderRadius: 15,
  },
  // flatlist
  flatListContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 40,
  },
});
