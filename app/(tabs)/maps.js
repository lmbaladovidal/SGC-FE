import { Platform } from 'react-native';

let Component;

if (Platform.OS === 'android') {
  Component = require('./maps.android').default;
} else if (Platform.OS === 'web') {
  Component = require('./maps.web').default;
} else {
  // En caso de que se use iOS u otro
  Component = () => <></>;
}

export default function MapsPage() {
  return <Component />;
}
