import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import RowComponent from '../atoms/RowComponent';
import TextComponent from '../atoms/TextComponent';
import { COLOR } from '../../constants/colorConstants';
import ButtonIcon from '../atoms/ButtonIcon';
import IconStyles from '../../constants/IconStyle';
import { ICON_TYPE } from '../../constants/iconConstants';
import { getFormattedTime } from '../../utill/time';
import { updateOwnerLikeStatus } from '../../redux/ownersSlide';
import { useDispatch, useSelector } from 'react-redux';
import { toggleLike } from '../../redux/postsSlide';
import auth from '@react-native-firebase/auth';
import Modal from './Modal';

const PostComponent = ({ id, item, handleSelectImg, typeImg }) => {
  const dispatch = useDispatch();
  const [isToggleLike, setIsToggleLike] = useState(false);
  const userImage = item?.user?.imageUser; // Example: Safely access nested data
  const userName = item?.user?.nameUser || 'Unknown User'; // Example: Provide fallback
  const postImage = item?.images; // Example: Get post image URI
  const userAddress = item?.user?.addressUser;
  const statusText = item?.statusText;
  const numberLikes = item?.likes ? Object.keys(item.likes).length : '';
  const [isHeart, setIsHeart] = useState(false);

  const userid = auth().currentUser?.uid;
  const isExistAndTrue = item?.likes[userid] === true;
  useEffect(() => {
    if (isExistAndTrue) {
      setIsHeart(true);
    } else {
      setIsHeart(false);
    }
  }, []);
  const handleSelectHeart = () => {
    setIsHeart(!isHeart);
    const id = item?.id;
    if (userid) {
      dispatch(toggleLike({ postId: id, userId: userid }));
    } else {
      setIsToggleLike(true);
    }
  };
  const ImagePost = () => {
    return (
      <RowComponent
        styles={styles.content_post}
        onPress={() => handleSelectImg(item)}>
        {postImage?.length === 3 && (
          <>
            <Image source={{ uri: postImage[0] }} style={styles.leftLargeImage} />
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
            <Image source={{ uri: postImage[0] }} style={styles.leftLargeImage} />
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
    );
  };
  const ImageDetailPost = () => {
    return (
      <ScrollView>
        <RowComponent
          styles={styles.content_post}
        // onPress={() => handleSelectImg(item)}
        >
          {postImage?.map((item, index) => (
            <Image
              source={{ uri: item }}
              //   style={styles.fullImage}
              height={400}
              width="100%"
            />
          ))}
        </RowComponent>
      </ScrollView>
    );
  };
  return (
    <RowComponent
      key={id}
      flexDirection="column"
      alignItems="flex-start"
      styles={styles.post_container}>
      <Modal
        isVisible={isToggleLike}
        onRequestClose={() => setIsToggleLike(false)}
        onDismiss={() => setIsToggleLike(false)}
        title="Thích bài viết"
        message="Bạn đã thích bài viết này"
        iconName="heart"
        iconColor={COLOR.ERROR}
      />
      <RowComponent
        flexDirection="row"
        alignItems="center"
        justify="space-between"
        styles={styles.header_post}>
        <RowComponent
          alignItems="center"
          justify="center"
          styles={styles.imgUser_post}>
          {userImage ? (
            <Image
              source={{
                uri: userImage,
              }}
              style={styles.imgUser_post}
            />
          ) : (
            <IconStyles
              name={ICON_TYPE.ICON_ACCOUNT}
              color={COLOR.GRAY3}
              size={26}
            />
          )}
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
        <RowComponent
          alignItems="flex-end"
          justify="flex-end"
          styles={styles.time_post}>
          <TextComponent
            size={12}
            text={getFormattedTime(item?.createdAt)}
            color={COLOR.GRAY3}
          />
        </RowComponent>
      </RowComponent>
      <RowComponent styles={styles.header_post}>
        <TextComponent size={13} text={statusText} />
      </RowComponent>

      {/* ảnh hiển thị */}
      {typeImg === 'detail' ? <ImageDetailPost /> : <ImagePost />}
      <RowComponent styles={styles.interact_post}>
        <RowComponent
          // styles={{backgroundColor: 'red'}}
          flexDirection="row"
          justify="center"
          alignItems="center">
          <ButtonIcon
            name={isHeart ? 'heart' : 'heart-outline'}
            color={isHeart ? COLOR.ERROR : COLOR.BLACK1}
            onPress={handleSelectHeart}
          />
          <TextComponent
            styles={{ paddingBottom: 3 }}
            text={numberLikes}
            color={COLOR.BLACK1}
            size={18}
          />
        </RowComponent>
        <ButtonIcon name="chatbox-outline" />
      </RowComponent>
    </RowComponent>
  );
};

export default PostComponent;

const styles = StyleSheet.create({
  post_container: {
    // borderColor: COLOR.BLACK1,
    // borderWidth: 1,
    // margin: 10,
    // padding: 10,
    // borderRadius: 15,
  },
  header_post: {
    padding: 10,
    backgroundColor: COLOR.WHITE,
    width: '100%',
  },
  imgUser_post: {
    width: 40,
    height: 50,
    borderRadius: 100,
    backgroundColor: COLOR.GRAY1,
    flex: 1,
  },
  nameUser_post: {
    marginHorizontal: 10,
    paddingHorizontal: 10,
    flex: 5,
  },
  time_post: {
    flex: 2,
  },
  content_post: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },

  fullImage: {
    width: '100%',
    height: 250,
    // borderRadius: 10,
  },

  halfImage: {
    width: '48%',
    height: 200,
    // borderRadius: 10,
  },

  leftLargeImage: {
    width: '51%',
    height: 255,
    // borderRadius: 10,
  },

  rightSmallImages: {
    width: '48%',
    justifyContent: 'space-between',
  },

  smallImage: {
    width: '100%',
    height: 125,
    // borderRadius: 10,
    // marginBottom: 6,
    position: 'relative',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },

  overlayText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },

  text_userName: {
    color: COLOR.TEXT,
  },
  text_userAddress: {
    color: COLOR.GRAY3,
  },
  interact_post: {},
});
