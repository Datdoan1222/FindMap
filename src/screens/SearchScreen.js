import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import React, {useState, useCallback, useRef, useEffect} from 'react';
import HeaderComponent from '../component/molecules/HeaderComponent';
import {COLOR} from '../constants/colorConstants';
import RowComponent from '../component/atoms/RowComponent';
import TextComponent from '../component/atoms/TextComponent';
import Space from '../component/atoms/Space';
import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler';
import IconStyles from '../constants/IconStyle';
import {ICON_TYPE} from '../constants/iconConstants';
import {useNavigation} from '@react-navigation/native';
import ButtonIcon from '../component/atoms/ButtonIcon';
import {NAVIGATION_NAME} from '../constants/navigtionConstants';

// Sample data for the FlatList (replace with your actual data)
const sampleData = [
  {
    id: '1',
    title: 'Phòng trọ 1',
    address: '97 Man Thiện, Hiệp Phú, Thủ Đức, Hồ Chí Minh 70000, Việt Nam',
  },
  {id: '2', title: 'Phòng trọ 2', address: '456 Đường XYZ, Quận Y'},
  {
    id: '3',
    title: 'Phòng trọ 3',
    address: '19 Nguyễn Hữu Thọ, Tân Phong, Quận 7, Hồ Chí Minh, Việt Nam',
  },
];

const SearchScreen = () => {
  const navigation = useNavigation();
  const [data, setData] = useState(sampleData);
  const [searchText, setSearchText] = useState('');
  const [itemWidth, setItemWidth] = useState(0);
  const flatListRef = useRef(null); // Create a ref for the FlatList

  useEffect(() => {
    // Calculate item width when the component mounts
    const {width} = Dimensions.get('window');
    setItemWidth(width - 40); // Subtract paddingHorizontal (20 * 2)
  }, []);
  const handleSearch = text => {
    setSearchText(text);
    const filteredData = sampleData.filter(
      item =>
        item.title.toLowerCase().includes(text.toLowerCase()) ||
        item.address.toLowerCase().includes(text.toLowerCase()),
    );
    setData(filteredData);
  };

  const handleDelete = useCallback(
    itemId => {
      Alert.alert(
        'Xác nhận xóa',
        'Bạn có chắc chắn muốn xóa phòng trọ này?',
        [
          {
            text: 'Hủy',
            style: 'cancel',
          },
          {
            text: 'Xóa',
            onPress: () => {
              setData(prevData => prevData.filter(item => item.id !== itemId));
            },
          },
        ],
        {cancelable: false},
      );
    },
    [setData],
  );

  const renderRightActions = (progress, dragX, item) => {
    const maxSwipe = itemWidth * 0.3;
    console.log('====================================');
    console.log('dragX', dragX);
    console.log('====================================');
    return (
      <View style={{width: maxSwipe, justifyContent: 'center'}}>
        <TouchableOpacity
          style={styles.rightAction}
          onPress={() => handleDelete(item.id)}>
          <IconStyles name={ICON_TYPE.DELETE} color={COLOR.WHITE} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderItem = ({item}) => {
    const deleteThreshold = itemWidth / 3;
    return (
      <Swipeable
        renderRightActions={(progress, dragX) =>
          renderRightActions(progress, dragX, item)
        }
        overshootRight={false}
        friction={2} // Giảm tốc độ vuốt
        rightThreshold={deleteThreshold} // Nếu vuốt quá 50% chiều rộng thì xóa luôn
        onSwipeableRightOpen={() => handleDelete(item.id)} // Tự động xóa nếu vuốt hết
      >
        <RowComponent styles={styles.itemContainer}>
          <View style={styles.imagePlaceholder} />
          <Space width={10} />
          <RowComponent
            flexDirection="column"
            alignItems="flex-start"
            styles={styles.infoContainer}>
            <TextComponent text={item.title} font="Roboto-Bold" />
            <TextComponent text={item.address} size={12} color={COLOR.GRAY3} />
          </RowComponent>
        </RowComponent>
      </Swipeable>
    );
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={styles.container}>
        <HeaderComponent
          search
          onChangeText={handleSearch}
          value={searchText}
          // onPressRight={() => {}}
          onPressLeft={() => navigation.navigate(NAVIGATION_NAME.HOME_SCREEN)}
        />
        <FlatList
          ref={flatListRef}
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.flatListContent}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <TextComponent text="Không có kết quả tìm kiếm" />
            </View>
          )}
          onLayout={event => {
            // Calculate item width when the FlatList is laid out
            const {width} = event.nativeEvent.layout;
            setItemWidth(width - 40); // Subtract paddingHorizontal (20 * 2)
          }}
        />
      </View>
    </GestureHandlerRootView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.WHITE,
    flex: 1,
  },
  flatListContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  itemContainer: {
    backgroundColor: COLOR.BACKGROUND,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: COLOR.GRAY1,
    borderRadius: 10,
  },
  infoContainer: {
    flex: 1,
    height: '100%',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightAction: {
    backgroundColor: COLOR.FAIL,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
});
