import {
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  View,
  Image,
} from 'react-native';
import React, {useEffect} from 'react';
import HeaderComponent from '../../../component/molecules/HeaderComponent';
import {COLOR} from '../../../constants/colorConstants';
import {useNavigation} from '@react-navigation/native';
import {NAVIGATION_NAME} from '../../../constants/navigtionConstants';
import RowComponent from '../../../component/atoms/RowComponent';
import TextComponent from '../../../component/atoms/TextComponent';
import {useSelector, useDispatch} from 'react-redux';
import {fetchPosts} from '../../../redux/postsSlide';
import ButtonIcon from '../../../component/atoms/ButtonIcon';
import PostComponent from '../../../component/molecules/PostComponent';
import auth from '@react-native-firebase/auth';
import Space from '../../../component/atoms/Space';

const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {posts, error, loading} = useSelector(state => state.posts);
  const userid = auth().currentUser.uid;

  useEffect(() => {
    // console.log('post😁😁😁😁😁😁', posts);
    dispatch(fetchPosts());
  }, []);

  if (loading || error) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
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
  const onPressLeft = () => {};
  const ItemPost = ({id, item}) => {
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
              source={{uri: userImage}}
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
                source={{uri: postImage[0]}}
                style={styles.leftLargeImage}
              />
              <View style={styles.rightSmallImages}>
                <Image
                  source={{uri: postImage[1]}}
                  style={[styles.smallImage, {marginBottom: 2}]}
                />
                <Image
                  source={{uri: postImage[2]}}
                  style={[styles.smallImage, {marginTop: 2}]}
                />
              </View>
            </>
          )}

          {postImage?.length >= 4 && (
            <>
              <Image
                source={{uri: postImage[0]}}
                style={styles.leftLargeImage}
              />
              <View style={styles.rightSmallImages}>
                <Image
                  source={{uri: postImage[1]}}
                  style={[styles.smallImage, {marginBottom: 2}]}
                />
                <Image
                  source={{uri: postImage[2]}}
                  style={[styles.smallImage, {marginTop: 2}]}>
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
            <Image source={{uri: postImage[0]}} style={styles.fullImage} />
          )}

          {/* Trường hợp 2 ảnh */}
          {postImage?.length === 2 && (
            <>
              <Image source={{uri: postImage[0]}} style={styles.halfImage} />
              <Image source={{uri: postImage[1]}} style={styles.halfImage} />
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
        <RowComponent styles={{height: 200}}></RowComponent>
        {posts?.map(item => (
          <>
            <PostComponent
              id={item?.id}
              item={item}
              handleSelectImg={handleSelectImg}
            />
            {/* <ItemPost key={item.id} item={item} /> */}
          </>
        ))}
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
  },
  feed: {},
});
