import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import HeaderComponent from '../../component/molecules/HeaderComponent';
import {NAVIGATION_NAME} from '../../constants/navigtionConstants';
import {SafeAreaView} from 'react-native-safe-area-context';
import RowComponent from '../../component/atoms/RowComponent';
import TextComponent from '../../component/atoms/TextComponent';
import {USER_ID} from '../../constants/envConstants';
import {useUser} from '../../hooks/useGetInforUser';
const dummyChats = [
  {
    id: '1',
    name: 'chutrrone',
    avatar:
      'https://firebasestorage.googleapis.com/v0/b/map-service-1dada.appspot.com/o/phongtro%2F1759397715208_0.jpg?alt=media&token=43cecedd-2133-4a9c-b72c-64a03f1b4e1a',
    lastMessage: 'hello',
    time: '10:45',
  },
  {
    id: '2',
    name: 'anhdat',
    avatar: 'https://i.pravatar.cc/150?img=2',
    lastMessage: 'hello',
    time: '09:20',
  },
];
const dummyUsers = [
  {
    id: '101',
    name: 'An',
    avatar: 'https://i.pravatar.cc/150?img=4',
  },
  {
    id: '102',
    name: 'Bình',
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: '103',
    name: 'Chi',
    avatar: 'https://i.pravatar.cc/150?img=6',
  },
  {
    id: '104',
    name: 'Dũng',
    avatar: 'https://i.pravatar.cc/150?img=7',
  },
  {
    id: '105',
    name: 'Em',
    avatar: 'https://i.pravatar.cc/150?img=8',
  },
];

const MessengerScreen = () => {
  const navigation = useNavigation();
  const {data: dataUser, isLoading, error} = useUser(USER_ID);

  const renderUserItem = ({item}) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() =>
        navigation.navigate(NAVIGATION_NAME.MESSENGER_DETAIL_SCREEN, {
          user: item,
        })
      }>
      <Image source={{uri: item.avatar}} style={styles.userAvatar} />
      <Text style={styles.userName} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderChatItem = ({item}) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() =>
        navigation.navigate(NAVIGATION_NAME.MESSENGER_DETAIL_SCREEN, {
          params: {dataUser: dataUser},
        })
      }>
      <Image source={{uri: item.avatar}} style={styles.avatar} />
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <HeaderComponent
        title={'Tin nhắn'}
        onPressLeft={() => navigation.goBack()}
      />
      {/* <View style={styles.userListContainer}>
        <FlatList
          data={dummyUsers}
          keyExtractor={item => item.id}
          renderItem={renderUserItem}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View> */}
      <RowComponent
        styles={{
          padding: 10,
        }}>
        <TextComponent
          text={'Tất cả các tin nhắn'}
          styles={{fontWeight: 'bold'}}
          size={17}
        />
      </RowComponent>
      <FlatList
        data={dummyChats}
        keyExtractor={item => item.id}
        renderItem={renderChatItem}
      />
    </SafeAreaView>
  );
};

export default MessengerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  userListContainer: {
    paddingVertical: 10,
    paddingLeft: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  userItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 60,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  userName: {
    marginTop: 4,
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
  },
  chatItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  lastMessage: {
    color: '#666',
    marginTop: 2,
  },
});
