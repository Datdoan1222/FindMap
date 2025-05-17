import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {globalStyles} from '../../styles/globalStyles';

/**
 * @typedef {"flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly"} justifyType
 * @typedef {"row" | "column"} directionType
 * @typedef {"flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly"} alignType
 */

/**
 * @param {{justify: justifyType, flexDirection:directionType, alignItems:alignType, children: any, styles?: object, onPress?: () => void}} props
 */

const RowComponent = ({
  children,
  justify,
  alignItems = 'center',
  flexDirection = 'row',
  styles,
  onPress,
}) => {
  const localStyle = [
    globalStyles.row,
    {
      flexDirection: flexDirection,
      // marginBottom: 5,
      justifyContent: justify,
      alignItems: alignItems,
    },
    styles,
  ];
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} style={localStyle}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={localStyle}>{children}</View>;
};

export default RowComponent;
