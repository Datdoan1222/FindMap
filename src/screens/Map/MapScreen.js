// import React, {useEffect, useRef, useState, useCallback} from 'react';
// import {
//   StyleSheet,
//   View,
//   ActivityIndicator,
//   useWindowDimensions,
//   Platform,
//   TouchableOpacity,
//   Text,
//   Image,
// } from 'react-native';
// import MapView, {Marker, MapMarker, PROVIDER_GOOGLE} from 'react-native-maps';
// import {useDispatch, useSelector} from 'react-redux';
// import {useNavigation} from '@react-navigation/native';
// import Carousel from 'react-native-reanimated-carousel';

// // Constants
// import {hasLocationPermission} from '../../utill/hasLocationPermission';
// import {styles_map} from '../../constants/mapStyle';
// import {fetchOwners} from '../../redux/ownersSlide';
// import {COLOR} from '../../constants/colorConstants';
// import {ICON_TYPE} from '../../constants/iconConstants';
// import {NAVIGATION_NAME} from '../../constants/navigtionConstants';

// // Components
// import RowComponent from '../../component/atoms/RowComponent';
// import ButtonIcon from '../../component/atoms/ButtonIcon';
// import IconStyles from '../../constants/IconStyle';

// // Default Region (Example: Centered on a specific area if needed)
// const DEFAULT_REGION = {
//   latitude: 21.0285,
//   longitude: 105.8542,
//   latitudeDelta: 0.05,
//   longitudeDelta: 0.05,
// };

// // Zoom level threshold for showing markers
// const MARKER_VISIBILITY_ZOOM_THRESHOLD = 12;

// const MapScreen = () => {
//   const navigation = useNavigation();
//   const dispatch = useDispatch();
//   const {width, height} = useWindowDimensions();

//   const [currentLocation, setCurrentLocation] = useState(null); // Hoặc giá trị khởi tạo phù hợp
//   const [checkAddress, setCheckAddress] = useState(true); // Hoặc giá trị khởi tạo phù hợp

//   // Redux state
//   const ownersData = useSelector(state => state.owners.owners);
//   const loading = useSelector(state => state.owners.loading);
//   const error = useSelector(state => state.owners.error);

//   // Component state
//   const [isCarouselVisible, setIsCarouselVisible] = useState(false);
//   const [currentRegion, setCurrentRegion] = useState({
//     ...DEFAULT_REGION,
//     // Adjust delta based on initial screen dimensions
//     longitudeDelta: DEFAULT_REGION.longitudeDelta * (width / height),
//   });
//   const [zoomLevel, setZoomLevel] = useState(10);

//   // Refs
//   const mapRef = useRef(null);

//   // Fetch data on mount
//   useEffect(() => {
//     dispatch(fetchOwners());
//   }, [dispatch]);

//   // Update zoom level based on region changes
//   const handleRegionChangeComplete = useCallback(
//     region => {
//       setCurrentRegion(region); // Keep track of the current region
//       const calculatedZoom =
//         Math.log2(360 * (width / 256 / region.longitudeDelta)) + 1;
//       setZoomLevel(calculatedZoom);
//       console.log('Region:', region, 'Calculated Zoom:', calculatedZoom);
//     },
//     [width], // Recreate callback if width changes
//   );

//   // Toggle carousel visibility
//   const toggleCarousel = () => {
//     setIsCarouselVisible(prev => !prev);
//   };

//   // Navigate to detail screen
//   const navigateToDetail = item => {
//     // navigation.navigate(NAVIGATION_NAME.DETAIL_SCREEN, {ownerId: item.id});
//     {
//       /* Conditionally render markers based on zoom level */
//     }
//     console.log('item', item);
//   };

//   // Render Loading Indicator
//   if (loading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color={COLOR.PRIMARY} />
//       </View>
//     );
//   }

//   // Render Error Message
//   if (error) {
//     return (
//       <View style={styles.centered}>
//         <Text style={styles.errorText}>Failed to load data: {error}</Text>
//         {/* Optionally add a retry button */}
//       </View>
//     );
//   }
//   console.log('✅✅✅✅✅', ownersData);

//   // Render Map and Carousel
//   return (
//     <View style={styles.container}>
//       <MapView
//         ref={mapRef}
//         // provider={PROVIDER_GOOGLE}
//         style={styles.map}
//         initialRegion={currentRegion} // Use initialRegion for first load
//         customMapStyle={styles_map}
//         onRegionChangeComplete={handleRegionChangeComplete}
//         showsUserLocation={true}
//         showsMyLocationButton={true} // Consider adding a button to center on user
//       >
//         {ownersData?.map(owner => (
//           <MapMarker
//             key={owner.id}
//             coordinate={{latitude: 10.965149, longitude: 106.787681}}
//             title={owner.nameOwner || 'No Name'}
//             description={owner.address || 'No Address'}
//           />
//         ))}
//       </MapView>

//       {/* Bottom Section for Carousel Toggle and Carousel */}
//       <View style={styles.bottomContainer}>
//         {/* Toggle Button */}
//         <RowComponent styles={styles.toggleButtonContainer}>
//           <ButtonIcon
//             iconSet="MaterialIcons"
//             name={
//               isCarouselVisible
//                 ? ICON_TYPE.MUI_TEM_XUONG
//                 : ICON_TYPE.MUI_TEN_LEN
//             }
//             size={30}
//             color={COLOR.PRIMARY}
//             onPress={toggleCarousel}
//           />
//         </RowComponent>

