import axios from 'axios';
import {
  API_MAPSERVER_URL,
  MAP_SERVICE_LIST,
  NOMINATIM_SERVER_URL,
} from '../constants/mapConstants.js';

export const map = axios.create({
  baseURL: API_MAPSERVER_URL,
  responseType: 'json',
  timeout: 50000,
});

export const mapService = {
  postLocation: body => {
    const data = {
      name: body.name,
      address: body.formatted_address,
      amenity: body.amenity || 'default',
      shop: body.shop || 'default',
      latitude: parseFloat(body.geometry.location.lat),
      longitude: parseFloat(body.geometry.location.lng),
      distric: body.compound?.district || body.compound?.commune,
      province: body.compound?.province || 'default',
    };
    return map.post(MAP_SERVICE_LIST.AddLocation, data);
  },
  getPlacesAutocomplete: search => {
    const res = map.get(
      MAP_SERVICE_LIST.PlacesAutocomplete + 'query=' + search,
      // encodeURIComponent(search),
    );
    console.log(
      'res',
      res,
      MAP_SERVICE_LIST.PlacesAutocomplete + 'query=' + search,
    );
    return res;
  },
  getGeocoding: body => {
    const res = map.get(MAP_SERVICE_LIST.Geocoding + `latlng=` + body.latlng);
    return res;
  },
  getPlaceDetail: search => {
    const res = map.get(
      MAP_SERVICE_LIST.PlacesAutocomplete +
        'query=' +
        encodeURIComponent(search),
    );

    return res;
  },
  // getDirections: body => {
  //   return map.get(
  //     URL +
  //       MAP_SERVICE_LIST.Directions +
  //       '&origin=' +
  //       encodeURIComponent(body.origin[1] + ',' + body.origin[0]) +
  //       '&destination=' +
  //       encodeURIComponent(body.destination[1] + ',' + body.destination[0]) +
  //       '&vehicle=' +
  //       body.vehicle +
  //       '&api_key=' +
  //       PREFIX,
  //   );
  // },
};
