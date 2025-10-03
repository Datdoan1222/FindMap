import {
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  View,
  Image,
  TouchableOpacity,
  Text,
  RefreshControl,
  FlatList,
  Alert,
} from 'react-native';
import React, {useCallback, useEffect, useState, useMemo} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

import Space from '../../component/atoms/Space';
import Banner from '../../component/atoms/Banner';
import RowComponent from '../../component/atoms/RowComponent';
import TextComponent from '../../component/atoms/TextComponent';
import HeaderComponent from '../../component/molecules/HeaderComponent';
import ExploreComponent from '../../component/molecules/ExploreComponent';

import {postsAPI} from '../../utill/api/apiPost';
import {fetchPosts} from '../../redux/postsSlide';
import {COLOR} from '../../constants/colorConstants';
import {NAVIGATION_NAME} from '../../constants/navigtionConstants';
import IconStyles from '../../constants/IconStyle';
import {ICON_TYPE} from '../../constants/iconConstants';
import userStore from '../../store/userStore';
import {useCurrentAddress} from '../../hooks/useGetCurrentAddress';
import Geolocation from 'react-native-geolocation-service';
import {usePosts} from '../../hooks/usePost';
import {ROLE, TYPE} from '../../constants/assetsConstants';
import {ro} from 'date-fns/locale';
import {useUser} from '../../hooks/useGetInforUser';
import {USER_ID} from '../../constants/envConstants';

