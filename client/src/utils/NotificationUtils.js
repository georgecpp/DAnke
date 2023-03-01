import messaging from '@react-native-firebase/messaging';
import {Alert} from 'react-native';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (!enabled) {
    Alert.alert(
      'Authorization error! Check permission for notifications or this user will not receive notifications..',
    );
  }
}