import React from 'react';
import {View} from 'react-native';
import {globalStyles} from '../../styles/globalStyles';

const SectionComponent = ({children, styles}) => {
  return <View style={[globalStyles.section, styles]}>{children}</View>;
};

export default SectionComponent;
