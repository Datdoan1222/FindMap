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
  // Helper function to validate image URL
  const isValidImageUrl = url => {
    if (!url || typeof url !== 'string') return false;
    const trimmedUrl = url.trim();
    if (
      trimmedUrl === '' ||
      trimmedUrl === 'null' ||
      trimmedUrl === 'undefined'
    )
      return false;
    return (
      trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')
    );
  };
  const filteredDataRegion = useMemo(() => {
    const region = currentLocation?.parentNew || currentLocation?.parent;

    if (!region?.trim() || !sampleData) {
      return [];
    }

    return sampleData?.filter(item =>
      item.region?.toLowerCase().includes(region.toLowerCase()),
    );
  }, [currentLocation, sampleData]);
  // Format price helper
  const formatPrice = price => {
    if (!price) return 'Liên hệ';
    const numPrice = typeof price === 'string' ? parseInt(price) : price;
    if (numPrice >= 1000) {
      return `${(numPrice / 1000).toFixed(1)} triệu`;
    } else if (numPrice >= 1) {
      return `${(numPrice / 1).toFixed(0)}k`;
    }
    return `${numPrice}đ`;
  };

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

  const renderRightActions = (progress, dragX, item) => {
    const trans = dragX.interpolate({
      inputRange: [-100, -50, 0],
      outputRange: [0, 50, 100],
      extrapolate: 'clamp',
    });

    const scale = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    return (
      <View style={styles.rightActionsContainer}>
        <Animated.View
          style={[
            styles.rightActionWrapper,
            {
              transform: [{translateX: trans}, {scale}],
            },
          ]}>
          <TouchableOpacity
            style={styles.rightAction}
            onPress={() => handleDelete(item.id)}>
            <IconStyles name={ICON_TYPE.DELETE} color={COLOR.WHITE} size={20} />
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  const renderItem = ({item, index}) => {
    return (
      <Swipeable
        ref={ref => {
          if (ref) {
            swipeableRefs.current[item.id] = ref;
          }
        }}
        renderRightActions={(progress, dragX) =>
          renderRightActions(progress, dragX, item)
        }
        overshootRight={false}
        overshootLeft={false}
        friction={2}
        leftThreshold={30}
        rightThreshold={40}
        onSwipeableWillOpen={() => {
          // Close other swipeables when one is opened
          Object.keys(swipeableRefs.current).forEach(key => {
            if (key !== item.id && swipeableRefs.current[key]) {
              swipeableRefs.current[key].close();
            }
          });
        }}>
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() => {
            // Handle item press if needed
            console.log('Pressed item:', item.title);
            navigation.navigate(NAVIGATION_NAME.POST_DETAIL_SCREEN, {item});
          }}
          activeOpacity={0.8}>
          <RowComponent styles={styles.itemContent}>
            <View style={styles.imagePlaceholder}>
              {item.images &&
              item.images.length > 0 &&
              isValidImageUrl(item.images[0]) ? (
                <Image
                  source={{uri: item.images[0]}}
                  style={styles.itemImage}
                  resizeMode="cover"
                  onError={error => {
                    console.log(
                      'Image load error for item:',
                      item.id,
                      'URL:',
                      item.images[0],
                    );
                  }}
                />
              ) : (
                <View style={styles.defaultImage}>
                  <IconStyles
                    name={ICON_TYPE.HOME}
                    color={COLOR.GRAY2}
                    size={30}
                  />
                </View>
              )}
            </View>
            <Space width={10} />
            <RowComponent
              flexDirection="column"
              alignItems="flex-start"
              styles={styles.infoContainer}>
              <TextComponent
                text={item.title}
                font="Roboto-Bold"
                numberOfLines={1}
                size={16}
              />
              <Space height={4} />
              <TextComponent
                text={item.address}
                size={12}
                color={COLOR.GRAY3}
                numberOfLines={2}
              />
              <Space height={4} />
              <View style={styles.priceRow}>
                <TextComponent
                  text={formatPrice(item.price)}
                  font="Roboto-Bold"
                  color={COLOR.PRIMARY || '#E74C3C'}
                  size={14}
                />
                {item.status ? (
                  <View style={styles.statusBadge}>
                    <TextComponent
                      text="Còn trống"
                      size={10}
                      color={COLOR.WHITE}
                      font="Roboto-Medium"
                    />
                  </View>
                ) : (
                  <View
                    style={[
                      styles.statusBadge,
                      {backgroundColor: COLOR.GRAY4},
                    ]}>
                    <TextComponent
                      text="Đã thuê"
                      size={10}
                      color={COLOR.WHITE}
                      font="Roboto-Medium"
                    />
                  </View>
                )}
              </View>
            </RowComponent>
          </RowComponent>
        </TouchableOpacity>
      </Swipeable>
    );
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
            renderItem={renderItem}
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
  itemContainer: {
    backgroundColor: COLOR.BACKGROUND,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  itemContent: {
    padding: 16,
    alignItems: 'flex-start',
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  defaultImage: {
    width: '100%',
    height: '100%',
    backgroundColor: COLOR.GRAY1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  infoContainer: {
    flex: 1,
    height: 80,
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  statusBadge: {
    backgroundColor: '#2ECC71',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 40,
  },
  rightActionsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 20,
  },
  rightActionWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightAction: {
    backgroundColor: COLOR.FAIL,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
