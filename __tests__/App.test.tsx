/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: import explicitly to use the types shipped with jest.
import {it} from '@jest/globals';

// Note: test renderer must be required after react-native.
import {render} from '@testing-library/react-native';

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
    NavigationContainer: ({children}) => children,
  };
});

it('renders App without crashing', () => {
  const {getByTestId} = render(<App />);
  // Nếu có gán testID ở AppNavigator thì dùng testID kiểm tra ở đây
});
