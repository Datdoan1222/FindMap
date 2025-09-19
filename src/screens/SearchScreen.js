import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Animated,
  Dimensions,
  TextInput,
  StatusBar,
  Image,
} from 'react-native';
import React, {useState, useCallback, useRef, useEffect, useMemo} from 'react';
import {COLOR} from '../constants/colorConstants';
import RowComponent from '../component/atoms/RowComponent';
import TextComponent from '../component/atoms/TextComponent';
import Space from '../component/atoms/Space';
import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler';
import IconStyles from '../constants/IconStyle';
import {ICON_TYPE} from '../constants/iconConstants';
import {useNavigation} from '@react-navigation/native';
import {NAVIGATION_NAME} from '../constants/navigtionConstants';
import {roomsAPI} from '../utill/api/apiRoom';
import {SafeAreaView} from 'react-native-safe-area-context';
import userStore from '../store/userStore';
import {postsAPI} from '../utill/api/apiPost';
import ItemCard from '../component/molecules/ItemCard';

// Use your actual rooms data
const sampleData = [...roomsAPI, ...postsAPI];

const SearchScreen = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]); // Bắt đầu với mảng rỗng
  const [searchText, setSearchText] = useState('');
  const screenWidth = Dimensions.get('window').width;
  const flatListRef = useRef(null);
  const swipeableRefs = useRef({});
  const {currentLocation} = userStore();

  // Close all open swipeables when needed
  const closeAllSwipeables = useCallback(() => {
    Object.values(swipeableRefs.current).forEach(ref => {
      if (ref && ref.close) {
        ref.close();
      }
    });
  }, []);
  useEffect(() => {
    setSearchText('');
    setData([]);
  }, [currentLocation, sampleData]);

  const filteredDataRegion = useMemo(() => {
    const region = currentLocation?.parentNew || currentLocation?.parent;

    if (!region?.trim() || !sampleData) {
      return [];
    }

    return sampleData?.filter(item =>
      item.region?.toLowerCase().includes(region.toLowerCase()),
    );
  }, [currentLocation, sampleData]);

  const handleSearch = text => {
    setSearchText(text);
    // Close all swipeables when searching
    closeAllSwipeables();

    // Chỉ search khi có text, nếu không thì để mảng rỗng
    if (text.trim()) {
      const filteredData = filteredDataRegion.filter(
        item =>
          item.title.toLowerCase().includes(text.toLowerCase()) ||
          item.address.toLowerCase().includes(text.toLowerCase()) ||
          item.description.toLowerCase().includes(text.toLowerCase()) ||
          item.region.toLowerCase().includes(text.toLowerCase()),
      );
      setData(filteredData);
    } else {
      setData([]); // Nếu không có text thì hiển thị mảng rỗng
    }
  };

  const handleDelete = useCallback(itemId => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa phòng trọ này?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
          onPress: () => {
            // Close the swipeable after canceling
            if (swipeableRefs.current[itemId]) {
              swipeableRefs.current[itemId].close();
            }
          },
        },
        {
          text: 'Xóa',
          onPress: () => {
            setData(prevData => prevData.filter(item => item.id !== itemId));
            // Clean up the ref
            delete swipeableRefs.current[itemId];
          },
        },
      ],
      {cancelable: false},
    );
  }, []);

  // Handle FlatList scroll to close swipeables
  const handleScroll = useCallback(() => {
    closeAllSwipeables();
  }, [closeAllSwipeables]);
  const currentLocationName =
    currentLocation?.parentNew || currentLocation?.parent;
  const handleLocationPress = useCallback(() => {
    navigation.navigate(NAVIGATION_NAME.CURRENT_ADDRESS_SCREEN);
  }, [navigation]);
  return (
    <GestureHandlerRootView style={styles.gestureContainer}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar backgroundColor={COLOR.WHITE} barStyle="dark-content" />

        {/* Custom Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate(NAVIGATION_NAME.HOME_SCREEN)}
            // hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          >
            <IconStyles
              iconSet="Feather"
              name={ICON_TYPE.ICON_ARROW_LEFT}
              color={COLOR.BLACK1}
              size={20}
            />
          </TouchableOpacity>

          <View style={styles.searchContainer}>
            <View style={styles.searchInputWrapper}>
              <IconStyles
                name={ICON_TYPE.SEARCH}
                color={COLOR.GRAY3}
                size={20}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm kiếm phòng trọ..."
                placeholderTextColor={COLOR.GRAY3}
                value={searchText}
                onChangeText={handleSearch}
                autoFocus={true}
                returnKeyType="search"
              />
              {searchText ? (
                <TouchableOpacity
                  onPress={() => handleSearch('')}
                  hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                  <IconStyles
                    name={ICON_TYPE.CLOSE}
                    color={COLOR.GRAY3}
                    size={18}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>
        {currentLocationName && (
          <TouchableOpacity
            onPress={handleLocationPress}
            style={styles.locationButton}
            activeOpacity={0.7}>
            <Text style={styles.locationText}>{currentLocationName}</Text>
            <IconStyles
              iconSet="MaterialIcons"
              name={ICON_TYPE.ICON_LOCATION}
              color={COLOR.PRIMARY}
              size={20}
            />
          </TouchableOpacity>
        )}
        <View style={styles.container}>
          <FlatList
            ref={flatListRef}
            data={data}
            renderItem={({item}) => (
              <ItemCard
                item={item}
                swipeableRefs={swipeableRefs}
                onPress={itm =>
                  navigation.navigate(NAVIGATION_NAME.ROOM_DETAIL_SCREEN, {
                    item: itm,
                  })
                }
                onDelete={handleDelete}
              />
            )}
            keyExtractor={item => item.id}
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
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  gestureContainer: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    // paddingVertical: 12,
    backgroundColor: COLOR.WHITE,
    // borderBottomWidth: 1,
    // borderBottomColor: COLOR.GRAY1,
    // elevation: 2,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 2,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  searchContainer: {
    flex: 1,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR.BACKGROUND,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 2,
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLOR.GRAY1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: COLOR.BLACK,
    fontFamily: 'Roboto-Regular',
  },
  container: {
    backgroundColor: COLOR.WHITE,
    flex: 1,
  },
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

  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderColor: COLOR.PRIMARY,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 10,
    backgroundColor: COLOR.WHITE,
    alignSelf: 'flex-start',
    elevation: 1, // Android shadow
    shadowColor: COLOR.BLACK1, // iOS shadow
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  locationText: {
    marginRight: 8,
    fontSize: 16,
    color: COLOR.BLACK1,
    fontWeight: '500',
  },
});