//         {/* Carousel */}
//         {isCarouselVisible && ownersData && ownersData.length > 0 && (
//           <Carousel
//             // Use ownersData instead of static DATA
//             data={ownersData}
//             loop={false}
//             width={width}
//             height={width / 2.5}
//             autoPlay={false}
//             mode="parallax"
//             modeConfig={{
//               parallaxScrollingScale: 0.9,
//               parallaxScrollingOffset: 50,
//             }}
//             scrollAnimationDuration={800}
//             // Use item.id or index as key
//             keyExtractor={item => item.id.toString()}
//             renderItem={({item}) => (
//               <TouchableOpacity
//                 style={styles.carouselItemContainer}
//                 onPress={() => navigateToDetail(item)} // Navigate on item press
//                 activeOpacity={0.8} // Feedback on touch
//               >
//                 <View style={styles.carouselItemContent}>
//                   {/* Example Content: Image */}
//                   {item.imageOwner ? (
//                     <Image
//                       source={{uri: item.imageOwner}}
//                       style={styles.itemImage}
//                       resizeMode="cover"
//                     />
//                   ) : (
//                     <View style={[styles.itemImage, styles.placeholderImage]}>
//                       <IconStyles
//                         name="image-off"
//                         iconSet="MaterialCommunityIcons"
//                         size={40}
//                         color={COLOR.GRAY3}
//                       />
//                     </View>
//                   )}
//                   {/* Example Content: Text */}
//                   <View style={styles.itemTextContainer}>
//                     <Text style={styles.itemTitle} numberOfLines={1}>
//                       {item.nameOwner || 'Unnamed Location'}
//                     </Text>
//                     <Text style={styles.itemSubtitle} numberOfLines={1}>
//                       {item.address || 'No address'}
//                     </Text>
//                     {/* Add more details like distance, rating, etc. */}
//                   </View>
//                 </View>
//               </TouchableOpacity>
//             )}
//           />
//         )}
//         {/* Show message if carousel is visible but no data */}
//         {isCarouselVisible && (!ownersData || ownersData.length === 0) && (
//           <View style={styles.noDataContainer}>
//             <Text style={styles.noDataText}>No locations found.</Text>
//           </View>
//         )}
//       </View>
//     </View>
//   );
// };

// export default MapScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1, // Use flex: 1 instead of absoluteFillObject for better layout control
//     backgroundColor: COLOR.BACKGROUND, // Add a background color
//   },
//   map: {
//     flex: 1, // Map should take up available space
//   },
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: COLOR.BACKGROUND,
//   },
//   errorText: {
//     color: COLOR.ERROR,
//     fontSize: 16,
//     textAlign: 'center',
//     paddingHorizontal: 20,
//   },
//   bottomContainer: {
//     position: 'absolute',
//     bottom: 0, // Adjust bottom spacing as needed (e.g., for safe areas)
//     left: 0,
//     right: 0,
//     alignItems: 'center', // Center toggle button horizontally
//   },
//   toggleButtonContainer: {
//     // Add some style to the button container if needed
//     marginBottom: 5, // Space between button and carousel
//     backgroundColor: COLOR.WHITE,
//     borderRadius: 30, // Make it circular
//     padding: 5,
//     elevation: 4, // Add shadow
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//   },
//   // Carousel Styles
//   carouselItemContainer: {
//     backgroundColor: COLOR.WHITE,
//     borderRadius: 15,
//     height: '95%', // Use percentage or calculated height
//     // width: width - 40, // Adjust width for padding/margin effect
//     marginLeft: 20, // Center the item by adjusting margins
//     marginRight: 20,
//     overflow: 'hidden', // Clip content like image corners
//     elevation: 5, // Android shadow
//     shadowColor: '#000', // iOS shadow
//     shadowOffset: {width: 0, height: 3},
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     marginBottom: 10, // Space at the bottom
//   },
//   carouselItemContent: {
//     flex: 1, // Allow content to fill container
//     // flexDirection: 'row', // Arrange image and text side-by-side if desired
//   },
//   itemImage: {
//     height: '65%', // Allocate space for the image
//     width: '100%',
//     backgroundColor: COLOR.GRAY1, // Placeholder background
//   },
//   placeholderImage: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   itemTextContainer: {
//     flex: 1, // Take remaining space
//     padding: 10,
//     justifyContent: 'center', // Center text vertically
//   },
//   itemTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: COLOR.TEXT,
//     marginBottom: 4,
//   },
//   itemSubtitle: {
//     fontSize: 14,
//     color: COLOR.GRAY4,
//   },
//   noDataContainer: {
//     height: 100, // Give it some height
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: '100%',
//   },
//   noDataText: {
//     color: COLOR.GRAY4,
//     fontSize: 16,
//   },
//   // Optional Callout Styles
//   calloutView: {
//     padding: 10,
//     minWidth: 150, // Ensure callout has some width
//   },
//   calloutTitle: {
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
// });
