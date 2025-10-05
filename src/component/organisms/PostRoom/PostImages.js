import React, {useState} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
const urlimg =
  'https://firebasestorage.googleapis.com/v0/b/map-service-1dada.appspot.com/o/phongtro%2Fbasauimg3.jpg?alt=media&token=744f6884-674f-47b2-9d1e-6afcf3ece32f';
const {width: widthScreen} = Dimensions.get('window');
const bannerWidth = widthScreen * 0.92;
const bannerHeight = (widthScreen - 68) / 2.34;
const PostImages = ({
  data,
  onPress,
  height = (widthScreen - 68) / 2.34,
  isAutoPlay = true,
  isDisable = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <View style={[styles.banner]}>
      {data ? (
        <>
          <Carousel
            data={data}
            sliderWidth={bannerWidth}
            itemWidth={bannerWidth}
            width={widthScreen}
            height={height ? height : bannerWidth / 2}
            autoPlay={isAutoPlay}
            autoPlayInterval={3000}
            onSnapToItem={index => setCurrentIndex(index)} // cập nhật index khi swipe
            renderItem={({item, index}) => (
              <TouchableWithoutFeedback
                key={item?.id || index}
                style={styles.bannerContai}
                onPress={() => !isDisable && onPress(item)}>
                <Image
                  style={[
                    styles.bannerItem,
                    {width: widthScreen, height: height},
                  ]}
                  resizeMode="cover"
                  source={{uri: item}}
                />
              </TouchableWithoutFeedback>
            )}
          />

          {/* Dots pagination */}
          <View style={styles.dotsContainer}>
            {data?.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  currentIndex === index ? styles.activeDot : null,
                ]}
              />
            ))}
          </View>
        </>
      ) : (
        <Image
          style={[styles.bannerItem, {width: widthScreen, height: height}]}
          resizeMode="cover"
          source={require('../../../assets/images/blank_banner.png')}
        />
      )}
    </View>
  );
};

export default PostImages;

const styles = StyleSheet.create({
  banner: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderRadius: 15,
    overflow: 'hidden',
    zIndex: 99,
  },
  bannerContai: {
    alignItems: 'center',
  },
  bannerItem: {
    width: bannerWidth,
    borderRadius: 15,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 10,
    width: '100%',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: 'white',
  },
});
