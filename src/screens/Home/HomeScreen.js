import {
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect } from 'react';
import HeaderComponent from '../../component/molecules/HeaderComponent';
import { COLOR } from '../../constants/colorConstants';
import { useNavigation } from '@react-navigation/native';
import { NAVIGATION_NAME } from '../../constants/navigtionConstants';
import RowComponent from '../../component/atoms/RowComponent';
import TextComponent from '../../component/atoms/TextComponent';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts } from '../../redux/postsSlide';
import ButtonIcon from '../../component/atoms/ButtonIcon';
import PostComponent from '../../component/molecules/PostComponent';
import auth from '@react-native-firebase/auth';
import Space from '../../component/atoms/Space';
import ExploreComponent from '../../component/molecules/ExploreComponent';
import IconStyles from '../../constants/IconStyle';
import { ICON_TYPE } from '../../constants/iconConstants';
const { width, height } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { posts, error, loading } = useSelector(state => state.posts);
  // const userid = auth().currentUser.uid;

  useEffect(() => {
    console.log('post😁😁😁😁😁😁', posts);
    dispatch(fetchPosts());
  }, []);

  if (loading || error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLOR.PRIMARY} />
      </View>
    );
  }

  const onPressRight = () => {
    navigation.navigate(NAVIGATION_NAME.SEARCH_SCREEN);
  };

  const handleSelectImg = item => {
    navigation.navigate(NAVIGATION_NAME.POST_DETAIL_SCREEN, {
      item,
    });
  };
  const onPressLeft = () => { };
  const ItemPost = ({ id, item }) => {
    const userImage = item?.user?.imageUser; // Example: Safely access nested data
    const userName = item?.user?.nameUser || 'Unknown User'; // Example: Provide fallback
    const postImage = item?.images; // Example: Get post image URI
    const userAddress = item?.user?.addressUser;
    const statusText = item?.statusText;
    console.log('userImage', postImage[0]);

    return (
      <RowComponent
        key={id}
        flexDirection="column"
        alignItems="flex-start"
        styles={styles.post_container}>
        <RowComponent
          flexDirection="row"
          alignItems="center"
          justify="space-between"
          styles={styles.header_post}>
          <RowComponent styles={styles.imgUser_post}>
            <Image
              // source={require('../../assets/images/logo_phongtro.png')}
              source={{ uri: userImage }}
              style={styles.imgUser_post}
            />
          </RowComponent>
          <RowComponent
            flexDirection="column"
            alignItems="flex-start"
            styles={styles.nameUser_post}>
            <TextComponent
              size={14}
              title
              styles={styles.text_userName}
              text={userName}
            />
            <TextComponent
              styles={styles.text_userAddress}
              size={12}
              text={userAddress}
            />
          </RowComponent>
        </RowComponent>
        <RowComponent styles={styles.header_post}>
          <TextComponent size={13} text={statusText} />
        </RowComponent>
        <RowComponent
          styles={styles.content_post}
          onPress={() => handleSelectImg(item)}>
          {postImage?.length === 3 && (
            <>
              <Image
                source={{ uri: postImage[0] }}
                style={styles.leftLargeImage}
              />
              <View style={styles.rightSmallImages}>
                <Image
                  source={{ uri: postImage[1] }}
                  style={[styles.smallImage, { marginBottom: 2 }]}
                />
                <Image
                  source={{ uri: postImage[2] }}
                  style={[styles.smallImage, { marginTop: 2 }]}
                />
              </View>
            </>
          )}

          {postImage?.length >= 4 && (
            <>
              <Image
                source={{ uri: postImage[0] }}
                style={styles.leftLargeImage}
              />
              <View style={styles.rightSmallImages}>
                <Image
                  source={{ uri: postImage[1] }}
                  style={[styles.smallImage, { marginBottom: 2 }]}
                />
                <Image
                  source={{ uri: postImage[2] }}
                  style={[styles.smallImage, { marginTop: 2 }]}>
                  {/* Overlay dấu + */}
                  <View style={styles.overlay}>
                    <Text style={styles.overlayText}>
                      +{postImage.length - 3}
                    </Text>
                  </View>
                </Image>
              </View>
            </>
          )}

          {/* Trường hợp 1 ảnh */}
          {postImage?.length === 1 && (
            <Image source={{ uri: postImage[0] }} style={styles.fullImage} />
          )}

          {/* Trường hợp 2 ảnh */}
          {postImage?.length === 2 && (
            <>
              <Image source={{ uri: postImage[0] }} style={styles.halfImage} />
              <Image source={{ uri: postImage[1] }} style={styles.halfImage} />
            </>
          )}
        </RowComponent>

        <RowComponent styles={styles.interact_post}>
          <ButtonIcon name="heart-outline" />
          <ButtonIcon name="chatbox-outline" />
        </RowComponent>
      </RowComponent>
    );
  };
  const leftColumn = [];
  const rightColumn = [];

  posts?.forEach((item, index) => {
    if (index % 2 === 0) {
      leftColumn.push(item);
    } else {
      rightColumn.push(item);
    }
  });

  return (
    <View style={styles.container}>
      <HeaderComponent
        title="PHONG TRO"
        onPressRight={() => {
          onPressRight();
        }}
        onPressLeft={() => {
          onPressLeft();
        }}
        iconLeft="heart-outline"
        iconRight="search"
        masterScreen={true}
      />
      <ScrollView style={styles.feed}>
        <View style={styles.banner}>
          <Image
            style={{ borderRadius: 15 }}
            width="100%" height="100%"
            source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/map-service-1dada.appspot.com/o/phongtro%2Fbasauimg3.jpg?alt=media&token=744f6884-674f-47b2-9d1e-6afcf3ece32f' }} />
        </View>
        <Space height={20} />
        <View style={styles.categories} >
          <TouchableOpacity onPress={() => navigation.navigate(NAVIGATION_NAME.MY_ROOM_SCREEN)} style={styles.itemCategory}>
            {/* <IconStyles iconSet={'FontAwesome6'} name={ICON_TYPE.ICON_MY_ROOM} color={COLOR.PRIMARY} /> */}
            <Image style={styles.iconImage} source={require('../../assets/images/categories_my_room.png')} />
            <TextComponent size={13} text={`Phòng tôi`} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate(NAVIGATION_NAME.SHARE_ROOM_SCREEN)} style={styles.itemCategory}>
            {/* <IconStyles iconSet={'FontAwesome6'} name={ICON_TYPE.ICON_ROOM_MANAGER} color={COLOR.PRIMARY} /> */}
            <Image style={styles.iconImage} source={require('../../assets/images/categories_add_person.png')} />
            <TextComponent size={13} text={`Ghép phòng`} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate(NAVIGATION_NAME.FAVOURITE_SCREEN)} style={styles.itemCategory}>
            {/* <IconStyles iconSet={'FontAwesome6'} name={ICON_TYPE.ICON_SHARE_ROOM} color={COLOR.PRIMARY} /> */}
            <Image style={styles.iconImage} source={require('../../assets/images/categories_heart.png')} />
            <TextComponent size={13} text={`Yêu thích`} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate(NAVIGATION_NAME.REGISTER_ROOM_SCREEN)} style={styles.itemCategory}>
            {/* <IconStyles iconSet={'FontAwesome6'} name={ICON_TYPE.ICON_REGISTER_ROOM} color={COLOR.PRIMARY} /> */}
            <Image style={styles.iconImage} source={require('../../assets/images/categories_register_room.png')} />
            <TextComponent size={13} text={`Đăng kí phòng`} />
          </TouchableOpacity>
        </View>
        <Space height={20} />
        <TextComponent size={18} text={`Khám phá `} />
        <Space height={10} />

        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={{ width: '48%' }}>
            {leftColumn.map(item => (
              <ExploreComponent
                key={item.id}
                id={item.id}
                item={item}
                handleSelectImg={handleSelectImg}
              />
            ))}
          </View>

          <View style={{ width: '48%' }}>
            {rightColumn.map(item => (
              <ExploreComponent
                key={item.id}
                id={item.id}
                item={item}
                handleSelectImg={handleSelectImg}
              />
            ))}
          </View>
        </View>

        <Space height={100} />
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.WHITE,
    flex: 1,
    paddingHorizontal: 10,
  },
  feed: {
  },
  banner: {
    height: 140,
    backgroundColor: COLOR.GRAY3,
    borderRadius: 15,
    marginHorizontal: 10,
  },
  categories: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  itemCategory: {
    height: 70,
    padding: 5,
    justifyContent: 'space-between',
    alignItems: "center"
  },
  iconImage: {
    width: 50,
    height: 50
  }
});
