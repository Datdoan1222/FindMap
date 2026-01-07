import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import IconStyles from '../../constants/IconStyle';
import HeaderComponent from '../../component/molecules/HeaderComponent';
import {useNavigation, useRoute} from '@react-navigation/native';
import {COLOR} from '../../constants/colorConstants';
import ButtonIcon from '../../component/atoms/ButtonIcon';
import {ICON_NAME} from '../../constants/iconConstants';

const MessengerDetail = props => {
  const route = useRoute();
  const navigation = useNavigation();
  const dataUser = route.params?.dataUser || props?.dataUser;
  console.log(JSON.stringify(props?.dataUser, null, 2), 'sssssss');

  const [messages, setMessages] = useState([
    {id: '1', text: 'hello', fromMe: false, time: '10:00'},
    {id: '2', text: 'Chào bạn!', fromMe: true, time: '10:01'},
  ]);
  const [input, setInput] = useState('');
  const sendMessage = () => {
    if (input.trim() === '') return;
    const newMessage = {
      id: Date.now().toString(),
      text: input,
      fromMe: true,
      time: new Date().toLocaleTimeString().slice(0, 5),
    };
    setMessages([...messages, newMessage]);
    setInput('');
  };

  const renderItem = ({item}) => (
    <View
      style={[
        styles.messageContainer,
        item.fromMe ? styles.myMessage : styles.theirMessage,
      ]}>
      <Text
        style={[item.fromMe ? styles.myMessageText : styles.theirMessageText]}>
        {item.text}
      </Text>
      <Text style={[item.fromMe ? styles.myTimeText : styles.theirTimeText]}>
        {item.time}
      </Text>
    </View>
  );
  const onPressCall = () => {
    if (dataUser?.phone) Linking.openURL(`tel:${dataUser?.phone}`);
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ios: 'padding', android: undefined})}
      keyboardVerticalOffset={80}>
      {/* <HeaderComponent title={item.name} /> */}
      <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <IconStyles name="arrow-back" size={24} color={COLOR.WHITE} />
          </TouchableOpacity>
          <Image source={{uri: dataUser.avatar}} style={styles.avatar} />
          <Text style={styles.username}>{dataUser.name}</Text>
        </View>
        <ButtonIcon
          iconSet="Entypo"
          name={'phone'}
          size={22}
          color={COLOR.WHITE}
          onPress={onPressCall}
        />
      </View>

      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messageList}
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Nhập tin nhắn..."
          style={styles.input}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <IconStyles name="send" size={20} color={COLOR.WHITE} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default MessengerDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.SECONDARY,
    paddingTop: 50,
  },
  messageList: {
    padding: 10,
  },
  messageContainer: {
    maxWidth: '75%',
    padding: 10,
    borderRadius: 16,
    marginVertical: 4,
    paddingHorizontal: 20,
  },
  myMessage: {
    backgroundColor: COLOR.PRIMARY,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 0,
  },
  theirMessage: {
    backgroundColor: COLOR.WHITE,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 0,
  },
  theirMessageText: {
    color: COLOR.BLACK1,
  },
  myMessageText: {
    color: COLOR.WHITE,
  },
  theirTimeText: {
    fontSize: 10,
    color: COLOR.BLACK1,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  myTimeText: {
    fontSize: 10,
    color: '#eee',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    backgroundColor: COLOR.GRAY1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: COLOR.PRIMARY,
    borderRadius: 20,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLOR.PRIMARY,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginLeft: 12,
  },
  username: {
    marginLeft: 8,
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});
