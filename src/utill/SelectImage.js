import {launchImageLibrary} from 'react-native-image-picker';

export const SelectImage = async () => {
  return new Promise(resolve => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) {
        resolve(null);
      } else if (response.errorCode) {
        console.warn(
          'ImagePicker Error:',
          response.errorMessage || response.errorCode,
        );
        resolve(null); // ❗ Không reject nữa
      } else if (!response.assets || response.assets.length === 0) {
        console.warn('No image selected.');
        resolve(null); // ❗ Không reject nữa
      } else {
        resolve(response.assets[0].uri);
      }
    });
  });
};
