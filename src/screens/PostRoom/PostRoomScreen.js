import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import RowComponent from '../../component/atoms/RowComponent';
import IconStyles from '../../constants/IconStyle';
import {COLOR} from '../../constants/colorConstants';
import TextComponent from '../../component/atoms/TextComponent';
import userStore from '../../store/userStore';
import {ICON_NAME, ICON_TYPE} from '../../constants/iconConstants';
import Space from '../../component/atoms/Space';
import {useNavigation} from '@react-navigation/native';
import {NAVIGATION_NAME} from '../../constants/navigtionConstants';
import {useDeletePost, usePosts} from '../../hooks/usePost';
import PostImages from '../../component/organisms/PostRoom/PostImages';
import {USER_ID} from '../../constants/envConstants';
import {toPrice} from '../../utill/toPrice';
import {getFormattedTime} from '../../utill/time';
import {useUpdateStatusPost} from '../../hooks/useRooms';

const PostRoomScreen = () => {
  const navigation = useNavigation();
  const inforUser = userStore(state => state.inforUser);
  const {data: posts} = usePosts();
  const deletePost = useDeletePost();
  const updateStatusPostRoom = useUpdateStatusPost();
  const [isEditPost, setIsEditPost] = useState(false);
  const dataPost = posts ? posts.filter(r => r.owner_id === USER_ID) : [];
  const handlePostDetail = () => {
    navigation.navigate(NAVIGATION_NAME.POST_ROOM_DETAIL_SCREEN);
  };
  const onDeletePost = (postId, roomId) => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc muốn xoá bài đăng này không?',
      [
        {text: 'Huỷ', style: 'cancel'},
        {
          text: 'Xoá',
          style: 'destructive',
          onPress: async () => {
            try {
              // 1️⃣ Xoá bài đăng
              await deletePost.mutateAsync(postId);

              // 2️⃣ Cập nhật lại status phòng
              await updateStatusPostRoom.mutateAsync({
                roomId,
                statusPost: false,
              });

              // 3️⃣ Thông báo thành công
              Alert.alert('✅ Thành công', 'Bài đăng đã được xoá.');
            } catch (error) {
              console.log(
                '❌ Lỗi khi xoá bài đăng:',
                error.response?.data || error,
              );
              Alert.alert(
                'Thất bại',
                'Không thể xoá bài đăng, vui lòng thử lại sau.',
              );
            }
          },
        },
      ],
      {cancelable: true},
    );
  };

  const ItemPost = ({
    id,
    roomId,
    postDescription,
    images,
    address,
    is_active,
    price,
    region,
    status,
    title,
    updated_at,
    onDeletePost,
  }) => {
    return (
      <RowComponent
        flexDirection="column"
        justify="center"
        alignItems="flex-start"
        styles={[styles.itemPost, isEditPost && styles.itemPostEdit]}>
        <RowComponent
          flexDirection="row"
          justify="space-between"
          styles={styles.avatarPost}>
          <RowComponent flexDirection="row">
            <RowComponent
              alignItems="center"
              justify="center"
              styles={styles.postAvatar}>
              {inforUser?.avatar ? (
                <Image
                  source={{uri: inforUser?.avatar}}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatar}>
                  <IconStyles
                    iconSet="FontAwesome6"
                    name={ICON_TYPE.ICON_ACCOUNT}
                    size={25}
                    color={COLOR.GREY_600}
                  />
                </View>
              )}
            </RowComponent>
            <Space width={5} />
            <TextComponent styles={styles.name} text={inforUser?.name} />
          </RowComponent>
          <RowComponent>
            <Text>{getFormattedTime(updated_at)}</Text>
          </RowComponent>
        </RowComponent>
        <RowComponent>
          <Text
            style={{paddingVertical: 10, fontSize: 17, color: COLOR.BLACK1}}>
            {postDescription}
          </Text>
        </RowComponent>
        <PostImages isAutoPlay={false} data={images} height={300} />
        <RowComponent
          justify="flex-start"
          alignItems="flex-start"
          flexDirection="column">
          <Text style={styles.titlePost}>{title}</Text>
          <Text style={styles.addressPost}>{address}</Text>
          <Text style={styles.pricePost}>{`${toPrice(price)} đ`}</Text>
        </RowComponent>
        {/* ✅ Icon góc phải trên cùng */}
        {isEditPost && (
          <TouchableOpacity
            onPress={() => onDeletePost(id, roomId)}
            style={styles.iconOverlay}>
            <IconStyles
              name="closecircle"
              iconSet="AntDesign"
              color={COLOR.DANGER}
              size={22}
            />
          </TouchableOpacity>
        )}
      </RowComponent>
    );
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.postContainer} onPress={handlePostDetail}>
        <RowComponent styles={styles.postText}>
          <RowComponent
            alignItems="center"
            justify="center"
            styles={styles.postAvatar}>
            {inforUser?.avatar ? (
              <Image source={{uri: inforUser?.avatar}} style={styles.avatar} />
            ) : (
              <View style={styles.avatar}>
                <IconStyles
                  iconSet="FontAwesome6"
                  name={ICON_TYPE.ICON_ACCOUNT}
                  size={25}
                  color={COLOR.GREY_600}
                />
              </View>
            )}
          </RowComponent>
          <Space width={5} />
          <TextComponent
            styles={styles.textPost}
            text={'Hãy để phòng của bạn nhiều người biết đến'}
          />
        </RowComponent>
        <RowComponent styles={styles.postIcon}>
          <IconStyles name={'add'} size={22} color={COLOR.GRAY3} />
        </RowComponent>
      </TouchableOpacity>
      <RowComponent
        flexDirection="row"
        justify="space-between"
        styles={{width: '100%', paddingVertical: 10}}>
        <Text
          style={
            styles.titleMain
          }>{`Có ${dataPost.length} phòng đang được đăng bài`}</Text>
        <TouchableOpacity onPress={() => setIsEditPost(true)}>
          <Text>Chỉnh sửa</Text>
        </TouchableOpacity>
      </RowComponent>
      <ScrollView>
        {dataPost.map((item, index) => {
          return (
            <View key={index}>
              <ItemPost
                roomId={item?.room_id}
                id={item?.id}
                postDescription={item?.description}
                images={item?.images}
                address={item?.address}
                is_active={item?.is_active}
                price={item?.price}
                region={item?.region}
                status={item?.status}
                title={item?.title}
                updated_at={item?.updated_at}
                onDeletePost={(postId, roomId) => onDeletePost(postId, roomId)}
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default PostRoomScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  postContainer: {
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postAvatar: {
    borderRadius: 50,
    width: 60,
    height: 60,
    alignContent: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: COLOR.GREY_300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textPost: {
    fontSize: 14,
    fontStyle: 'italic',
    color: COLOR.GREY_900,
  },
  postIcon: {
    width: 30,
    height: 30,
    borderRadius: 7,
    borderWidth: 2.5,
    borderColor: COLOR.GREY_300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  //
  itemPost: {
    margin: 10,
    borderColor: COLOR.BLACK1,
    borderRadius: 15,
    borderWidth: 1,
    padding: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLOR.BLACK1,
  },
  titlePost: {
    paddingVertical: 5,
    fontSize: 18,
    color: COLOR.BLACK1,
    width: '100%',
    fontWeight: 'bold',
  },
  addressPost: {
    paddingVertical: 5,
    fontSize: 14,
    color: COLOR.BLACK2,
    fontStyle: 'italic',
  },
  pricePost: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLOR.DANGER,
  },
  avatarPost: {width: '100%'},
  titleMain: {
    fontSize: 16,
    color: COLOR.BLACK1,
  },
  itemPostEdit: {
    borderColor: COLOR.DANGER,
    borderWidth: 2,
  },
  iconOverlay: {
    position: 'absolute',
    top: -8, // đè lên border một chút
    right: -8, // để nằm ngoài khung một phần
    zIndex: 10,
    backgroundColor: COLOR.WHITE,
    borderRadius: 20,
    padding: 3,
    elevation: 2,
  },
});
