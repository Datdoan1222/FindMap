import React, {useRef} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Animated,
  StyleSheet,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {formatPrice} from '../../utill/formatPrice';
import IconStyles from '../../constants/IconStyle';
import {ICON_TYPE} from '../../constants/iconConstants';
import {COLOR} from '../../constants/colorConstants';
import TextComponent from '../atoms/TextComponent';
import RowComponent from '../atoms/RowComponent';
import Space from '../atoms/Space';
import {toPrice} from '../../utill/toPrice';

const ItemCard = ({
  iconDelete = ICON_TYPE.DELETE,
  item,
  swipeableRefs,
  onPress,
  onDelete,
  width = '100%', // Thêm prop width với giá trị mặc định
  height = 'auto', // Thêm prop height với giá trị mặc định
  imageSize = 80, // Thêm prop để tùy biến kích thước ảnh
  swipeEnabled = true,
  styleDesgin,
}) => {
  // --- Right Actions (Xóa) ---
  const renderRightActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [-100, -50, 0],
      outputRange: [0, 50, 100],
      extrapolate: 'clamp',
    });

    const scale = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    return (
      <View style={styles.rightActionsContainer}>
        <Animated.View
          style={[
            styles.rightActionWrapper,
            {transform: [{translateX: trans}, {scale}]},
          ]}>
          <TouchableOpacity
            style={styles.rightAction}
            onPress={() => onDelete?.(item.id)}>
            <IconStyles name={iconDelete} color={COLOR.WHITE} size={20} />
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  const isValidImageUrl = url =>
    url && (url.startsWith('http://') || url.startsWith('https://'));

  const renderExtra = () => {
    return (
      <RowComponent>
        {item.status ? (
          <View style={styles.statusBadge}>
            <TextComponent
              text="Còn trống"
              size={10}
              color={COLOR.WHITE}
              font="Roboto-Medium"
            />
          </View>
        ) : (
          <View style={[styles.statusBadge, {backgroundColor: COLOR.GRAY4}]}>
            <TextComponent
              text="Đã thuê"
              size={10}
              color={COLOR.WHITE}
              font="Roboto-Medium"
            />
          </View>
        )}
      </RowComponent>
    );
  };

  // Tạo style động cho container
  const containerStyle = {
    ...styles.itemContainer,
    width: width,
    ...(height !== 'auto' && {height: height}),
  };

  // Tạo style động cho ảnh
  const imageStyle = {
    width: imageSize,
    height: imageSize,
    borderRadius: 12,
    overflow: 'hidden',
  };

  return (
    <Swipeable
      enabled={swipeEnabled}
      ref={ref => {
        if (ref) {
          swipeableRefs.current[item.id] = ref;
        }
      }}
      renderRightActions={renderRightActions}
      overshootRight={false}
      overshootLeft={false}
      friction={2}
      leftThreshold={30}
      rightThreshold={40}
      onSwipeableWillOpen={() => {
        Object.keys(swipeableRefs.current).forEach(key => {
          if (key !== item.id && swipeableRefs.current[key]) {
            swipeableRefs.current[key].close();
          }
        });
      }}>
      <TouchableOpacity
        style={[containerStyle, styleDesgin ?? {styleDesgin}]}
        onPress={() => onPress?.(item)}
        activeOpacity={0.8}>
        <RowComponent styles={styles.itemContent}>
          {/* Image */}
          <View style={imageStyle}>
            {item.images?.length > 0 && isValidImageUrl(item.images[0]) ? (
              <Image
                source={{uri: item.images[0]}}
                style={[
                  styles.itemImage,
                  {width: imageSize, height: imageSize},
                ]}
                resizeMode="cover"
              />
            ) : (
              <View
                style={[
                  styles.defaultImage,
                  {width: imageSize, height: imageSize},
                ]}>
                <Image
                  source={require('../../assets/images/blank_banner.png')}
                  style={[
                    styles.itemImage,
                    {width: imageSize, height: imageSize},
                  ]}
                  resizeMode="cover"
                />
              </View>
            )}
          </View>
          <Space width={10} />
          {/* Info */}
          <RowComponent
            flexDirection="column"
            alignItems="flex-start"
            styles={[styles.infoContainer, {height: imageSize}]}>
            <TextComponent
              text={item.title}
              font="Roboto-Bold"
              numberOfLines={1}
              size={16}
            />
            <Space height={4} />
            {item.address && (
              <TextComponent
                text={item.address}
                size={12}
                color={COLOR.GRAY3}
                numberOfLines={2}
              />
            )}
            <Space height={4} />
            {item.price && (
              <View style={styles.priceRow}>
                <TextComponent
                  text={`${toPrice(item.price)} đ`}
                  font="Roboto-Bold"
                  color={COLOR.DANGER}
                  size={16}
                  styles={{fontWeight: 'bold'}}
                />
              </View>
            )}
            {/* Render thêm nếu cần */}
          </RowComponent>
          {renderExtra()}
        </RowComponent>
      </TouchableOpacity>
    </Swipeable>
  );
};

export default ItemCard;

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: COLOR.BACKGROUND,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  itemContent: {
    padding: 16,
    alignItems: 'flex-start',
  },
  rightActionsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 20,
  },
  rightActionWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightAction: {
    backgroundColor: COLOR.FAIL,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  itemImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  defaultImage: {
    backgroundColor: COLOR.GRAY1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  statusBadge: {
    backgroundColor: '#2ECC71',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
});
