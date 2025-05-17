import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const MessengerScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Bạn không có cuộc trò chuyện nào</Text>
    </View>
  );
};

export default MessengerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
