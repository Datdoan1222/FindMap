import storage from '@react-native-firebase/storage';

export const uploadImageToFirebase = async (uri, index) => {
  if (!uri) return null;

  const filename = `phongtro/${Date.now()}_${index}.jpg`;
  const reference = storage().ref(filename);

  // putFile dành cho React Native (nhận đường dẫn local file://...)
  await reference.putFile(uri);

  // Lấy URL public để lưu vào DB
  const downloadURL = await reference.getDownloadURL();

  return downloadURL;
};
