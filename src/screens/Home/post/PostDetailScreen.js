import {StyleSheet, Text, View} from 'react-native';
import React, {useLayoutEffect} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import PostComponent from '../../../component/molecules/PostComponent';
import RowComponent from '../../../component/atoms/RowComponent';

const PostDetailScreen = () => {
  const route = useRoute();
  const {item} = route.params;
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      title: `Bài viết của ${item?.user?.nameUser}` || 'Chi tiết bài viết',
    });
  }, [navigation, item]);
  return (
    <RowComponent>
      <PostComponent key={item.id} item={item} typeImg="detail" />
    </RowComponent>
  );
};

export default PostDetailScreen;

const styles = StyleSheet.create({});
