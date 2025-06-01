import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useRoute} from '@react-navigation/native';
import Carousel from 'react-native-reanimated-carousel';
import Space from '../component/atoms/Space';
import {COLOR} from '../constants/colorConstants';
import TextComponent from '../component/atoms/TextComponent';
import RowComponent from '../component/atoms/RowComponent';
import IconStyles from '../constants/IconStyle';
import {ICON_TYPE} from '../constants/iconConstants';
import ButtonIcon from '../component/atoms/ButtonIcon';
const currentUserId = '1';
const {width: widthScreen} = Dimensions.get('window');
const bannerWidth = widthScreen * 0.92;
const bannerHeight = (widthScreen - 68) / 2.34;
const FavouriteScreen = () => {
  const route = useRoute();
  const {item} = route.params;
  const [selectedRoom, setSelectedRoom] = useState(null);

  //   const likedRooms = item.filter(
  //     room => room.likes && room.likes[currentUserId],
  //   );
  const likedRooms = item.filter(room => room.likes);
  const renderItem = ({item}) => (
    <TouchableOpacity onPress={() => setSelectedRoom(item)} style={styles.card}>
      <Image source={{uri: item.images[0]}} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.name}</Text>
        <Text>{item.nameLocation}</Text>
        <RowComponent justify="space-between">
          <Text style={styles.price}>Giá: {item.price}.000đ</Text>
          <ButtonIcon name={'heart'} size={20} color={COLOR.ERROR} />
        </RowComponent>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={likedRooms}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />

      {/* Modal chi tiết */}
      {selectedRoom && (
        <Modal
          visible={true}
          animationType="slide"
          onRequestClose={() => setSelectedRoom(null)}>
          <View style={styles.modalContainer}>
            <View style={styles.bannerContainer}>
              <Carousel
                data={selectedRoom.images}
                sliderWidth={bannerWidth}
                itemWidth={bannerWidth}
                width={widthScreen}
                height={bannerWidth / 2}
                autoPlay
                autoPlayInterval={3000}
                renderItem={({item, index}) => (
                  <TouchableOpacity style={styles.bannerContai}>
                    <Image
                      style={[styles.bannerItem, {width: bannerWidth}]}
                      resizeMode="cover"
                      source={{
                        uri: item,
                      }}
                    />
                  </TouchableOpacity>
                )}
              />
            </View>
            <Space height={10} />
            <View style={styles.content}>
              <RowComponent
                flexDirection="column"
                alignItems="flex-start"
                styles={{
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                  backgroundColor: COLOR.WHITE,
                }}>
                <TextComponent
                  size={15}
                  styles={{fontWeight: 'bold'}}
                  color={COLOR.BLACK1}
                  text={'Nhà/ Phòng trọ'}
                />
                <TextComponent
                  size={13}
                  styles={{fontStyle: 'italic'}}
                  color={COLOR.BLACK1}
                  text={'Phương án giá rẻ bao gồm'}
                />
                <RowComponent
                  flexDirection="row"
                  alignItems="center"
                  justify="space-between"
                  styles={{
                    paddingVertical: 15,
                  }}>
                  <RowComponent>
                    <IconStyles name={ICON_TYPE.ICON_PEOPLE} size={22} />
                    <TextComponent size={13} text={'Tối đa hai người'} />
                  </RowComponent>
                  <Space width={40} />
                  <RowComponent>
                    <IconStyles
                      name={ICON_TYPE.ICON_DOOR}
                      iconSet="FontAwesome6"
                      size={18}
                    />
                    <TextComponent size={13} text={'Có gác'} />
                  </RowComponent>
                </RowComponent>
              </RowComponent>
              <Space height={10} />
              {selectedRoom.amenities && (
                <RowComponent
                  flexDirection="column"
                  alignItems="flex-start"
                  styles={{
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                    backgroundColor: COLOR.WHITE,
                  }}>
                  <TextComponent
                    size={15}
                    styles={{fontWeight: 'bold'}}
                    color={COLOR.BLACK1}
                    text={'Các tiện nghi khác'}
                  />
                  <Space height={10} />
                  {Array.isArray(selectedRoom.amenities) &&
                    selectedRoom.amenities.map((amenity, index) => (
                      <RowComponent
                        key={index}
                        style={{marginBottom: 5, alignItems: 'flex-start'}}>
                        <IconStyles
                          name={'check'}
                          iconSet="Entypo"
                          color={COLOR.SUCCESSFUL}
                          size={20}
                        />
                        <TextComponent
                          size={13}
                          styles={{
                            fontStyle: 'italic',
                            marginLeft: 5,
                            flexShrink: 1,
                          }}
                          color={COLOR.BLACK1}
                          text={amenity}
                          numberOfLines={0}
                        />
                      </RowComponent>
                    ))}
                </RowComponent>
              )}
              <Space height={10} />
              {selectedRoom.description && (
                <RowComponent
                  flexDirection="column"
                  alignItems="flex-start"
                  styles={{
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                    backgroundColor: COLOR.WHITE,
                  }}>
                  <TextComponent
                    size={15}
                    styles={{fontWeight: 'bold'}}
                    color={COLOR.BLACK1}
                    text={'Mô tả'}
                  />
                  <Space height={10} />
                  <TextComponent
                    size={13}
                    numberOfLines={5}
                    styles={{fontStyle: 'italic', marginLeft: 5}}
                    color={COLOR.BLACK1}
                    text={selectedRoom.description}
                  />
                </RowComponent>
              )}
              <TouchableOpacity
                onPress={() => setSelectedRoom(null)}
                style={styles.closeButton}>
                <Text style={{color: 'white'}}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default FavouriteScreen;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 6,
    marginRight: 10,
  },
  content: {
    // flex: 1,
    padding: 15,
    height: '100%',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLOR.BLACK1,
  },
  price: {
    color: 'green',
    marginTop: 4,
  },
  modalContainer: {
    marginTop: 60,
    backgroundColor: 'white',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: COLOR.BLACK1,
  },
  modalImage: {
    width: 300,
    height: 200,
    borderRadius: 10,
    marginRight: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: COLOR.PRIMARY,
    alignItems: 'center',
    borderRadius: 8,
  },
  bannerContainer: {
    height: bannerHeight,
    justifyContent: 'center',
    alignItems: 'center',
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
