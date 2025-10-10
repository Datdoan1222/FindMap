// WheelPicker.js
// Component WheelPicker cho chọn giờ và phút
// Sử dụng trong Calendar component

import React, {useRef, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {COLOR} from '../../constants/colorConstants';

const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 5;

// Component cột wheel picker
const WheelColumn = ({data, selected, onSelect}) => {
  const scrollViewRef = useRef(null);

  useEffect(() => {
    // Scroll đến vị trí item được chọn khi component mount hoặc selected thay đổi
    const index = data.indexOf(selected);
    if (index !== -1 && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: index * ITEM_HEIGHT,
        animated: false,
      });
    }
  }, [selected, data]);

  const handleMomentumScrollEnd = event => {
    const yOffset = event.nativeEvent.contentOffset.y;
    const index = Math.round(yOffset / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(index, data.length - 1));

    // Snap về item gần nhất
    scrollViewRef.current?.scrollTo({
      y: clampedIndex * ITEM_HEIGHT,
      animated: true,
    });

    // Cập nhật giá trị được chọn
    if (data[clampedIndex] !== selected) {
      onSelect(data[clampedIndex]);
    }
  };

  const renderItem = (item, index) => {
    const isSelected = item === selected;
    return (
      <TouchableOpacity
        key={index}
        style={[styles.item, {height: ITEM_HEIGHT}]}
        onPress={() => {
          onSelect(item);
          scrollViewRef.current?.scrollTo({
            y: index * ITEM_HEIGHT,
            animated: true,
          });
        }}>
        <Text
          style={[
            styles.itemText,
            isSelected && styles.selectedItemText,
            !isSelected && styles.unselectedItemText,
          ]}>
          {item.toString().padStart(2, '0')}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.columnContainer}>
      <View style={styles.pickerContainer}>
        {/* Highlight overlay */}
        <View style={styles.highlightContainer}>
          <View style={styles.highlight} />
        </View>
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onMomentumScrollEnd={handleMomentumScrollEnd}
          contentContainerStyle={{
            paddingVertical: ITEM_HEIGHT * 2,
          }}>
          {data.map(renderItem)}
        </ScrollView>
      </View>
    </View>
  );
};

// Component chính WheelPicker
const WheelPicker = ({
  valueHour = 0,
  valueMinute = 0,
  onValueChange,
  style,
}) => {
  // Tạo array số từ 0-23 cho giờ và 0-59 cho phút
  const hours = Array.from({length: 24}, (_, i) => i);
  const minutes = Array.from({length: 60}, (_, i) => i);

  const handleHourChange = newHour => {
    onValueChange && onValueChange(newHour, valueMinute);
  };

  const handleMinuteChange = newMinute => {
    onValueChange && onValueChange(valueHour, newMinute);
  };

  return (
    <View style={[styles.container, style]}>
      <WheelColumn
        data={hours}
        selected={valueHour}
        onSelect={handleHourChange}
      />
      <Text style={styles.separator}>:</Text>
      <WheelColumn
        data={minutes}
        selected={valueMinute}
        onSelect={handleMinuteChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#9CA3AF',
    marginHorizontal: 8,
    marginTop: 20,
  },
  columnContainer: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  columnLabel: {
    fontSize: 14,
    color: COLOR.BLACK,
    fontWeight: '600',
    marginBottom: 8,
  },
  pickerContainer: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    width: 80,
    position: 'relative',
  },
  highlightContainer: {
    position: 'absolute',
    top: ITEM_HEIGHT * 2,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    pointerEvents: 'none',
  },
  highlight: {
    width: '100%',
    height: ITEM_HEIGHT,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: COLOR.PRIMARY,
    backgroundColor: 'rgba(246, 218, 59, 0.05)',
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 18,
    color: '#1F2937',
  },
  selectedItemText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  unselectedItemText: {
    opacity: 0.4,
  },
});

export default WheelPicker;
