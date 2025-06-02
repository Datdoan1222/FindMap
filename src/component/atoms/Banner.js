import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
const urlimg =
  'https://firebasestorage.googleapis.com/v0/b/map-service-1dada.appspot.com/o/phongtro%2Fbasauimg3.jpg?alt=media&token=744f6884-674f-47b2-9d1e-6afcf3ece32f';
const {width: widthScreen} = Dimensions.get('window');
const bannerWidth = widthScreen * 0.92;
const bannerHeight = (widthScreen - 68) / 2.34;
const Banner = ({data, onPress}) => {

  return (
    <View style={styles.banner}>
      {/* <Image
        style={{borderRadius: 15}}
        width="100%"
        height="100%"
        source={{
          uri: 'https://firebasestorage.googleapis.com/v0/b/map-service-1dada.appspot.com/o/phongtro%2Fbasauimg3.jpg?alt=media&token=744f6884-674f-47b2-9d1e-6afcf3ece32f',
        }}
      /> */}
      <Carousel
        data={data}
        sliderWidth={bannerWidth}
        itemWidth={bannerWidth}
        width={widthScreen}
        height={bannerWidth / 2}
        autoPlay
        autoPlayInterval={3000}
        renderItem={({item, index}) => (
          <TouchableOpacity
            key={item?.id || index}
            style={styles.bannerContai}
            onPress={() => onPress(item)}>
            <Image
              style={[styles.bannerItem, {width: bannerWidth}]}
              resizeMode="cover"
              source={{
                uri: item?.images?.[0] || urlimg,
              }}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Banner;

const styles = StyleSheet.create({
  banner: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: bannerHeight,
    borderRadius: 15,
    overflow: 'hidden',
    zIndex: 99,
  },
  bannerContai: {
    alignItems: 'center',
  },
  bannerItem: {
    width: bannerWidth,
    height: bannerHeight,
    borderRadius: 15,
  },
});
