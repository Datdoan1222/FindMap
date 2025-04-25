import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import {useForm} from 'react-hook-form';

import Inputs from '../atoms/Inputs';
import Button from '../atoms/Button';
// import IconStyles from '../../constants/IconStyles';
import ButtonIcon from '../atoms/ButtonIcon';
import {COLOR} from '../../constants/colorConstants';
import {BUTTON_SIZE, BUTTON_TYPE} from '../../constants/buttonConstants';
const {width, height} = Dimensions.get('window');

const LoginForm = ({title, login, onPress, onsubmit, isKeyboardVisible}) => {
  const [gender, setGender] = useState(null);
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fields = login
    ? [
        {
          key: 'loginFields',
          fields: [
            {
              key: 'email',
              placeholder: 'Gmail',
              rules: {required: 'Email is required'},
            },
            {
              key: 'password',
              placeholder: 'Mật khẩu',
              rules: {required: 'Password is required'},
              secureTextEntry: true,
            },
          ],
        },
      ]
    : [
        {
          key: 'gmail',
          fields: [
            {
              key: 'gmail',
              placeholder: 'Gmail',
              rules: {required: 'Gmail is required'},
              description: 'Hãy nhập tài khoản email của bạn',
              page: '0',
            },
          ],
        },
        {
          key: 'displayName',
          fields: [
            {
              key: 'displayName',
              placeholder: 'Tên người dùng',
              rules: {required: 'Tên người dùng is required'},
              description: 'Hãy nhập những cái tên mà bạn thích',
              page: '1',
            },
          ],
        },
        {
          key: 'birthday',
          fields: [
            {
              key: 'birthday',
              placeholder: 'Ngày sinh (dd/mm/yyyy)',
              rules: {required: 'Ngày sinh is required'},
              description: 'Ngày sinh cảu bạn là bao nhiêu',
              page: '2',
            },
          ],
        },
        {
          key: 'gender',
          fields: [
            {
              key: 'gender',
              description: 'Bạn là gì nào',
              page: '3',
            },
          ],
        },
        {
          key: 'password',
          fields: [
            {
              key: 'password',
              placeholder: 'Mật khẩu',
              rules: {required: 'Password is required'},
              secureTextEntry: true,
              page: '4', // description: 'Nhập mật khẩu của bạn.',
            },
            {
              key: 'confirmPass',
              placeholder: 'Nhập lại mật khẩu',
              rules: {required: 'Confirm Password is required'},
              secureTextEntry: true,
              description: 'Hãy bảo mật tài khoản của bạn',
              page: '4',
            },
          ],
        },
      ];

  const {
    control,
    handleSubmit,
    getValues,
    setError,
    clearErrors,
    formState: {errors},
  } = useForm();

  const onSubmit = data => {
    onsubmit(data);
  };

  const currentFieldKey = fields[currentIndex].key;
  const currentFieldValue = getValues(currentFieldKey);

  const handleScroll = event => {
    const newOffset = event.nativeEvent.contentOffset.x;
    const newIndex = Math.floor(newOffset / (width - 60));
    if (newIndex > currentIndex) {
      if (!currentFieldValue) {
        setError(currentFieldKey, {
          type: 'manual',
          message: 'This field is required',
        });
        flatListRef.current.scrollToIndex({index: currentIndex});
        return;
      } else {
        clearErrors(currentFieldKey);
      }
    }
    setCurrentIndex(newIndex);
  };

  const renderItem = ({item}) => {
    return (
      <View>
        {item.fields.map(field => (
          <View key={field.key} style={styles.inputWrapper}>
            <Inputs
              key={field.key}
              errors={errors[field.key]}
              control={control}
              name={field.key}
              rules={field.rules}
              placeholder={field.placeholder}
              secureTextEntry={field.secureTextEntry || false}
              description={field.description}
              login={login}
            />
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.title}>{title}</Text>
        <FlatList
          ref={flatListRef}
          data={fields}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={handleScroll}
          keyExtractor={item => item.key}
          renderItem={renderItem}
          style={styles.flatList}
        />
      </View>

      <View style={styles.btnContai}>
        {currentIndex === fields.length - 1 && (
          <View style={styles.btnLogin}>
            <Button
              type={BUTTON_TYPE.PRIMARY}
              size={BUTTON_SIZE.LARGE}
              title={!login ? 'Đăng ký' : 'Đăng nhập'}
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        )}

        <View style={styles.btnRegister}>
          <TouchableOpacity onPress={onPress}>
            <Text style={styles.registerLink}>
              {login ? 'Bạn chưa có tài khoản?' : 'Bạn đã có tài khoản?'}
              <Text style={styles.registerText}>
                {login ? ' Đăng ký' : ' Đăng nhập'}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    flex: 3,
  },
  btnContai: {
    flex: 0.5,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  btnLogin: {
    marginVertical: 10,
  },
  btnRegister: {
    // flex: 1,
    alignItems: 'center',
    fontSize: 15,
    fontStyle: 'italic',
    justifyContent: 'flex-start',
  },
  registerText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: COLOR.PRIMARY,
  },
  title: {
    fontSize: 25,
    fontFamily: 'Inter-Medium',
    color: COLOR.TEXT,
  },

  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
});
