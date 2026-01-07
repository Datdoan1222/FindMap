import React, {useState, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import RowComponent from '../../atoms/RowComponent';
import TextComponent from '../../atoms/TextComponent';
import IconStyles from '../../../constants/IconStyle';
import {COLOR} from '../../../constants/colorConstants';
import Space from '../../atoms/Space';
import Input from '../../atoms/Input';
import ButtonIcon from '../../atoms/ButtonIcon';
import Button from '../../atoms/Button';

const AmenitiesRoom = ({amenities = [], isLook, onChange}) => {
  const [itemAmenity, setItemAmenity] = useState(amenities);
  const [newAmenity, setNewAmenity] = useState('');

  // đồng bộ khi cha thay đổi amenities
  useEffect(() => {
    setItemAmenity(amenities);
  }, [amenities]);

  const handleAddItem = () => {
    if (!newAmenity.trim()) return;
    const updated = [...itemAmenity, newAmenity.trim()];
    setItemAmenity(updated);
    setNewAmenity('');
    onChange && onChange(updated); // bắn ra cha
  };

  const handleDeleteItem = index => {
    const updated = itemAmenity.filter((_, i) => i !== index);
    setItemAmenity(updated);
    onChange && onChange(updated); // bắn ra cha
  };

  return (
    <RowComponent
      flexDirection="column"
      alignItems="flex-start"
      styles={styles.container}>
      <TextComponent
        size={15}
        styles={{fontWeight: 'bold'}}
        color={COLOR.BLACK1}
        text={'Các tiện nghi khác'}
      />
      <Space height={10} />

      {itemAmenity.map((amenity, index) => (
        <RowComponent key={index} style={styles.item}>
          <IconStyles
            name={'check'}
            iconSet="Entypo"
            color={COLOR.SUCCESSFUL}
            size={20}
          />
          {isLook ? (
            <TextComponent
              size={13}
              styles={{fontStyle: 'italic', marginLeft: 5, flexShrink: 1}}
              color={COLOR.BLACK1}
              text={amenity}
            />
          ) : (
            <>
              <Input style={styles.input} value={amenity} editable={false} />
              <ButtonIcon
                name={'trash'}
                color={COLOR.DANGER}
                size={18}
                onPress={() => handleDeleteItem(index)}
              />
            </>
          )}
        </RowComponent>
      ))}

      {!isLook && (
        <RowComponent style={styles.item}>
          <IconStyles
            name={'check'}
            iconSet="Entypo"
            color={COLOR.SUCCESSFUL}
            size={20}
          />
          <Input
            style={styles.input}
            value={newAmenity}
            onChangeText={setNewAmenity}
            placeholder="Thêm tiện nghi..."
          />
          <Button
            title={
              <IconStyles
                name={'plus'}
                iconSet="Entypo"
                color={COLOR.WHITE}
                size={17}
              />
            }
            onPress={handleAddItem}
          />
        </RowComponent>
      )}
    </RowComponent>
  );
};

export default AmenitiesRoom;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: COLOR.WHITE,
  },
  item: {
    marginBottom: 5,
    alignItems: 'flex-start',
  },
  input: {
    width: '70%',
    paddingRight: 10,
  },
});
