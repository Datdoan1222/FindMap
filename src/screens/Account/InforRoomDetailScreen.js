// c:\FindMap\src\screens\Account\InforRoomDetailScreen.js
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList, // Import FlatList
  TouchableOpacity, // Import TouchableOpacity
  ActivityIndicator, // Optional: for loading state
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react'; // Import useCallback
import {useNavigation, useRoute} from '@react-navigation/native';
import RowComponent from '../../component/atoms/RowComponent';
// import Input from '../../component/atoms/Input'; // Not used here currently
import InputComponent from '../../component/atoms/InputComponent';
import Button from '../../component/atoms/Button';
import {BUTTON_SIZE} from '../../constants/buttonConstants';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchOwners,
  selectFilteredOwners,
  setSearchKeyword,
  updateRoomStatus,
} from '../../redux/ownersSlide';
import TextComponent from '../../component/atoms/TextComponent';
import debounce from 'lodash.debounce'; // Import debounce
import {COLOR} from '../../constants/colorConstants'; // Import COLOR
import auth from '@react-native-firebase/auth';
import {NAVIGATION_NAME} from '../../constants/navigtionConstants';
import {updateStatusUser} from '../../redux/usersSlide';

const InforRoomDetailScreen = () => {
  const route = useRoute();
  const {status} = route.params;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  // const user = auth().currentUser;
  const {currentUser} = useSelector(state => state.users);

  // Get owners and loading state from Redux
  const {owners, loading: ownersLoading} = useSelector(
    state => state.ownersData,
  );
  const ownerSearch = useSelector(selectFilteredOwners);
  const [roomID, setRoomID] = useState('');
  const [roomPass, setRoomPass] = useState('');
  const [roomPassConfirm, setRoomPassConfirm] = useState(null);
  const [roomIDConfirm, setRoomIDConfirm] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false); // Control suggestion visibility

  // Fetch owners on mount
  useEffect(() => {
    dispatch(fetchOwners());
  }, [dispatch]); // Add dispatch to dependency array

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(text => {
      dispatch(setSearchKeyword(text));
      setShowSuggestions(text.length > 0); // Show suggestions if input is not empty
    }, 300), // Wait 300ms after user stops typing
    [dispatch], // Dependency for useCallback
  );

  // Handle input change
  const handleRoomIdChange = text => {
    setRoomID(text);
    debouncedSearch(text);
  };

  // Handle suggestion selection
  const handleSelectSuggestion = owner => {
    setRoomIDConfirm(owner.id);
    setRoomID(owner.nameOwner);
    dispatch(setSearchKeyword(owner.id));
    setShowSuggestions(false);
    console.log('Selected Owner:', owner.id);
  };

  // Handle final confirmation (if needed)
  const handleConfirm = () => {
    // Find the exact match based on the current roomID
    const selectedOwner = ownerSearch.find(owner => owner.nameOwner === roomID);
    const foundRoomEntry = Object.entries(selectedOwner?.rooms || {}).find(
      ([key, room]) => room.password === roomPass,
    );
    if (foundRoomEntry) {
      const [roomKey, roomData] = foundRoomEntry;

      console.log('====================================');
      console.log(roomData.status, selectedOwner, roomKey);
      console.log('====================================');

      if (!roomData.status) {
        console.log('Đăng ký thành công:');
        dispatch(
          updateRoomStatus(selectedOwner.id, roomKey, true, currentUser?.id),
        );
        dispatch(updateStatusUser(currentUser.id, true));
        navigation.navigate(NAVIGATION_NAME.ACCOUNT_SCREEN, {});
      } else {
        console.log('❗Phòng này đã được đăng ký.');
      }
    } else {
      console.log('❌ Mật khẩu không hợp lệ');
    }
  };

  // Render item for suggestion list
  const renderSuggestionItem = ({item}) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSelectSuggestion(item)}>
      <TextComponent text={`ID: ${item.id} - Chủ: ${item.nameOwner}`} />
      {/* Add more details if needed */}
    </TouchableOpacity>
  );

  if (!status) {
    return (
      <View style={styles.formContainer}>
        <InputComponent
          placeholder="Nhập ID phòng..."
          value={roomID}
          onChangeText={handleRoomIdChange}
          onFocus={() => roomID.length > 0 && setShowSuggestions(true)}
          // onBlur={() => setTimeout(() => setShowSuggestions(false), 150)} // Hide suggestions on blur (with delay) - Be careful with onPress timing
        />

        {/* Suggestion List */}
        {showSuggestions && (
          <View style={styles.suggestionsContainer}>
            {ownersLoading ? (
              <ActivityIndicator color={COLOR.PRIMARY} />
            ) : ownerSearch.length > 0 ? (
              <FlatList
                data={ownerSearch}
                renderItem={renderSuggestionItem}
                keyExtractor={item => item.id.toString()}
                style={styles.suggestionList}
                keyboardShouldPersistTaps="handled"
              />
            ) : (
              <TextComponent
                styles={styles.noSuggestionsText}
                text="Không tìm thấy phòng phù hợp."
              />
            )}
          </View>
        )}

        <InputComponent
          placeholder="Nhập mã phòng (nếu có)..."
          value={roomPass}
          onChangeText={setRoomPass}
          secureTextEntry
        />
        <Button
          onPress={handleConfirm}
          size={BUTTON_SIZE.MEDIUM}
          title="Xác nhận đăng ký phòng"
          // disabled={roomID && roomPass}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>InforRoomDetailScreen - Hiển thị thông tin phòng đã đăng ký</Text>
    </View>
  );
};

export default InforRoomDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  suggestionsContainer: {
    maxHeight: 150,
    backgroundColor: COLOR.WHITE,
    borderWidth: 1,
    borderColor: COLOR.GRAY1,
    borderRadius: 5,
    marginTop: -10,
    marginBottom: 10,
    zIndex: 1,
  },
  suggestionList: {},
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.GRAY1,
  },
  noSuggestionsText: {
    padding: 10,
    textAlign: 'center',
    color: COLOR.GRAY3,
  },
});
