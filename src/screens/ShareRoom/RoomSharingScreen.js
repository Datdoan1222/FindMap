import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import Modal from '../../component/molecules/Modal';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import HeaderComponent from '../../component/molecules/HeaderComponent';
import {COLOR} from '../../constants/colorConstants';
import IconStyles from '../../constants/IconStyle';
import Space from '../../component/atoms/Space';
import {NAVIGATION_NAME} from '../../constants/navigtionConstants';
import {useDispatch, useSelector} from 'react-redux';
import {
  deletePostShareRoom,
  fetchPostsShareRoom,
} from '../../redux/postShareRoomSlide';
const posts = [
  {
    id: '1',
    user: {
      name: 'Nguyễn Văn A',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    time: '2 giờ trước',
    description:
      'Cần tìm 1 bạn nam ở ghép, phòng đầy đủ tiện nghi, gần trường.',
    images: [
      'https://firebasestorage.googleapis.com/v0/b/map-service-1dada.appspot.com/o/phongtro%2Fbasauimg1.jpg?alt=media&token=ccf935e3-245e-4ee5-a82d-fb4a597b993d',
      'https://firebasestorage.googleapis.com/v0/b/map-service-1dada.appspot.com/o/phongtro%2Fbasauimg3.jpg?alt=media&token=744f6884-674f-47b2-9d1e-6afcf3ece32f',
    ],
    price: '1.500.000đ/người',
    location: 'Q.10, TP.HCM',
    gender: 'Nam',
  },
  // thêm bài viết khác nếu muốn
];
const RoomSharingScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const postsShareRoomData = useSelector(
    state => state.postsShareRoomData.postsShareRoomData,
  );
  // const userid = auth().currentUser.uid;
  console.log('=============ss=======================');
  console.log(postsShareRoomData);
  console.log('====================================');

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchPostsShareRoom());
    }, [dispatch]),
  );
  const handleDeletePost = postId => {
    dispatch(deletePostShareRoom(postId));
    setIsOpenModal(true);
  };
  const renderPost = ({item}) => (
    <View style={styles.postContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={{uri: item.user.avatar}} style={styles.avatar} />
        <View>
          <Text style={styles.name}>{item.user.name}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
      </View>

      {/* Mô tả */}
      <Text style={styles.description}>{item.description}</Text>

      {/* Hình ảnh */}
      <ScrollView
        horizontal
        style={styles.imageScroll}
        showsHorizontalScrollIndicator={false}>
        {item.images.map((img, index) => (
          <Image key={index} source={{uri: img}} style={styles.image} />
        ))}
      </ScrollView>

      {/* Thông tin */}
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>
          <IconStyles
            iconSet="FontAwesome5"
            name={'coins'}
            size={14}
            color={COLOR.WARN}
          />
          <Space width={5} />
          {item.price}
        </Text>
        <Text style={styles.infoText}>
          <IconStyles
            iconSet="FontAwesome6"
            name={'location-dot'}
            size={14}
            color={COLOR.ERROR}
          />
          <Space width={5} />
          {item.location}
        </Text>
        <Text style={styles.infoText}>
          <IconStyles
            iconSet="FontAwesome6"
            name={'mars'}
            size={14}
            color={COLOR.PRIMARY}
          />
          <Space width={5} />
          Ưu tiên: {item.gender}
        </Text>
      </View>

      {/* Nút xem chi tiết */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleDeletePost(item.id)}>
        <Text style={styles.buttonText}>Xác nhận</Text>
      </TouchableOpacity>
    </View>
  );
  return (
    <View style={styles.container}>
      {/* Nút đăng bài */}
      <TouchableOpacity
        style={styles.addPostButton}
        onPress={() => {
          navigation.navigate(NAVIGATION_NAME.POST_ROOM_SHARING_FORM);
        }}>
        <Text style={styles.addPostText}>+ Đăng tin ghép phòng</Text>
      </TouchableOpacity>

      {/* Danh sách bài viết */}
      <FlatList
        data={postsShareRoomData}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
      <Modal
        isVisible={isOpenModal}
        title={'Xác nhận'}
        text={
          'Bạn đã gửi thông báo muốn ghép phòng cho chủ bài viết này. Chủ bài viết sẽ liên hệ bạn sớm nhất'
        }
        onConfirm={() => setIsOpenModal(false)}
        textConfirm={'Xác nhận'}
      />
    </View>
  );
};

export default RoomSharingScreen;

const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  addPostButton: {
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 16,
    borderColor: COLOR.PRIMARY,
    borderWidth: 1,
  },
  addPostText: {
    textAlign: 'center',
    color: COLOR.PRIMARY,
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontSize: 13,
  },
  postContainer: {
    borderWidth: 1,
    borderColor: COLOR.SECONDARY,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    backgroundColor: COLOR.WHITE,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 10,
  },
  name: {
    fontWeight: 'bold',
  },
  time: {
    color: COLOR.BLACK2,
    fontSize: 12,
  },
  description: {
    marginBottom: 10,
    fontSize: 15,
  },
  imageScroll: {
    marginBottom: 10,
  },
  image: {
    width: width * 0.6,
    height: 160,
    borderRadius: 10,
    marginRight: 10,
  },
  infoRow: {
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 4,
  },
  button: {
    backgroundColor: COLOR.SUCCESSFUL,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    textAlign: 'center',
    color: COLOR.WHITE,
    fontWeight: '600',
  },
});
