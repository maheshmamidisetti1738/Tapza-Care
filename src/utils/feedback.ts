import { Alert, Platform, ToastAndroid, Vibration } from 'react-native';

export function vibrate() {
  Vibration.vibrate(20);
}

export function showMessage(message: string) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert(message);
  }
}