const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {getCurrentAddress} = useCurrentAddress();
  const {currentLocation} = userStore();
  const [refreshing, setRefreshing] = useState(false);

  const {posts, error, loading} = useSelector(state => state.posts);
  const {data: dataPosts} = usePosts();
  const {
    data: dataUser,
    isLoading: isLoadingUser,
    error: errorUser,
  } = useUser(USER_ID);
  // Category configuration for better maintainability
  const CATEGORIES = [
    {
      id: 'my_room',
      title: 'Phòng tôi',
      image: require('../../assets/images/categories_my_room.png'),
      navigation: NAVIGATION_NAME.MY_ROOM_SCREEN,
      params: postsAPI => ({item: postsAPI[0]}),
    },
    {
      id: 'favourite',
      title: 'Yêu thích',
      image: require('../../assets/images/categories_heart.png'),
      navigation: NAVIGATION_NAME.FAVOURITE_SCREEN,
      params: postsAPI => ({item: postsAPI}),
    },
    {
      id: 'register_room',
      title: 'Quản lý phòng',
      image: require('../../assets/images/categories_register_room.png'),
      navigation: NAVIGATION_NAME.MANAGER_ROOM_SCREEN,
      params: () => ({}),
    },
    {
      id: 'room_sharing',
      title: 'Ghép phòng',
      image: require('../../assets/images/categories_add_person.png'),
      navigation: NAVIGATION_NAME.ROOM_SHARING_STACK,
      params: () => ({screen: NAVIGATION_NAME.ROOM_SHARING_SCREEN}),
    },
  ];
  // Memoized filtered data based on current location
  const filteredData = useMemo(() => {
    const region = currentLocation?.parentNew || currentLocation?.parent;

    if (!region?.trim() || !dataPosts) {
      return [];
    }

    return dataPosts.filter(item =>
      item.region?.toLowerCase().includes(region.toLowerCase()),
    );
  }, [currentLocation, dataPosts]);

  // Memoized column distribution for masonry layout
  const {leftColumn, rightColumn} = useMemo(() => {
    const left = [];
    const right = [];

    filteredData.forEach((item, index) => {
      if (index % 2 === 0) {
        left.push(item);
      } else {
        right.push(item);
      }
    });

    return {leftColumn: left, rightColumn: right};
  }, [filteredData]);

  // Fetch posts on screen focus
  useFocusEffect(
    useCallback(() => {
      dispatch(fetchPosts());
    }, [dispatch]),
  );

  // Pull to refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchPosts());
    } catch (error) {
      console.log('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  // Navigation handlers
  const handleSearch = useCallback(() => {
    navigation.navigate(NAVIGATION_NAME.SEARCH_SCREEN);
  }, [navigation]);

  const handleFavourites = useCallback(() => {
    navigation.navigate(NAVIGATION_NAME.FAVOURITE_SCREEN, {
      item: postsAPI,
    });
  }, [navigation]);

  const handleSelectImg = useCallback(
    item => {
      navigation.navigate(NAVIGATION_NAME.ROOM_DETAIL_SCREEN, {
        id: item?.room_id,
        type: TYPE.LOOK,
        // role: dataUser.role || ROLE.USER,
      });
    },
    [navigation],
  );

  const handleBannerPress = useCallback(
    item => {
      console.log('Banner pressed:', item);
      navigation.navigate(NAVIGATION_NAME.ROOM_DETAIL_SCREEN, {item});
    },
    [navigation],
  );

  const handleCategoryPress = useCallback(
    category => {
      const params = category.params(postsAPI);
      navigation.navigate(category.navigation, params);
    },
    [navigation],
  );

  const handleLocationPress = useCallback(() => {
    navigation.navigate(NAVIGATION_NAME.CURRENT_ADDRESS_SCREEN);
  }, [navigation]);

  // Handlers
  const handleGetCurrentAddress = async () => {
    Geolocation.getCurrentPosition(
      async position => {
        const geo = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };

        camera.current?.setCamera({
          centerCoordinate: [geo.lon, geo.lat],
          zoomLevel: 16,
          animationDuration: 1000,
        });

        setLocationState(currentLocation);
      },
      error => {
        Alert.alert('Không thể lấy vị trí hiện tại', 'Vui lòng thử lại sau.');
      },
      {
        enableHighAccuracy: true,
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        timeout: 10000,
        maximumAge: 5000,
      },
    );
  };
  // Render category item
  const renderCategoryItem = useCallback(
    ({item: category}) => (
      <TouchableOpacity
        key={category.id}
        onPress={() => handleCategoryPress(category)}
        style={styles.itemCategory}
        activeOpacity={0.7}>
        <Image style={styles.iconImage} source={category.image} />
        <TextComponent size={13} text={category.title} />
      </TouchableOpacity>
    ),
    [handleCategoryPress],
  );

  // Render explore column
  const renderColumn = useCallback(
    (data, columnKey) => (
      <View key={columnKey} style={styles.column}>
        {data.map((item, index) => (
          <ExploreComponent
            key={`${item.id}-${columnKey}-${index}`}
            itemKey={`${item.nameLocation}-${index}`}
            item={item}
            handleSelectImg={handleSelectImg}
          />
        ))}
      </View>
    ),
    [handleSelectImg],
  );

  // Loading/Error state
  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLOR.PRIMARY} />
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <TextComponent
          text="Đã xảy ra lỗi khi tải dữ liệu"
          color={COLOR.ERROR || COLOR.BLACK1}
        />
        <TouchableOpacity onPress={onRefresh} style={styles.retryButton}>
          <TextComponent text="Thử lại" color={COLOR.PRIMARY} />
        </TouchableOpacity>
      </View>
    );
  }

  const currentLocationName =
    currentLocation?.parentNew || currentLocation?.parent;

  return (
    <SafeAreaView style={styles.container}>
      <HeaderComponent
        title="PHONG TRO"
        onPressRight={handleSearch}
        onPressLeft={handleFavourites}
        iconLeft="heart-outline"
        iconRight="search"
        masterScreen={true}
      />

      <ScrollView
        style={styles.feed}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}>
        {/* Banner Section */}
        {postsAPI && <Banner data={postsAPI} onPress={handleBannerPress} />}

        <Space height={20} />

        {/* Categories Section */}
        <FlatList
          data={CATEGORIES}
          renderItem={renderCategoryItem}
          keyExtractor={item => item.id}
          horizontal={false}
          numColumns={4}
          scrollEnabled={false}
          contentContainerStyle={styles.categoriesContainer}
        />

        <Space height={20} />

        {/* Explore Section Header */}
        <TextComponent size={18} text="Khám phá" />
        <Space height={10} />

        {/* Current Location Button */}
        {/* {currentLocationName && ( */}
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
        {/* )} */}

        {/* Masonry Layout */}
        {filteredData.length > 0 ? (
          <View style={styles.masonryContainer}>
            {renderColumn(leftColumn, 'left')}
            {renderColumn(rightColumn, 'right')}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <TextComponent
              text="Không có phòng trọ nào trong khu vực này"
              color={COLOR.GRAY4 || COLOR.BLACK1}
              style={styles.emptyText}
            />
          </View>
        )}

        <Space height={100} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.WHITE,
    flex: 1,
    paddingHorizontal: 10,
  },
  feed: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.WHITE,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.WHITE,
    paddingHorizontal: 20,
  },
  retryButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLOR.PRIMARY,
    borderRadius: 8,
  },
  categoriesContainer: {
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  itemCategory: {
    flex: 1,
    height: 70,
    padding: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  iconImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderColor: COLOR.PRIMARY,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 8,
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
  masonryContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    width: '48%',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default HomeScreen;
