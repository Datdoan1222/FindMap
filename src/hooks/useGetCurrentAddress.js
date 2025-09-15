import {useState, useCallback} from 'react';
import {Alert, Linking} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import userStore from '../store/userStore';
import {mapService} from '../service/mapService';
import {hasLocationPermission} from '../utill/hasLocationPermission';

const openSetting = () => {
  Linking.openSettings().catch(() => {
    Alert.alert('Unable to open settings');
  });
};

export const useCurrentAddress = () => {
  const {setCurrentLocation} = userStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCurrentAddress = useCallback(async () => {
    setLoading(true);
    setError(null);

    const status = await hasLocationPermission();
    if (!status) {
      Alert.alert('Vui lòng cấp quyền vị trí để được phục vụ tốt nhất', '', [
        {text: 'Đi tới cài đặt', onPress: openSetting},
        {text: 'Không cấp quyền'},
      ]);
      setLoading(false);
      return;
    }

    Geolocation.getCurrentPosition(
      async position => {
        // const geo = {
        //   lat: position.coords.latitude,
        //   lon: position.coords.longitude,
        // };
        const geo = {
          lat: 10.947479,
          lon: 106.858172,
        };

        try {
          const {data} = await mapService.getGeocoding({
            latlng: `${geo.lat}, ${geo.lon}`,
          });

          const response = data.results[0];
          const latitude = response.geometry.location?.lat;
          const longitude = response.geometry.location?.lng;

          const currentAddress = {
            place_id: response.place_id,
            display_name: response.formatted_address,
            name: response.name,
            lat: latitude,
            lon: longitude,
            province: response?.compound?.district,
            parent: response?.compound?.province,
          };

          setCurrentLocation(currentAddress);
          console.log('currentAddress', currentAddress);
        } catch (err) {
          console.log('Error fetching street name:', err?.response);
          setError('Không thể lấy địa chỉ từ mapService');
        } finally {
          setLoading(false);
        }
      },
      geoError => {
        console.log('Error when getting location:', geoError);
        Alert.alert('Không thể lấy vị trí hiện tại', 'Vui lòng thử lại sau.');
        setError('Lỗi khi lấy vị trí');
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        timeout: 30000,
        maximumAge: 5000,
      },
    );
  }, [setCurrentLocation]);

  return {getCurrentAddress, loading, error};
};
