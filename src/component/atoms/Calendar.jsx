import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import {ICON_NAME, ICON_TYPE} from '../../constants/iconConstants';
import {COLOR} from '../../constants/colorConstants';
import Button from './Button';
import {BUTTON_TYPE} from '../../constants/buttonConstants';
import Space from './Space';
import {CALENDAR_MODE, CALENDAR_TYPE} from '../../constants/CalendarConstants';
import WheelPicker from './WheelPicker.js';
import IconStyles from '../../constants/IconStyle.js';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Calendar = ({
  visible,
  onClose,
  onChange,
  value = new Date(),
  type = CALENDAR_TYPE.TIMEDATE,
  maximumDate,
}) => {
  const [selectedDate, setSelectedDate] = useState(value);
  const [currentMonth, setCurrentMonth] = useState(new Date(value));
  const [currentYear, setCurrentYear] = useState(new Date(value));
  const [isModalYear, setIsModalYear] = useState(false);
  const [isMode, setIsMode] = useState(type);

  // ==================== HELPERS ====================
  const formatDateTime = date => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const textTime = `${hours}:${minutes}`;
    const textDate = `${day}/${month}/${year}`;
    if (type === CALENDAR_TYPE.DATE) {
      return textDate;
    } else if (type === CALENDAR_TYPE.TIME) {
      return textTime;
    } else {
      return `${textTime} - ${textDate}`;
    }
  };

  const getDaysArray = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = new Date(year, month, 1).getDay();

    const days = Array.from({length: startDay + daysInMonth}, (_, index) => {
      if (index < startDay) return null;
      return new Date(year, month, index - startDay + 1);
    });

    // Pad để đủ rows
    while (days.length % 7 !== 0) {
      days.push(null);
    }

    return days;
  };

  // Tạo danh sách năm 1950 → hiện tại
  const currentYearValue = new Date().getFullYear();
  const years = Array.from(
    {length: currentYearValue - 1950 + 1},
    (_, i) => 1950 + i,
  ).reverse();

  // ==================== HANDLERS ====================
  const handleSelectDate = date => {
    const newDate = new Date(date);
    newDate.setHours(selectedDate.getHours(), selectedDate.getMinutes(), 0, 0);

    if (newDate > maximumDate) {
      Alert.alert('Thông báo', 'Không được chọn ngày lớn hơn hiện tại');
      return;
    }

    setSelectedDate(newDate);
  };

  const handleSelectTime = (hour, minute) => {
    const newDate = new Date(selectedDate);
    newDate.setHours(hour, minute, 0, 0);
    setSelectedDate(newDate);
  };

  const handleConfirm = () => {
    onChange?.(selectedDate);
    onClose?.();
  };

  const handleChangeMonth = offset => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset),
    );
  };
  const handleChangeYear = year => {
    const newDate = new Date(year, currentMonth.getMonth());
    setCurrentMonth(newDate);
    setIsModalYear(false);
  };
  // ==================== RENDER ====================
  const renderModeToggle = () => (
    <View style={styles.modeToggleContainer}>
      <TouchableOpacity
        style={styles.modeToggle}
        onPress={() => setIsMode(CALENDAR_MODE.TIME)}>
        <Text
          style={[
            styles.modeToggleText,
            isMode === CALENDAR_MODE.TIME && styles.modeToggleActive,
          ]}>
          Thời gian
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.modeToggle}
        onPress={() => setIsMode(CALENDAR_MODE.DATE)}>
        <Text
          style={[
            styles.modeToggleText,
            isMode === CALENDAR_MODE.DATE && styles.modeToggleActive,
          ]}>
          Ngày tháng
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderCalendarHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.headerButton}
        onPress={() => handleChangeMonth(-1)}>
        <IconStyles
          iconSet={ICON_TYPE.MATERIAL_ICONS}
          name={ICON_NAME.KEYBOARD_ARROW_LEFT}
          size={25}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{flexDirection: 'row', alignItems: 'center'}}
        onPress={() => setIsModalYear(true)}>
        <Text style={styles.monthText}>
          {currentMonth.toLocaleString('default', {
            month: 'long',
            year: 'numeric',
          })}
        </Text>
        <IconStyles
          iconSet="MaterialIcons"
          name={ICON_NAME.KEYBOARD_ARROW_DOWN}
          size={20}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.headerButton, styles.headerButtonRight]}
        onPress={() => handleChangeMonth(1)}>
        <IconStyles
          iconSet={ICON_TYPE.MATERIAL_ICONS}
          name={ICON_NAME.KEYBOARD_ARROW_RIGHT}
          size={25}
        />
      </TouchableOpacity>
    </View>
  );

  const renderDaysOfWeek = () => (
    <View style={styles.weekRow}>
      {DAYS_OF_WEEK.map(day => (
        <Text key={day} style={styles.weekText}>
          {day}
        </Text>
      ))}
    </View>
  );

  const renderDatePicker = () => (
    <>
      {renderCalendarHeader()}
      {renderDaysOfWeek()}
      <FlatList
        data={getDaysArray()}
        keyExtractor={(_, i) => i.toString()}
        numColumns={7}
        renderItem={({item}) => {
          if (!item) return <View style={styles.dayCell} />;
          const isSelected =
            selectedDate.toDateString() === item.toDateString();
          const today = new Date();
          const isToday = today.toDateString() === item.toDateString();
          return (
            <TouchableOpacity
              style={[
                styles.dayCell,
                isSelected && styles.selectedDayCell,
                isToday && styles.todayCell,
              ]}
              onPress={() => handleSelectDate(item)}>
              <Text
                style={[styles.dayText, isSelected && styles.selectedDayText]}>
                {item.getDate()}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
      <Space height={10} />
    </>
  );

  const renderTimePicker = () => (
    <>
      <View style={styles.timePickerContainer}>
        <WheelPicker
          valueHour={selectedDate.getHours()}
          valueMinute={selectedDate.getMinutes()}
          onValueChange={handleSelectTime}
        />
      </View>
      <Space height={10} />
    </>
  );

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              {type === CALENDAR_TYPE.TIMEDATE && renderModeToggle()}
              <View style={styles.content}>
                {isMode === CALENDAR_MODE.DATE
                  ? renderDatePicker()
                  : renderTimePicker()}
              </View>
              <View style={styles.selectedDateContainer}>
                <Text style={styles.selectedDateText}>
                  {formatDateTime(selectedDate)}
                </Text>
              </View>
              <Button
                type={BUTTON_TYPE.PRIMARY}
                title="Xác nhận"
                onPress={handleConfirm}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
      <Modal visible={isModalYear} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.listYear}>
            <FlatList
              data={years}
              keyExtractor={item => item.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.yearItem}
                  onPress={() => handleChangeYear(item)}>
                  <Text style={styles.yearText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    backgroundColor: COLOR.WHITE,
    borderRadius: 10,
    padding: 15,
    height: 480,
  },
  yearItem: {
    width: 200,
    alignItems: 'center',
  },
  listYear: {
    backgroundColor: COLOR.WHITE,
    height: 200,
    width: '80%',
    borderRadius: 15,
    padding: 10,
    alignItems: 'center',
  },
  yearText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLOR.BLACK,
    paddingVertical: 5,
  },
  modeToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 50,
    marginBottom: 10,
  },
  modeToggle: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modeToggleText: {
    padding: 10,
    textAlign: 'center',
    color: COLOR.BLACK,
    fontSize: 15,
  },
  modeToggleActive: {
    borderBottomColor: COLOR.PRIMARY,
    borderBottomWidth: 3,
  },
  selectedDateContainer: {
    padding: 10,
    backgroundColor: COLOR.GREY_50,
    borderColor: COLOR.PRIMARY,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedDateText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: COLOR.PRIMARY,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerButton: {
    width: 100,
  },
  headerButtonRight: {
    alignItems: 'flex-end',
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLOR.BLACK,
    textAlign: 'center',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  weekText: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    color: COLOR.BLACK,
  },
  dayCell: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
  },
  dayText: {
    fontSize: 16,
    color: COLOR.BLACK,
  },
  selectedDayCell: {
    backgroundColor: COLOR.PRIMARY,
    borderRadius: 20,
  },
  todayCell: {
    borderWidth: 1,
    borderColor: COLOR.PRIMARY,
    borderRadius: 20,
  },
  selectedDayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  timePickerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Calendar;
