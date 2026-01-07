import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import Geolocation from 'react-native-geolocation-service';
import { debounce } from 'lodash';

// Components
import RowComponent from '../../component/atoms/RowComponent';
import ButtonIcon from '../../component/atoms/ButtonIcon';

// Constants
import IconStyles from '../../constants/IconStyle';
import { COLOR } from '../../constants/colorConstants';
import { FONT_SIZE } from '../../constants/fontConstants';
import { GOONG_MAP_API_KEY } from '../../constants/goongConstants';

// Services
import { goongService, goongService_v2 } from '../../service/goongService';

// Store
import userStore from '../../store/userStore';
import { fetchOwners } from '../../redux/ownersSlide';
import { getProvince } from '../../utill/getProvince';

MapLibreGL.setAccessToken(null);

const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  accuracy: { android: 'high', ios: 'best' },
  timeout: 10000,
  maximumAge: 5000,
};

const MapLibreScreen = () => {
  const { isSelectAddAddress } = useRoute().params ?? {};
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  const { currentLocation, setCurrentLocation, setAddAddress } = userStore();

  // Refs
  const camera = useRef(null);

  // State
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [locationState, setLocationState] = useState(currentLocation);
  const [inputValue, setInputValue] = useState('');
  const [isCurrentLocationActive, setIsCurrentLocationActive] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(14);

  // Effects
  useEffect(() => {
    dispatch(fetchOwners());
  }, [dispatch]);

  useEffect(() => {
    const isSameLocation =
      currentLocation?.lat === locationState?.lat &&
      currentLocation?.lon === locationState?.lon;
    setIsCurrentLocationActive(isSameLocation);
  }, [locationState, currentLocation]);

  // Handlers
  const handleGetCurrentLocation = useCallback(async () => {
    Geolocation.getCurrentPosition(
      async position => {
        const coordinates = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };

        camera.current?.setCamera({
          centerCoordinate: [coordinates.lon, coordinates.lat],
          zoomLevel: 16,
          animationDuration: 1000,
        });

        setLocationState(currentLocation);
      },
      error => {
        console.error('Geolocation error:', error);
        Alert.alert('Không thể lấy vị trí hiện tại', 'Vui lòng thử lại sau.');
      },
      GEOLOCATION_OPTIONS,
    );
  }, [currentLocation]);

  const handleSelectSearchResult = useCallback(async item => {
    try {
      setSearchSuggestions([]);
      setInputValue('');

      const response = await goongService_v2.getPlaceDetail(item.place_id);
      const result = response.data.result;

      const selectedLocation = {
        place_id: item.place_id,
        display_name: result.formatted_address,
        lat: result.geometry.location.lat,
        lon: result.geometry.location.lng,
        name: result.name,
        province: result.compound?.commune,
        parent: result.compound?.province,
      };

      setLocationState(selectedLocation);
    } catch (error) {
      console.error('Error selecting search result:', error);
    }
  }, []);

  const handleMapPress = useCallback(async event => {
    try {
      const [lng, lat] = event.geometry.coordinates;
      const latRounded = parseFloat(lat.toFixed(5));
      const lngRounded = parseFloat(lng.toFixed(5));

      const { data } = await goongService.getGeocoding({
        latlng: `${latRounded}, ${lngRounded}`,
      });

      const result = data.results[0];
      const province = getProvince(result.address_components);

      if (result) {
        const pressedLocation = {
          place_id: result.place_id,
          display_name: result.formatted_address,
          name: result.name,
          lat: result.geometry.location?.lat,
          lon: result.geometry.location?.lng,
          province: province,
        };

        setLocationState(pressedLocation);
      }
    } catch (error) {
      console.error('Error fetching geocoding:', error);
    }

    setSearchSuggestions([]);
    setInputValue('');
  }, []);

  const debouncedSearch = useCallback(
    debounce(async text => {
      if (!text || text.length < 3) {
        setSearchSuggestions([]);
        return;
      }

      try {
        const response = await goongService_v2.getPlacesAutocomplete({
          text,
          lat: currentLocation.lat,
          lng: currentLocation.lon,
        });

        const suggestions = response.data.predictions;
        setSearchSuggestions(suggestions);
      } catch (error) {
        console.error('Error fetching search suggestions:', error);
        setSearchSuggestions([]);
      }
    }, 800),
    [currentLocation],
  );

  const handleSearchInputChange = useCallback(
    text => {
      setInputValue(text);
      debouncedSearch(text);
    },
    [debouncedSearch],
  );

  const handleSaveLocation = useCallback(() => {
    if (isSelectAddAddress) {
      setAddAddress(locationState);
      navigation.goBack();
    } else {
      setCurrentLocation(locationState);
    }
  }, [isSelectAddAddress, locationState, setCurrentLocation, setAddAddress, navigation]);

  // Render helpers
  const renderSearchSuggestion = useCallback(
    ({ item }) => (
      <TouchableOpacity onPress={() => handleSelectSearchResult(item)}>
        <RowComponent flexDirection="row" alignItems="center">
          <IconStyles
            iconSet="FontAwesome6"
            name="location-crosshairs"
            size={22}
            color={COLOR.PRIMARY}
          />
          <Text style={styles.searchSuggestionText}>{item.description}</Text>
        </RowComponent>
      </TouchableOpacity>
    ),
    [handleSelectSearchResult],
  );

  const getMapCoordinates = () => {
    return [
      locationState?.lon || 106.3583744,
      locationState?.lat || 11.2787456,
    ];
  };

  const getDisplayAddress = () => {
    return locationState?.display_name_v2 || locationState?.display_name || '';
  };

  return (
    <View style={styles.container}>
      {/* Current Location Display */}
      <TouchableOpacity onPress={handleSaveLocation}>
        <RowComponent
          flexDirection="row"
          alignItems="center"
          justify="space-between"
          styles={styles.locationRow}>
          <ButtonIcon
            iconSet="MaterialCommunityIcons"
            name="map-marker"
            size={20}
            color={COLOR.PRIMARY}
            disabled
          />
          <Text style={styles.addressText}>{getDisplayAddress()}</Text>
          <IconStyles name="save" color={COLOR.PRIMARY} size={22} />
        </RowComponent>
      </TouchableOpacity>

      {/* Search Input */}
      <View style={styles.searchInputContainer}>
        <IconStyles name="search" size={20} />
        <TextInput
          allowFontScaling={false}
          style={styles.searchInput}
          placeholder="Vui lòng nhập vị trí"
          placeholderTextColor={COLOR.GREY_400}
          value={inputValue}
          onChangeText={handleSearchInputChange}
        />
      </View>

      {/* Search Suggestions */}
      {searchSuggestions.length > 0 && (
        <View style={styles.searchSuggestionsContainer}>
          <FlatList
            data={searchSuggestions}
            renderItem={renderSearchSuggestion}
            keyExtractor={item => item.place_id}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      {/* Map */}
      <MapLibreGL.MapView
        mapStyle={GOONG_MAP_API_KEY}
        onPress={handleMapPress}
        projection="globe"
        zoomEnabled={true}
        style={styles.map}>
        <MapLibreGL.Camera
          ref={camera}
          zoomLevel={zoomLevel}
          maxZoomLevel={18}
          minZoomLevel={4}
          centerCoordinate={getMapCoordinates()}
        />

        <MapLibreGL.PointAnnotation
          id="currentLocation"
          key="current-location"
          draggable={true}
          coordinate={getMapCoordinates()}
        />

        <MapLibreGL.Images
          images={{
            marker: require('../../assets/images/marker.png'),
          }}
        />

        <MapLibreGL.ShapeSource
          id="marker-source"
          shape={{
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: getMapCoordinates(),
                },
                properties: {
                  icon: 'marker',
                },
              },
            ],
          }}>
          <MapLibreGL.SymbolLayer
            id="marker-layer"
            style={{
              iconImage: 'marker',
              iconSize: 1,
            }}
          />
        </MapLibreGL.ShapeSource>
      </MapLibreGL.MapView>

      {/* Current Location Button */}
      <TouchableOpacity
        style={[
          styles.currentLocationButton,
          {
            backgroundColor: isCurrentLocationActive
              ? COLOR.GREY_400
              : COLOR.GREY_200,
          },
        ]}
        disabled={isCurrentLocationActive}
        onPress={handleGetCurrentLocation}>
        <IconStyles
          iconSet="FontAwesome6"
          name="location-crosshairs"
          size={28}
          color={COLOR.PRIMARY}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  map: {
    flex: 1,
    zIndex: -99,
  },
  locationRow: {
    color: COLOR.WHITE,
    marginHorizontal: 10,
    paddingVertical: 10,
  },
  addressText: {
    flex: 1,
    marginHorizontal: 10,
    color: COLOR.GREY_900,
    fontSize: FONT_SIZE.TITLE,
    fontWeight: '400',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR.SECONDARY,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 100,
    paddingHorizontal: 10,
    height: 50,
    width: '100%',
  },
  searchInput: {
    fontSize: FONT_SIZE.TITLE,
    color: COLOR.GREY_900,
    height: '100%',
    flex: 1,
    marginLeft: 10,
  },
  searchSuggestionsContainer: {
    position: 'absolute',
    top: 170,
    zIndex: 99,
    backgroundColor: COLOR.WHITE,
    paddingHorizontal: 10,
    width: '100%',
    maxHeight: '50%',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  searchSuggestionText: {
    padding: 15,
    fontSize: FONT_SIZE.TITLE,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    color: COLOR.GREY_900,
    width: '97%',
  },
  currentLocationButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    padding: 12,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default MapLibreScreen;
