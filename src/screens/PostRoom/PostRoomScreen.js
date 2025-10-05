import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
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

const PostRoomScreen = () => {
  const navigation = useNavigation();
  const inforUser = userStore(state => state.inforUser);
  const handlePostDetail = () => {
    navigation.navigate(NAVIGATION_NAME.POST_ROOM_DETAIL_SCREEN);
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
      <ScrollView></ScrollView>
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
});
