import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {countriesAPI} from '../../utill/api/apiCountries';
import IconStyles from '../../constants/IconStyle';
import {ICON_TYPE} from '../../constants/iconConstants';
import {COLOR} from '../../constants/colorConstants';
import Space from '../../component/atoms/Space';
import userStore from '../../store/userStore';
import {useNavigation} from '@react-navigation/native';

const CurrentAddressScreen = () => {
  const {setCurrentLocation} = userStore();
  const navigation = useNavigation();
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
  const renderItem = ({item}) => (
    <TouchableOpacity
      key={item.code}
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
    <SafeAreaView>
      <FlatList
        data={countriesAPI}
        keyExtractor={item => item.code}
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
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFF',
    borderRadius: 8,
  },
  code: {
    fontWeight: 'bold',
    color: COLOR.PRIMARY,
    width: 50,
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
