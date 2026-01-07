import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useMemo} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {countriesAPI} from '../../utill/api/apiCountries';
import IconStyles from '../../constants/IconStyle';
import {ICON_TYPE} from '../../constants/iconConstants';
import {COLOR} from '../../constants/colorConstants';
import Space from '../../component/atoms/Space';
import userStore from '../../store/userStore';
import {useNavigation} from '@react-navigation/native';
const normalizeText = text =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const CurrentAddressScreen = () => {
  const {setCurrentLocation} = userStore();
  const navigation = useNavigation();

  const [search, setSearch] = useState('');

  const handleUpdateName = item => {
    let rawName = item?.name;
    let cleanedName = rawName.replace(/^Tỉnh\s+|^Thành phố\s+/i, '').trim();
    setCurrentLocation({
      parentNew: cleanedName,
    });

    Alert.alert(
      'Thành công',
      'Cập nhật vị trí thành công!',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ],
      {cancelable: false},
    );
  };

  // 👉 Dữ liệu lọc theo search
  const filteredData = useMemo(() => {
    if (!search.trim()) return countriesAPI;
    return countriesAPI.filter(item =>
      normalizeText(item.name).includes(normalizeText(search)),
    );
  }, [search]);

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => handleUpdateName(item)}
      style={styles.item}>
      <IconStyles
        iconSet={'MaterialIcons'}
        name={ICON_TYPE.ICON_LOCATION}
        color={COLOR.PRIMARY}
        size={20}
      />
      <Space width={10} />
      <Text style={styles.name}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Ô tìm kiếm */}
      <TextInput
        style={styles.searchInput}
        placeholder="🔍 Tìm kiếm tỉnh/thành..."
        value={search}
        onChangeText={setSearch}
      />

      {/* Danh sách */}
      <FlatList
        data={filteredData}
        keyExtractor={(item, index) => `${item.code}-${index}`}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
};

export default CurrentAddressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    padding: 10,
  },
  searchInput: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#DDD',
    fontSize: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFF',
    borderRadius: 8,
  },
  name: {
    flex: 1,
    fontSize: 16,
    color: COLOR.BLACK1,
  },
  separator: {
    height: 8,
  },
});
