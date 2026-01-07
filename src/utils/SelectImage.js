import { launchImageLibrary } from 'react-native-image-picker';

export const SelectImage = async () => {
  try {
    const response = await new Promise((resolve, reject) => {
      launchImageLibrary({ mediaType: 'photo' }, (response) => {
        if (response.didCancel) {
          // console.log('User cancelled image picker');
          resolve(null);
        } else if (response.error) {
          // console.log('ImagePicker Error: ', response.error);
          reject(response.error);
        } else {
          const uri = response.assets[0].uri;
          // console.log('uri', uri);
          resolve(uri);
        }
      });
    });

    return response;
  } catch (error) {
    console.error('Error selecting image:', error);
    throw error;
  }
};