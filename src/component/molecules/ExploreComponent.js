import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import TextComponent from '../atoms/TextComponent';
import IconStyles from '../../constants/IconStyle';
import { COLOR } from '../../constants/colorConstants';

const { width, height } = Dimensions.get('window');

const ExploreComponent = ({ key, id, item, handleSelectImg, typeImg }) => {
  const [uri, setUri] = useState(item?.images[0]);
  const [viewSize, setViewSize] = useState({ width: 0, height: 0 });
  const maxWidth = width;
  useEffect(() => {
    if (uri) {
      Image.getSize(
        uri,
        (imgWidth, imgHeight) => {
          // Tính tỉ lệ ảnh so với maxWidth
          const scaleFactor = maxWidth / imgWidth;
          const newHeight = imgHeight * scaleFactor;

          setViewSize({
            width: maxWidth / 2 - 20,
            height: newHeight,
          });
        },
        error => {
          console.log('Error loading image size:', error);
        },
      );
    }
  }, [uri]);
  if (!item) {
    return <TextComponent text={'Không có phòng nào gần đây'} /> // Hoặc trả về một thành phần khác nếu không có ảnh nào
  }
  return (
    <TouchableOpacity onPress={() => handleSelectImg(item)}>
      <View
        key={id}
        style={{
          borderRadius: 15,
          width: viewSize.width,
          height: viewSize.height,
          overflow: 'hidden',
          // margin: 10,
          marginVertical: 10,
        }}>
        {uri ? (
          <Image
            source={{ uri }}
            style={{
              width: '100%',
              height: '100%',
              //   resizeMode: 'contain', // hoặc 'cover' nếu bạn muốn ảnh lấp đầy
            }}
          />
        ) : (
          <View style={{
            width: '100%',
            height: '100%',
            backgroundColor: COLOR.GRAY3,
            justifyContent: 'center',
            alignItems: 'center',
          }} >
            <IconStyles name='image-inverted' iconSet='Entypo' color={COLOR.GRAY2} size={50} />
          </View>
        )}
      </View>
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={{ color: COLOR.BLACK2 }}>
        <IconStyles name={'location-sharp'} size={20} color={COLOR.BLACK2} />
        {item.nameLocation}
      </Text>
    </TouchableOpacity>
  );
};

export default ExploreComponent;

const styles = StyleSheet.create({});
