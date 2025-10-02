import storage from '@react-native-firebase/storage';

export const uploadImageToFirebase = async (uri, index) => {
  if (!uri) return null;
  const filename = `phongtro/${Date.now()}_${index}.jpg`;
  const reference = storage().ref(filename);
  await reference.putFile(uri); // <-- upload file
  const downloadURL = await reference.getDownloadURL(); // <-- get URL
  return downloadURL;
};
