import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  useCancelRent,
  usePayMonthlyRent,
  useRentRoom,
} from '../../../hooks/useRooms';
import {Controller, useForm} from 'react-hook-form';
import Calendar from '../../../component/atoms/Calendar';
import {CALENDAR_TYPE} from '../../../constants/CalendarConstants';
import {COLOR} from '../../../constants/colorConstants';
import {toPrice} from '../../../utill/toPrice';
import ItemCard from '../../../component/molecules/ItemCard';
import ImageRoom from '../../../component/organisms/DetailRooms/ImageRoom';
import TitleRoom from '../../../component/organisms/DetailRooms/TitleRoom';
import RowComponent from '../../../component/atoms/RowComponent';
import Space from '../../../component/atoms/Space';
import {useQueryClient} from '@tanstack/react-query';
import {useRentStatus} from '../../../hooks/useRentStatus';
import {NAVIGATION_NAME} from '../../../constants/navigtionConstants';

const RoomForRentScreen = () => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const route = useRoute();
  const {item, status} = route.params; // status === false là đã thuê
  const rentRoom = useRentRoom();
  const cancelRentRoom = useCancelRent();
  const payMonthlyRent = usePayMonthlyRent();
  const [showBirthPicker, setShowBirthPicker] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showDuePicker, setShowDuePicker] = useState(false);
  const isStatus = !item?.status; // true = đã thuê
  const data = {
    rent_start_date: item?.rent_start_date,
    rent_end_date: item?.rent_end_date,
    due_date: item?.due_date,
  };

  const {paymentStatus, warningContractStatus, daysLeft} = useRentStatus(data);
  const {
    control,
    handleSubmit,
    getValues,
    setError,
    clearErrors,
    setValue,
    reset,
    formState: {errors},
  } = useForm({
    defaultValues: {
      roomId: item?.id || '',
      nameUser: item?.nameUser || '',
      phoneUser: item?.phoneUser || '',
      userId: item?.user_id || '',
      date_of_birth: item?.date_of_birth || '',
      rent_price: item?.price || 0,
      rent_start_date: item?.rent_start_date || new Date(),
      rent_end_date: item?.rent_end_date || '',
      due_date: item?.due_date || '',
    },
  });
  const handleCancelContract = async () => {
    try {
      await cancelRentRoom.mutateAsync(item.id);
      Alert.alert('✅ Thành công', 'Hợp đồng đã được hủy!');
      navigation.navigate(NAVIGATION_NAME.MANAGER_ROOM_SCREEN);
    } catch (error) {
      Alert.alert('❌ Lỗi', 'Không thể hủy hợp đồng.');
      console.log(error);
    }
  };
  const handlePayment = async () => {
    const user_id = item?.user_id;
    const amount = item?.price;
    try {
      if (!paymentStatus)
        return Alert.alert('Thông báo', 'Đã thanh toán tiền tháng này');
      await payMonthlyRent.mutateAsync({roomId: item.id, user_id, amount});
      Alert.alert('✅ Thành công', 'Phòng đã thanh toán');
      navigation.navigate(NAVIGATION_NAME.MANAGER_ROOM_SCREEN);
    } catch (error) {
      Alert.alert('❌ Lỗi', 'Không thể Thanh toán.');
      console.log(error.response.data);
    }
  };
  const onSubmit = async data => {
    console.log('====================================');
    console.log(data);
    console.log('====================================');
    const payload = {
      roomId: item?.id || roomId,
      userId: data?.userId,
      nameUser: data?.nameUser,
      phoneUser: data?.phoneUser,
      rent_price: item?.price || data?.rent_price,
      rent_start_date: data?.rent_start_date,
      rent_end_date: data?.rent_end_date,
      date_of_birth: data?.date_of_birth,
    };
    try {
      await rentRoom.mutateAsync(payload);
      Alert.alert(
        '✅ Thành công',
        'Thuê phòng thành công!',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate(NAVIGATION_NAME.MANAGER_ROOM_SCREEN);
              reset();
            },
          },
        ],
        {cancelable: false},
      );
      queryClient.invalidateQueries(['rooms']);
    } catch (error) {
      console.log('❌ Lỗi khi thuê phòng:', error.response?.data || error);
      Alert.alert('Lỗi', 'Không thể thuê phòng, vui lòng thử lại sau.');
    }
  };
  const FormWrapper = ({enabled, children}) => (
    <View
      pointerEvents={enabled ? 'auto' : 'none'}
      style={!enabled && {opacity: 0.6}}>
      {children}
    </View>
  );
  return (
    <View style={styles.container}>
      <RowComponent flexDirection="column" alignItems="center">
        <ImageRoom
          avatar={item?.images[0]}
          isEdit={false}
          isLook={true}
          onPressBanner={() => {}}
          onPressImage={() => {}}
        />
        <Space height={10} />
        <TitleRoom
          titleRoom={item?.title}
          isLook={true}
          // control={control}
          // errors={errors}
        />
      </RowComponent>
      <Space height={20} />
      <ScrollView>
        <FormWrapper enabled={status}>
          <View styles={{width: '100%'}}>
            <Text style={styles.label}>Họ và tên người thuê:</Text>
            <Controller
              control={control}
              name="nameUser"
              rules={{
                required: 'Vui lòng nhập Họ và tên',
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={[styles.input, errors.nameUser && styles.inputError]}
                  placeholder="Nhập họ tên người thuê"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={String(value)}
                />
              )}
            />
            {errors.nameUser && (
              <Text style={styles.errorText}>{errors.nameUser.message}</Text>
            )}
            <Text style={styles.label}>Căn cước công dân</Text>
            <Controller
              control={control}
              name="userId"
              rules={{
                required: 'Vui lòng nhập số căn cước công dân',
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={[styles.input, errors.userId && styles.inputError]}
                  placeholder="Nhập số căn cước công dân"
                  keyboardType="numeric"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={String(value)}
                />
              )}
            />
            {errors.userId && (
              <Text style={styles.errorText}>{errors.userId.message}</Text>
            )}
            <Text style={styles.label}>Số điện thoại</Text>
            <Controller
              control={control}
              name="phoneUser"
              rules={{
                required: 'Vui lòng nhập số điện thoại',
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={[styles.input, errors.phoneUser && styles.inputError]}
                  placeholder="0345978249"
                  keyboardType="numeric"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={String(value)}
                />
              )}
            />
            {errors.phoneUser && (
              <Text style={styles.errorText}>{errors.phoneUser.message}</Text>
            )}
            <Text style={styles.label}>Ngày sinh người thuê</Text>
            <Controller
              control={control}
              name="date_of_birth"
              rules={{
                required: 'Vui lòng nhập ngày sinh',
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <>
                  <TouchableOpacity
                    disabled={!status}
                    onPress={() => setShowBirthPicker(true)}
                    style={styles.dateInput}>
                    <Text style={styles.dateText}>
                      {value
                        ? new Date(value).toLocaleDateString()
                        : 'Chọn ngày'}
                    </Text>
                  </TouchableOpacity>
                  {showBirthPicker && (
                    <Calendar
                      value={value ? new Date(value) : new Date()}
                      type={CALENDAR_TYPE.DATE}
                      onChange={date => {
                        setShowBirthPicker(false);
                        if (date) {
                          setValue('date_of_birth', date.toISOString());
                        }
                      }}
                    />
                  )}
                </>
              )}
            />
            {errors.date_of_birth && (
              <Text style={styles.errorText}>
                {errors.date_of_birth.message}
              </Text>
            )}

            {/* 💰 Giá thuê */}
            <Text style={styles.label}>Giá thuê (VNĐ)</Text>
            <Controller
              control={control}
              name="rent_price"
              rules={{
                required: 'Vui lòng nhập giá thuê',
                min: {value: 1000, message: 'Giá thuê tối thiểu là 1.000đ'},
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={[styles.input, errors.rent_price && styles.inputError]}
                  placeholder="Nhập giá thuê..."
                  keyboardType="numeric"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={toPrice(value)}
                />
              )}
            />
            {errors.rent_price && (
              <Text style={styles.errorText}>{errors.rent_price.message}</Text>
            )}

            {/* 📅 Ngày bắt đầu thuê */}
            <Text style={styles.label}>Ngày bắt đầu thuê</Text>
            <Controller
              control={control}
              name="rent_start_date"
              rules={{required: 'Vui lòng chọn ngày bắt đầu thuê'}}
              render={({field: {value}}) => {
                const startDate = value ? new Date(value) : new Date(); // Mặc định hôm nay

                return (
                  <>
                    <TouchableOpacity
                      disabled={!status}
                      onPress={() => setShowStartPicker(true)}
                      style={styles.dateInput}>
                      <Text style={styles.dateText}>
                        {startDate.toLocaleDateString()}
                      </Text>
                    </TouchableOpacity>

                    {showStartPicker && (
                      <Calendar
                        value={startDate}
                        type={CALENDAR_TYPE.DATE}
                        onChange={date => {
                          setShowStartPicker(false);
                          if (date) {
                            const selectedDate = new Date(date);
                            setValue(
                              'rent_start_date',
                              selectedDate.toISOString(),
                            );

                            // Nếu chưa chọn due_date thì auto set 1 năm sau
                            const due = getValues('rent_start_date');
                            if (!due) {
                              const nextYear = new Date(selectedDate);
                              nextYear.setFullYear(nextYear.getFullYear() + 1);
                              setValue(
                                'rent_start_date',
                                nextYear.toISOString(),
                              );
                            }
                          }
                        }}
                      />
                    )}
                  </>
                );
              }}
            />
            {errors.rent_start_date && (
              <Text style={styles.errorText}>
                {errors.rent_start_date.message}
              </Text>
            )}

            {/* ⏳ Ngày hết hạn thuê */}
            <Text style={styles.label}>Ngày hết hạn thuê</Text>
            <Controller
              control={control}
              name="rent_start_date"
              rules={{required: 'Vui lòng chọn ngày hết hạn thuê'}}
              render={({field: {value}}) => {
                // Nếu chưa có rent_start_date → mặc định là 1 năm sau rent_start_date hoặc hôm nay
                const start = getValues('rent_start_date')
                  ? new Date(getValues('rent_start_date'))
                  : new Date();
                const dueDate = value
                  ? new Date(value)
                  : new Date(start.setFullYear(start.getFullYear() + 1));

                return (
                  <>
                    <TouchableOpacity
                      disabled={!status}
                      onPress={() => setShowDuePicker(true)}
                      style={styles.dateInput}>
                      <Text style={styles.dateText}>
                        {dueDate.toLocaleDateString()}
                      </Text>
                    </TouchableOpacity>

                    {showDuePicker && (
                      <Calendar
                        value={dueDate}
                        type={CALENDAR_TYPE.DATE}
                        onChange={date => {
                          setShowDuePicker(false);
                          if (date) {
                            setValue(
                              'rent_start_date',
                              new Date(date).toISOString(),
                            );
                          }
                        }}
                      />
                    )}
                  </>
                );
              }}
            />
            {errors.rent_start_date && (
              <Text style={styles.errorText}>
                {errors.rent_start_date.message}
              </Text>
            )}
          </View>
        </FormWrapper>
        {/* ✅ Nút xác nhận */}
        {status ? (
          <TouchableOpacity
            style={[styles.submitButton, {width: '100%'}]}
            onPress={handleSubmit(onSubmit)}>
            <Text style={styles.submitText}>Xác nhận thuê phòng</Text>
          </TouchableOpacity>
        ) : (
          <RowComponent flexDirection="row" justify="space-between">
            <TouchableOpacity
              style={[styles.submitButton, {width: '45%'}]}
              onPress={handleCancelContract}>
              <Text style={styles.submitText}>Hủy hợp đồng</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitButton, {width: '45%'}]}
              onPress={handlePayment}>
              <Text style={styles.submitText}>Xác nhận đóng tiền</Text>
            </TouchableOpacity>
          </RowComponent>
        )}
      </ScrollView>
    </View>
  );
};

export default RoomForRentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLOR.WHITE,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLOR.BLACK1,
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 15,
    color: COLOR.BLACK1,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: COLOR.GREY_400,
    borderRadius: 8,
    padding: 7,
    marginBottom: 10,
    color: COLOR.BLACK1,
  },
  inputError: {
    borderColor: COLOR.DANGER,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: COLOR.GREY_400,
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
    marginBottom: 10,
  },
  dateText: {
    color: COLOR.BLACK1,
  },
  errorText: {
    color: COLOR.DANGER,
    fontSize: 13,
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: COLOR.PRIMARY,
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 15,
  },
  submitText: {
    color: COLOR.WHITE,
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 10,
  },
});
