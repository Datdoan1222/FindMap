import {create} from 'zustand';

const userStore = create(set => ({
  inforUser: {
    id: '',
    name: '',
    email: '',
    phone: '',
    role: '', // user: người thuê, owner: chủ trọ
    avatar: '',
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
  addAddress: {
    place_id: '',
    display_name: '',
    name: '',
    lat: '',
    lon: '',
    parentNew: '',
    province: '',
  },
  setAddAddress: newLocation =>
    set(state => ({
      addAddress: {
        ...state.addAddress,
        ...newLocation,
      },
    })),
}));

export default userStore;
