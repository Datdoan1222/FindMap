import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import MapView, {Marker, Callout, PROVIDER_GOOGLE} from 'react-native-maps';
import {requestLocationPermission} from '../../utill/requestLocationPermission';
import {styles_map} from '../../constants/mapStyle';
import {useDispatch, useSelector} from 'react-redux';
import {fetchOwners} from '../../redux/ownersSlide';

const {width, height} = Dimensions.get('window');

const MapScreen = () => {
  const ownersData = useSelector(state => state.owners.owners);
  const loading = useSelector(state => state.owners.loading);
  if (loading) {
    <ActivityIndicator />;
  }
  const dispatch = useDispatch();
  const mapRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(10);
  const [region, setRegion] = useState({
    latitude: 10.953,
    longitude: 106.8023,
    latitudeDelta: 0.1922,
    longitudeDelta: 0.1922 * (width / height),
  });

  const onRegionChangeComplete = region => {
    const newZoom = region.latitudeDelta < 0.05 ? 15 : 10;
    setZoomLevel(newZoom);
  };

  useEffect(() => {
    requestLocationPermission();
    dispatch(fetchOwners());
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        showsUserLocation={true}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        customMapStyle={styles_map}
        onRegionChangeComplete={onRegionChangeComplete}>
        {zoomLevel > 12 &&
          ownersData.map((location, index) => (
            <Marker
              key={location.id}
              coordinate={{
                latitude: location.locationOwner.latitude,
                longitude: location.locationOwner.longitude,
              }}
              title={location.nameOwner}
              // image={{
              //   uri: location.imageOwner,
              // }}
            />
          ))}
      </MapView>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
