import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
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

MapLibreGL.setAccessToken(null); // Không cần token

const styleURL = 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json'; // Đường dẫn đến style JSON của tile server

const DEFAULT_REGION = {
  latitude: 21.0285,
  longitude: 105.8542,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const MapLibreScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {width, height} = useWindowDimensions();

  const [currentLocation, setCurrentLocation] = useState(null); // Hoặc giá trị khởi tạo phù hợp
  const [checkAddress, setCheckAddress] = useState(true); // Hoặc giá trị khởi tạo phù hợp
  const [openModalMarker, setOpenModalMarker] = useState(false); // Hoặc giá trị khởi tạo phù hợp

  // Redux state
  const ownersData = useSelector(state => state.ownersData.owners);
  const loading = useSelector(state => state.ownersData.loading);
  const error = useSelector(state => state.ownersData.error);

  const [isCarouselVisible, setIsCarouselVisible] = useState(false);
  const [currentRegion, setCurrentRegion] = useState({
    ...DEFAULT_REGION,
    // Adjust delta based on initial screen dimensions
    longitudeDelta: DEFAULT_REGION.longitudeDelta * (width / height),
  });
  const [zoomLevel, setZoomLevel] = useState(12);

  // Refs
  const mapRef = useRef(null);
  const camera = useRef(null);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false; // khi unmount
    };
  }, []);
  // Update zoom level based on region changes
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
    // navigation.navigate(NAVIGATION_NAME.DETAIL_SCREEN, {ownerId: item.id});
    {
      /* Conditionally render markers based on zoom level */
    }
    console.log('item', item);
  };
  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchOwners());
  }, [dispatch]);

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

  console.log('✅✅✅✅✅', ownersData[0].locationOwner.latitude);
  return (
    <View style={styles.page}>
      <MapLibreGL.MapView
        projection="globe"
        zoomEnabled={true}
        style={styles.map}
        mapStyle={styleURL}>
        <MapLibreGL.Camera
          ref={camera}
          zoomLevel={zoomLevel}
          centerCoordinate={[106.842786, 10.956216]}
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
        {ownersData?.map(owner => (
          <MapLibreGL.PointAnnotation
            key={owner.id.toString()}
            id={owner.id.toString()}
            coordinate={[
              owner?.locationOwner?.longitude
                ? owner?.locationOwner?.longitude
                : 0,
              owner?.locationOwner?.latitude
                ? owner?.locationOwner?.latitude
                : 0,
            ]}
            onSelected={() => {
              console.log('Marker được click:', owner.id);
              // Bạn có thể mở modal, callout, hoặc điều hướng sang màn hình chi tiết...

              if (isMounted.current && camera.current) {
                camera.current?.setCamera({
                  centerCoordinate: [
                    owner.locationOwner.longitude,
                    owner.locationOwner.latitude + 0.004,
                  ],
                  zoomLevel: 15, // zoom gần hơn
                  animationDuration: 1000, // thời gian di chuyển
                });
              }
              setOpenModalMarker(true);
            }}>
            <IconStyles
              iconSet="MaterialIcons"
              name="location-on"
              color={COLOR.PRIMARY}
              size={25}
            />
          </MapLibreGL.PointAnnotation>
        ))}
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
        {isCarouselVisible && ownersData && ownersData.length > 0 && (
          <Carousel
            // Use ownersData instead of static DATA
            data={ownersData}
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
            // Use item.id or index as key
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.carouselItemContainer}
                onPress={() => navigateToDetail(item)} // Navigate on item press
                activeOpacity={0.8} // Feedback on touch
              >
                <View style={styles.carouselItemContent}>
                  {/* Example Content: Image */}
                  {item.imageOwner ? (
                    <Image
                      source={{uri: item.imageOwner}}
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
                    <Text style={styles.itemTitle} numberOfLines={1}>
                      {item.nameOwner || 'Unnamed Location'}
                    </Text>
                    <Text style={styles.itemSubtitle} numberOfLines={1}>
                      {item.address || 'No address'}
                    </Text>
                    {/* Add more details like distance, rating, etc. */}
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
        {/* Show message if carousel is visible but no data */}
        {isCarouselVisible && (!ownersData || ownersData.length === 0) && (
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
});

export default MapLibreScreen;
