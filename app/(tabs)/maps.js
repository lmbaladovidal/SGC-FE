import { Platform } from 'react-native';

export default function MapScreen() {
  
  let MapImplementation;  
  if (Platform.OS === 'android') {
    console.log('Using Android Map Implementation');
    MapImplementation = eval('require')('./maps.android').default;
  } else {
    console.log('Using Android Map Implementation');
    MapImplementation = require('./maps.web').default;
  }
}