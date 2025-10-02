import {create} from 'zustand';

const userStore = create(set => ({
  inforUser: {
    id: '',
    name: '',
    email: '',
    phone: '',
    role: '', // user: người thuê, owner: chủ trọ
  },
  setInforUser: newInfor =>
    set(state => ({
      inforUser: {
        ...state.inforUser,
        ...newInfor,
      },
    })),
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
