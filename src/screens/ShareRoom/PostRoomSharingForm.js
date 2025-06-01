import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {COLOR} from '../../constants/colorConstants';
import IconStyles from '../../constants/IconStyle';
import RowComponent from '../../component/atoms/RowComponent';
import Space from '../../component/atoms/Space';
import {ICON_TYPE} from '../../constants/iconConstants';
import {useNavigation} from '@react-navigation/native';

const PostRoomSharingForm = () => {
  const navigtion = useNavigation();
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = () => {
    if (!name || !gender || !description || !address || !price) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const postData = {
      name,
      gender,
      description,
      address,
      price,
      imageUrl,
    };

    console.log('Dữ liệu gửi đi:', postData);
    Alert.alert('Thành công', 'Tin ghép phòng đã được đăng!', [
      {text: 'OK', onPress: () => navigtion.goBack()},
    ]);
    // Gửi postData lên Firebase hoặc API tại đây...
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
      <TextInput
        style={styles.input}
        placeholder="Dán link ảnh (tùy chọn)"
        value={imageUrl}
        onChangeText={setImageUrl}
      />

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
