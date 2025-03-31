import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import FontAwesome5Brands from 'react-native-vector-icons/FontAwesome5Brands';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
// import FontAwesome6Brands from 'react-native-vector-icons/FontAwesome6Brands';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Zocial from 'react-native-vector-icons/Zocial';
const iconSets = {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  //   FontAwesome5Brands,
  FontAwesome6,
  //   FontAwesome6Brands,
  Fontisto,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
};
const IconStyles = ({
  iconSet = 'Ionicons',
  name,
  size = 30,
  color = '#000000',
  style,
}) => {
  const IconComponent = iconSets[iconSet];

  if (!IconComponent) {
    console.warn(`no "${iconSet}".`);
    return null;
  }

  return <IconComponent name={name} size={size} color={color} style={style} />;
};

export default IconStyles;
