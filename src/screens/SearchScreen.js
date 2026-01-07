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
  ScrollView,
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
import {useFetchSearchData} from '../hooks/useFetchSearchData ';
import {usePosts} from '../hooks/usePost';
import {TYPE} from '../constants/assetsConstants';
import {useSearch} from '../hooks/useSearch';
import {convertToK} from '../utill/convertToK';

// Use your actual rooms data
const price = [
  {min: 500000, max: 1000000},
  {min: 1000000, max: 2000000},
  {min: 2000000, max: 3000000},
  {min: 3000000, max: 30000000},
];
const SearchScreen = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]); // Bắt đầu với mảng rỗng
  const [searchText, setSearchText] = useState('');
  const screenWidth = Dimensions.get('window').width;
  const flatListRef = useRef(null);
  const swipeableRefs = useRef({});
  const {currentLocation} = userStore();
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [priceMin, setPriceMin] = useState(false);
  const [priceMax, setPriceMax] = useState(false);
  const region = currentLocation?.parentNew || currentLocation?.parent;
  const {data: searchResults, isLoading} = useSearch({
    query: searchText.trim() || undefined,
    region: region || undefined,
    price_min: priceMin,
    // price_max: priceMax,
  });
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
  }, [currentLocation, priceMin, priceMax]);

  const handleSearch = text => {
    setSearchText(text);
  };

  // Handle FlatList scroll to close swipeables
  const handleScroll = useCallback(() => {
    closeAllSwipeables();
  }, [closeAllSwipeables]);
  const currentLocationName =
    currentLocation?.parentNew || currentLocation?.parent;
  const handleLocationPress = useCallback(() => {
    navigation.navigate(NAVIGATION_NAME.CURRENT_ADDRESS_SCREEN);
  }, [navigation]);

  // select Price
  const handleSelectPrice = price => {
    setShowOptions(prev => !prev);
  };
  const handlePricePress = async price => {
    setSelectedPrice(price);
    setPriceMin(price?.min);
    setPriceMax(price?.max);
    setShowOptions(prev => !prev);
  };
  const displayedData = searchResults ?? [];

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
        <RowComponent justify="space-between" styles={{paddingHorizontal: 10}}>
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
          <RowComponent
            flexDirection="row"
            justify="flex-end"
            styles={{flex: 1, width: '100%'}}>
            <TouchableOpacity
              style={styles.selectPriceButton}
              onPress={handleSelectPrice}>
              <RowComponent>
                <TextComponent
                  text={
                    selectedPrice
                      ? `≥ ${convertToK(selectedPrice.min)}`
                      : 'Chọn mức giá'
                  }
                  color={COLOR.GREY_400}
                  flex={1}
                />
                <TextComponent
                  text={
                    <IconStyles
                      iconSet="Entypo"
                      name={showOptions ? 'chevron-down' : 'chevron-up'}
                      size={20}
                      color={COLOR.GREY_400}
                    />
                  }
                />
              </RowComponent>
            </TouchableOpacity>
            <TouchableOpacity
              key={`${price.min}-${price.max}`}
              style={styles.price}
              onPress={() => setSelectedPrice(null)}>
              <IconStyles iconSet="Feather" name={'delete'} size={20} />
            </TouchableOpacity>
          </RowComponent>
          {showOptions && (
            <ScrollView style={styles.optionsContainer}>
              {price?.map((price, index) => (
                <TouchableOpacity
                  key={`${price.min}-${price.max}`}
                  style={styles.price}
                  onPress={() => handlePricePress(price)}>
                  <RowComponent>
                    <TextComponent
                      text={`≥ ${convertToK(price.min)}`}
                      color={COLOR.BLACK1}
                      flex={1}
                    />
                  </RowComponent>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </RowComponent>
        <View style={styles.container}>
          {isLoading ? (
            <View style={styles.emptyContainer}>
              <TextComponent text="Đang tải kết quả..." color={COLOR.GRAY4} />
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={displayedData}
              keyExtractor={item => item._id}
              renderItem={({item}) => (
                <ItemCard
                  item={item}
                  swipeEnabled={false}
                  swipeableRefs={swipeableRefs}
                  onPress={() =>
                    navigation.navigate(NAVIGATION_NAME.ROOM_DETAIL_SCREEN, {
                      id: item.room_id,
                      type: TYPE.LOOK,
                    })
                  }
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
          )}
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
  // select price
  selectPriceButton: {
    padding: 10,
    borderColor: COLOR.GREY_400,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    width: '70%',
  },
  optionsContainer: {
    width: '60%',
    maxHeight: 200,
    marginHorizontal: 10,
    marginBottom: 10,
    padding: 10,
    position: 'absolute',
    top: 60, // tuỳ chỉnh chỗ bạn muốn nó xuất hiện
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    zIndex: 999, // giúp nó nổi lên trên
    elevation: 5, // Android cần elevation để hiển thị shadow + overlay
  },
  price: {
    padding: 10,
    borderColor: COLOR.GREY_100,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: COLOR.WHITE,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonContainer: {
    marginTop: 20,
  },
});
