import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import RowComponent from '../../atoms/RowComponent';
import {ICON_TYPE} from '../../../constants/iconConstants';
import {COLOR} from '../../../constants/colorConstants';
import IconStyles from '../../../constants/IconStyle';
import TextComponent from '../../atoms/TextComponent';
import {getFormattedTime} from '../../../utill/time';

const HeaderRoom = ({userImage, userName, userAddress, createdAt}) => {
  return (
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
          text={getFormattedTime(createdAt)}
          color={COLOR.GRAY3}
        />
      </RowComponent>
    </RowComponent>
  );
};

export default HeaderRoom;

const styles = StyleSheet.create({
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
  text_userName: {
    color: COLOR.TEXT,
  },
  text_userAddress: {
    color: COLOR.GRAY3,
  },
});
