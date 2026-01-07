import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import {COLOR} from '../../constants/colorConstants';
import IconStyles from '../../constants/IconStyle';
import RowComponent from '../../component/atoms/RowComponent';
import Space from '../../component/atoms/Space';
import {ICON_TYPE} from '../../constants/iconConstants';
import {useNavigation} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import {useDispatch} from 'react-redux';
import {addPostShareRoom} from '../../redux/postShareRoomSlide';
import {SelectImage} from '../../utill/SelectImage';
import auth from '@react-native-firebase/auth';
import {uploadImageToFirebase} from '../../utill/uploadImageToFirebase';

const PostRoomSharingForm = () => {
  const user = auth().currentUser;
  console.log('====================================');
  console.log(user);
  console.log('====================================');
  const navigtion = useNavigation();
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [images, setImages] = useState([]);
  const handleChooseImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 0, // 0 = chọn nhiều ảnh
      });

      if (result.didCancel) {
        console.log('User cancelled image picker');
      } else if (result.assets) {
        const selectedImages = result.assets.map(asset => asset.uri);
        setImages([...images, ...selectedImages]);
      }
    } catch (error) {
      console.warn('Error picking images:', error);
    }
  };

  const handleSubmit = async () => {
    if (
      !name ||
      !gender ||
      !description ||
      !address ||
      !price ||
      images.length === 0
    ) {
      Alert.alert(
        'Lỗi',
        'Vui lòng điền đầy đủ thông tin và chọn ít nhất 1 ảnh!',
      );
      return;
    }

    try {
      // 🔁 Upload tất cả ảnh lên Firebase
      const uploadedUrls = await Promise.all(
        images.map((imgUri, index) => uploadImageToFirebase(imgUri, index)),
      );
      console.log(uploadedUrls);
      const postData = {
        id: Date.now().toString(),
        user: {
          name,
          avatar: avatar || 'https://randomuser.me/api/portraits/men/1.jpg',
        },
        time: 'Vừa xong',
        description,
        images: uploadedUrls, // <-- ảnh từ Firebase
        price: `${price}đ/người`,
        location: address,
        gender,
      };

      console.log('Dữ liệu gửi đi:', postData);

      dispatch(addPostShareRoom(postData))
        .unwrap()
        .then(() => {
          Alert.alert('Thành công', 'Tin ghép phòng đã được đăng!', [
            {text: 'OK', onPress: () => navigtion.goBack()},
          ]);
        })
        .catch(error => {
          console.error('Lỗi khi đăng bài:', error);
          Alert.alert('Lỗi', 'Không thể đăng tin, vui lòng thử lại sau!');
        });
    } catch (error) {
      console.error('Upload ảnh lỗi:', error);
      Alert.alert('Lỗi', 'Không thể tải ảnh lên, vui lòng thử lại sau!');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* <Text style={styles.title}>Đăng tin ghép phòng</Text> */}
      <RowComponent
        flexDirection="row"
        alignItems="center"
        justify="flex-start"
        styles={{
          paddingTop: 15,
          paddingBottom: 5,
        }}>
        <IconStyles name={'person'} color={COLOR.PRIMARY} size={20} />
        <Space width={5} />
        <Text style={styles.label}> Họ tên</Text>
      </RowComponent>
      <TextInput
        style={styles.input}
        placeholder="Nhập họ tên"
        value={name}
        onChangeText={setName}
      />
      <RowComponent
        flexDirection="row"
        alignItems="center"
        justify="flex-start"
        styles={{
          paddingTop: 15,
          paddingBottom: 5,
        }}>
        <IconStyles
          name={'mars-double'}
          iconSet="FontAwesome5"
          color={COLOR.PRIMARY}
          size={20}
        />
        <Space width={5} />
        <Text style={styles.label}>Giới tính (Nam/Nữ)</Text>
      </RowComponent>
      <TextInput
        style={styles.input}
        placeholder="Nhập giới tính"
        value={gender}
        onChangeText={setGender}
      />

      <RowComponent
        flexDirection="row"
        alignItems="center"
        justify="flex-start"
        styles={{
          paddingTop: 15,
          paddingBottom: 5,
        }}>
        <IconStyles
          name={'text-document-inverted'}
          iconSet="Entypo"
          color={COLOR.PRIMARY}
          size={20}
        />
        <Space width={5} />
        <Text style={styles.label}>Mô Tả</Text>
      </RowComponent>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Viết mô tả về nhu cầu ghép phòng..."
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />
      <RowComponent
        flexDirection="row"
        alignItems="center"
        justify="flex-start"
        styles={{
          paddingTop: 15,
          paddingBottom: 5,
        }}>
        <IconStyles
          name={'location-dot'}
          iconSet="FontAwesome6"
          color={COLOR.ERROR}
          size={20}
        />
        <Space width={5} />
        <Text style={styles.label}>Địa chỉ</Text>
      </RowComponent>
      <TextInput
        style={styles.input}
        placeholder="Nhập địa chỉ phòng"
        value={address}
        onChangeText={setAddress}
      />
      <RowComponent
        flexDirection="row"
        alignItems="center"
        justify="flex-start"
        styles={{
          paddingTop: 15,
          paddingBottom: 5,
        }}>
        <IconStyles
          name={'coins'}
          iconSet="FontAwesome5"
          color={COLOR.WARN}
          size={20}
        />
        <Space width={5} />
        <Text style={styles.label}>Giá tiền (VNĐ/người)</Text>
      </RowComponent>
      <TextInput
        style={styles.input}
        placeholder="Nhập giá tiền"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <RowComponent
        flexDirection="row"
        alignItems="center"
        justify="flex-start"
        styles={{
          paddingTop: 15,
          paddingBottom: 5,
        }}>
        <IconStyles name={'image'} color={COLOR.PRIMARY} size={20} />
        <Space width={5} />
        <Text style={styles.label}>Ảnh (URL)</Text>
      </RowComponent>
      <TouchableOpacity style={styles.imagePicker} onPress={handleChooseImage}>
        <Text style={styles.imagePickerText}>Chọn ảnh từ thư viện</Text>
      </TouchableOpacity>
      <View style={{marginTop: 10}}>
        {images.map((img, index) => (
          <Image
            key={index}
            source={{uri: img}}
            style={{
              width: '100%',
              height: 200,
              borderRadius: 10,
              marginBottom: 10,
            }}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <IconStyles
          name="post-add"
          iconSet="MaterialIcons"
          color={COLOR.WHITE}
          size={20}
        />
        <Text style={styles.buttonText}>Đăng tin</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PostRoomSharingForm;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: COLOR.WHITE,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: COLOR.SECONDARY,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: COLOR.PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    paddingHorizontal: 10,
    textAlign: 'center',
    color: COLOR.WHITE,
    fontWeight: '600',
    fontSize: 16,
  },
});
