const React = require('react');
const {View} = require('react-native');

const MockMapView = props => {
  return React.createElement(View, props, props.children);
};

const MockMarker = props => {
  return React.createElement(View, props, props.children);
};

const MockCallout = props => {
  return React.createElement(View, props, props.children);
};

module.exports = {
  __esModule: true,
  default: MockMapView,
  Marker: MockMarker,
  Callout: MockCallout,
  PROVIDER_GOOGLE: 'google',
};
