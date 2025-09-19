import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {fetchOwners} from '../../redux/ownersSlide';
import IconStyles from '../../constants/IconStyle';
import {COLOR} from '../../constants/colorConstants';
import RowComponent from '../../component/atoms/RowComponent';
import ButtonIcon from '../../component/atoms/ButtonIcon';
import {ICON_TYPE} from '../../constants/iconConstants';
import Carousel from 'react-native-reanimated-carousel';
import Modal from '../../component/molecules/Modal';
import HeaderComponent from '../../component/molecules/HeaderComponent';
import {NAVIGATION_NAME} from '../../constants/navigtionConstants';

MapLibreGL.setAccessToken(null); // Không cần token
const MAP_KEY = '0hyraZS89g2JoCWS27jO4A3oxLxztWJ4ayKnigsv';
const styleURL = `https://tiles.goong.io/assets/goong_map_web.json?api_key=${MAP_KEY}`;

const DEFAULT_REGION = {
  latitude: 21.0285,
  longitude: 105.8542,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};
const {width, height} = Dimensions.get('window');
const MapLibreScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {width, height} = useWindowDimensions();
  const [textSearch, setTextSearch] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentLocation, setCurrentLocation] = useState(null); // Hoặc giá trị khởi tạo phù hợp
  const [checkAddress, setCheckAddress] = useState(true); // Hoặc giá trị khởi tạo phù hợp
  const [selectedPost, setSelectedPost] = useState(null);
  const [latCamera, setLatCamera] = useState(10.9530222);
  const [lngCamera, setLngCamera] = useState(106.8022549);
  const [openModalMarker, setOpenModalMarker] = useState(false);
  // Redux state
  const {posts, error, loading} = useSelector(state => state.posts);
  const [filteredPosts, setFilteredPosts] = useState(posts);
  console.log(posts);
  const [isCarouselVisible, setIsCarouselVisible] = useState(false);
  const [currentRegion, setCurrentRegion] = useState({
    ...DEFAULT_REGION,
    longitudeDelta: DEFAULT_REGION.longitudeDelta * (width / height),
  });
  const [zoomLevel, setZoomLevel] = useState(12);
  const [initialCoordinate, setInitialCoordinate] = useState(
    posts[0]?.location
      ? [posts[0].location.lng, posts[0].location.lat]
      : [106.8022549, 10.9530222],
  );
  // Refs
  const mapRef = useRef(null);
  const camera = useRef(null);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false; // khi unmount
    };
  }, []);
  const handleRegionChangeComplete = useCallback(
    region => {
      setCurrentRegion(region); // Keep track of the current region
      const calculatedZoom =
        Math.log2(360 * (width / 256 / region.longitudeDelta)) + 1;
      setZoomLevel(calculatedZoom);
      console.log('Region:', region, 'Calculated Zoom:', calculatedZoom);
    },
    [width], // Recreate callback if width changes
  );

  // Toggle carousel visibility
  const toggleCarousel = () => {
    setIsCarouselVisible(prev => !prev);
  };

  // Navigate to detail screen
  const navigateToDetail = item => {
    navigation.navigate(NAVIGATION_NAME.MAIN_SCREEN, {
      screen: NAVIGATION_NAME.ROOM_DETAIL_SCREEN,
      params: {item: item},
    });
    // {
    //   /* Conditionally render markers based on zoom level */
    // }
    console.log('item', item);
  };
  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchOwners());
  }, [dispatch]);

  useEffect(() => {
    if (textSearch.trim() === '') {
      setFilteredPosts([]);
    } else {
      const lowerText = textSearch.toLowerCase();
      const filtered = posts.filter(item =>
        item.name?.toLowerCase().includes(lowerText),
      );
      setFilteredPosts(filtered);
    }
  }, [textSearch]);

  const onSelectSuggestion = item => {
    setFilteredPosts([]);
    setIsCarouselVisible(prev => !prev);
    setTextSearch(item.name);
  };
  // Render Loading Indicator
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLOR.PRIMARY} />
      </View>
    );
  }

  // Render Error Message
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Failed to load data: {error}</Text>
        {/* Optionally add a retry button */}
      </View>
    );
  }

  // console.log('✅✅✅✅✅', ownersData[0].locationOwner.latitude);
  return (
    <View style={styles.page}>
      {/* modal */}
      <Modal visible={openModalMarker} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: '85%',
              padding: 20,
              backgroundColor: 'white',
              borderRadius: 10,
            }}>
            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>
              {selectedPost?.title}
            </Text>
            <Text>Mô tả: {selectedPost?.description ?? 'Không có mô tả'}</Text>
            <Text>
              Vị trí: {selectedPost?.location?.lat},{' '}
              {selectedPost?.location?.lng}
            </Text>

            <TouchableOpacity
              onPress={() => setOpenModalMarker(false)}
              style={{
                marginTop: 20,
                alignSelf: 'flex-end',
                padding: 10,
                backgroundColor: COLOR.PRIMARY,
                borderRadius: 5,
              }}>
              <Text style={{color: 'white'}}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.containerSreach}>
        <TextInput
          style={styles.inputSearch}
          placeholder="Tìm kiếm phòng trọ nào"
          value={textSearch}
          onChangeText={setTextSearch}
        />
        <ButtonIcon name={'search'} color={COLOR.WHITE} size={30} />
      </View>
      {filteredPosts.length > 0 && (
        <View style={styles.suggestionList}>
          <FlatList
            data={filteredPosts}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => onSelectSuggestion(item)}>
                <Text style={{color: COLOR.BLACK1, fontWeight: 'bold'}}>
                  <IconStyles
                    iconSet="MaterialIcons"
                    name="location-on"
                    color={COLOR.ERROR}
                    size={15}
                  />
                  {item.name}
                </Text>
                <Text style={{color: COLOR.GRAY, fontStyle: 'italic'}}>
                  {item.nameLocation}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
      <MapLibreGL.MapView
        projection="globe"
        zoomEnabled={true}
        style={styles.map}
        onRegionDidChange={event => {
          const {zoomLevel, center} = event.properties;
          setZoomLevel(zoomLevel);
          console.log('Zoom hiện tại:', zoomLevel);
          console.log('Tọa độ center:', center);
        }}
        mapStyle={`https://tiles.goong.io/assets/goong_map_web.json?api_key=${MAP_KEY}`}>
        <MapLibreGL.Camera
          ref={camera}
          zoomLevel={17}
          centerCoordinate={initialCoordinate}
        />
        <MapLibreGL.PointAnnotation
          id="marker1"
          coordinate={[106.842786, 10.956216]}>
          <IconStyles
            iconSet="MaterialIcons"
            name="my-location"
            color={COLOR.PRIMARY}
            size={25}
          />
        </MapLibreGL.PointAnnotation>
        {posts?.map(owner => {
          const lat = owner?.location?.lat ?? 0;
          const lng = owner?.location?.lng ?? 0;
          return (
            <MapLibreGL.PointAnnotation
              key={owner.id.toString()}
              id={owner.id.toString()}
              coordinate={[lng, lat]}
              onSelected={() => {
                console.log('Marker được click:', owner.id);
                if (isMounted.current && camera.current) {
                  camera.current?.setCamera({
                    centerCoordinate: [lng, lat + 0.004],
                    zoomLevel: 15,
                    animationDuration: 1000,
                  });
                }
                setIsCarouselVisible(prev => !prev);
              }}>
              <View
                style={{
                  alignItems: 'center',
                  // backgroundColor: 'red',
                }}>
                <Text
                  style={{fontSize: 12, fontWeight: 'bold', color: 'black'}}>
                  {owner.name && zoomLevel > 13 ? owner.name : ''}
                </Text>
                <IconStyles
                  iconSet="MaterialIcons"
                  name="location-on"
                  color={COLOR.ERROR}
                  size={30}
                />
              </View>

              {/* Icon marker */}
            </MapLibreGL.PointAnnotation>
          );
        })}
      </MapLibreGL.MapView>
      <View style={styles.bottomContainer}>
        {/* Toggle Button */}
        <RowComponent styles={styles.toggleButtonContainer}>
          <ButtonIcon
            iconSet="MaterialIcons"
            name={
              isCarouselVisible
                ? ICON_TYPE.MUI_TEM_XUONG
                : ICON_TYPE.MUI_TEN_LEN
            }
            size={30}
            color={COLOR.PRIMARY}
            onPress={toggleCarousel}
          />
        </RowComponent>

        {/* Carousel */}
        {isCarouselVisible && posts && posts.length > 0 && (
          <Carousel
            // Use ownersData instead of static DATA
            data={posts}
            loop={false}
            width={width}
            height={width / 2.5}
            autoPlay={false}
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 0.9,
              parallaxScrollingOffset: 50,
            }}
            scrollAnimationDuration={800}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.carouselItemContainer}
                onPress={() => navigateToDetail(item)} // Navigate on item press
                activeOpacity={0.8} // Feedback on touch
              >
                <View style={styles.carouselItemContent}>
                  {/* Example Content: Image */}
                  {item.images[0] ? (
                    <Image
                      source={{uri: item.images[0]}}
                      style={styles.itemImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[styles.itemImage, styles.placeholderImage]}>
                      <IconStyles
                        name="image-off"
                        iconSet="MaterialCommunityIcons"
                        size={40}
                        color={COLOR.GRAY3}
                      />
                    </View>
                  )}
                  {/* Example Content: Text */}
                  <View style={styles.itemTextContainer}>
                    <RowComponent
                      flexDirection="row"
                      alignItems="center"
                      justify="space-between">
                      <Text style={styles.itemTitle} numberOfLines={1}>
                        {item.name || 'Unnamed Location'}
                      </Text>
                      <Text
                        style={[styles.itemSubtitle, {color: COLOR.SUCCESSFUL}]}
                        numberOfLines={1}>
                        {`${item.price}.000 VND` || 'Unnamed Location'}
                      </Text>
                    </RowComponent>
                    <Text style={styles.itemSubtitle} numberOfLines={1}>
                      {item.nameLocation || 'No address'}
                    </Text>
                    {/* Add more details like distance, rating, etc. */}
                  </View>
                </View>
              </TouchableOpacity>
            )}
            onSnapToItem={index => {
              setCurrentIndex(index); // Cập nhật index đang hiển thị
              console.log('Đang hiển thị item:', posts[index]);
              const lat = posts[index]?.location?.lat ?? 0;
              const lng = posts[index]?.location?.lng ?? 0;

              if (lat && lng && camera.current) {
                camera.current.setCamera({
                  centerCoordinate: [lng, lat],
                  zoomLevel: 17,
                  animationDuration: 1000,
                });
              }
            }}
          />
        )}
        {/* Show message if carousel is visible but no data */}
        {isCarouselVisible && (!posts || posts.length === 0) && (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No locations found.</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {flex: 1},
  map: {flex: 1},
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.BACKGROUND,
  },
  errorText: {
    color: COLOR.ERROR,
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0, // Adjust bottom spacing as needed (e.g., for safe areas)
    left: 0,
    right: 0,
    alignItems: 'center', // Center toggle button horizontally
  },
  toggleButtonContainer: {
    // Add some style to the button container if needed
    marginBottom: 5, // Space between button and carousel
    backgroundColor: COLOR.WHITE,
    borderRadius: 30, // Make it circular
    padding: 5,
    elevation: 4, // Add shadow
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  // Carousel Styles
  carouselItemContainer: {
    backgroundColor: COLOR.WHITE,
    borderRadius: 15,
    height: '95%', // Use percentage or calculated height
    // width: width - 40, // Adjust width for padding/margin effect
    marginLeft: 20, // Center the item by adjusting margins
    marginRight: 20,
    overflow: 'hidden', // Clip content like image corners
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginBottom: 10, // Space at the bottom
  },
  carouselItemContent: {
    flex: 1, // Allow content to fill container
    // flexDirection: 'row', // Arrange image and text side-by-side if desired
  },
  itemImage: {
    height: '65%', // Allocate space for the image
    width: '100%',
    backgroundColor: COLOR.GRAY1, // Placeholder background
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTextContainer: {
    flex: 1, // Take remaining space
    padding: 10,
    justifyContent: 'center', // Center text vertically
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLOR.TEXT,
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: COLOR.GRAY4,
  },
  noDataContainer: {
    height: 100, // Give it some height
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  noDataText: {
    color: COLOR.GRAY4,
    fontSize: 16,
  },
  // Optional Callout Styles
  calloutView: {
    padding: 10,
    minWidth: 150, // Ensure callout has some width
  },
  calloutTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  containerSreach: {
    backgroundColor: COLOR.PRIMARY,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    width: '100%',
  },
  inputSearch: {
    borderWidth: 1,
    borderColor: COLOR.GRAY1,
    borderRadius: 15,
    padding: 10,
    margin: 10,
    backgroundColor: COLOR.WHITE,
    width: '85%',
  },
  suggestionList: {
    padding: 10,
    backgroundColor: COLOR.WHITE,
    height: height * 0.3,
  },
  suggestionItem: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: '100%',
    color: COLOR.BLACK1,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.GRAY1,
  },
});

export default MapLibreScreen;
