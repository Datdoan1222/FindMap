import {create} from 'zustand';

const userStore = create(set => ({
  currentLocation: {
    place_id: '',
    display_name: '',
    name: '',
    lat: '',
    lon: '',
    parentNew: '',
  },
  setCurrentLocation: newLocation =>
    set(state => ({
      currentLocation: {
        ...state.currentLocation,
        ...newLocation,
      },
    })),
}));

export default userStore;
