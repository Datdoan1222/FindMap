import React from 'react';
import {
  View,
  Text,
  Modal as RNModal,
  Image,
  TouchableWithoutFeedback, // Import TouchableWithoutFeedback
} from 'react-native';
import {COLOR} from '../../constants/colorConstants';
import Button from '../atoms/Button';
import {BUTTON_TYPE, BUTTON_SIZE} from '../../constants/buttonConstants';
// import IconButton from '../atoms/IconButton';
import {ICON_NAME, ICON_TYPE} from '../../constants/iconConstants';
import {modalStyles} from '../../styles/molecules/modalStyles';
import {MODAL_NOTI_TYPE} from '../../constants/modalConstants';
import {ICON_NAME_URL} from '../../constants/assetsConstants';

const Modal = ({
  type,
  isVisible,
  title,
  text,
  textConfirm,
  textCancel,
  onConfirm,
  onCancel,
  transparent = true,
  ...res
}) => {
  // Function to handle background press
  const handleBackgroundPress = () => {
    if (onCancel) {
      onCancel();
    }
  };

  // Function to prevent press propagation inside the modal content
  const handleContentPress = () => {
    // Do nothing, just catch the press
  };

  return (
    <RNModal
      visible={isVisible}
      transparent={transparent}
      animationType="fade"
      onRequestClose={onCancel} // Keep this for Android back button
      style={{zIndex: 99}}
      {...res}>
      {/* Wrap the background with TouchableWithoutFeedback */}
      <TouchableWithoutFeedback onPress={handleBackgroundPress}>
        <View
          style={
            transparent
              ? modalStyles.container
              : modalStyles.containerTransparent
          }>
          {/* Wrap the modal content to prevent closing when clicking inside */}
          <TouchableWithoutFeedback onPress={handleContentPress}>
            <View style={modalStyles.modal}>
              {type === MODAL_NOTI_TYPE.CART && (
                <Image
                  source={{uri: ICON_NAME_URL.CART_ADD}}
                  style={{width: 60, height: 60}}
                />
              )}
              {type === MODAL_NOTI_TYPE.SUCCESS && (
                <Image
                  source={{uri: ICON_NAME_URL.SUCCESS}}
                  style={{width: 60, height: 60}}
                />
              )}
              {type === MODAL_NOTI_TYPE.CANCEL && (
                <Image
                  source={{uri: ICON_NAME_URL.CANCEL}}
                  style={{width: 60, height: 60}}
                />
              )}
              {type === MODAL_NOTI_TYPE.CANCEL_ORDER && (
                <Image
                  source={{uri: ICON_NAME_URL.CANCEL_ORDER}}
                  style={{width: 60, height: 60}}
                />
              )}
              {title && (
                <Text allowFontScaling={false} style={modalStyles.title}>
                  {title}
                </Text>
              )}
              {text && (
                <Text allowFontScaling={false} style={modalStyles.text}>
                  {text}
                </Text>
              )}
              <View style={modalStyles.buttonContainer}>
                {onConfirm && (
                  <Button
                    title={textConfirm}
                    type={BUTTON_TYPE.PRIMARY}
                    size={BUTTON_SIZE.LARGE}
                    onPress={onConfirm}
                  />
                )}
                {onCancel && (
                  <Button
                    title={textCancel}
                    type={BUTTON_TYPE.SECONDARY}
                    size={BUTTON_SIZE.LARGE}
                    onPress={onCancel} // This button still works
                  />
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

export default Modal;
