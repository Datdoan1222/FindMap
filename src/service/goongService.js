import axios from 'axios';
import {
  GOONG_BASE_URL,
  GOONG_SERVICE_LIST,
  PREFIX,
} from '../constants/goongConstants';

export const goong = axios.create({
  baseURL: GOONG_BASE_URL,
  responseType: 'json',
  timeout: 50000,
});

export const goongService = {
  getFindText: body => {
    return goong.get(
      GOONG_SERVICE_LIST.Find_Place_from_text + PREFIX + '&input=' + body,
    );
  },
  getPlacesAutocomplete: search => {
    return goong.get(
      GOONG_SERVICE_LIST.PlacesAutocomplete + PREFIX + '&input=' + search,
    );
  },
  getGeocoding: body => {
    return goong.get(
      GOONG_SERVICE_LIST.Geocoding + body.latlng + '&api_key=' + PREFIX,
      {timeout: 10000},
    );
  },
  getPlaceDetail: place_id => {
    return goong.get(
      GOONG_SERVICE_LIST.PlaceDetail +
        'place_id=' +
        place_id +
        '&api_key=' +
        PREFIX,
    );
  },
  getDirections: body => {
    return goong.get(
      URL +
        GOONG_SERVICE_LIST.Directions +
        '&origin=' +
        encodeURIComponent(body.origin[1] + ',' + body.origin[0]) +
        '&destination=' +
        encodeURIComponent(body.destination[1] + ',' + body.destination[0]) +
        '&vehicle=' +
        body.vehicle +
        '&api_key=' +
        PREFIX,
    );
  },
};
export const goongService_v2 = {
  getPlacesAutocomplete: ({text, lat, lng}) => {
    return goong.get(
      GOONG_SERVICE_LIST.PlacesAutocomplete_v2 +
        '?input=' +
        text +
        '&location=' +
        `${lat},${lng}` +
        '&api_key=' +
        PREFIX +
        '&has_deprecated_administrative_unit=true',
    );
  },
  getPlaceDetail: place_id => {
    return goong.get(
      GOONG_SERVICE_LIST.PlaceDetail_v2 +
        '?place_id=' +
        place_id +
        '&api_key=' +
        PREFIX +
        '&has_deprecated_administrative_unit=true',
    );
  },
};
