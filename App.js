/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Button,
  Platform,
  PermissionsAndroid,
  AppRegistry,
  Alert,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import Geolocation from 'react-native-geolocation-service';
import ForegroundService from 'react-native-foreground-service';

let foregroundTask = async (params) => {
  console.log(params);

  // take your device location and send to the server

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: ' App Need Location Permission',
        message: 'we need this to track your status',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      Geolocation.watchPosition(
        (position) => {
          console.log(position);
        },
        (error) => console.log(error),
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
          distanceFilter: 1,
        },
      );
    } else {
      Alert.alert('permission not given');
    }
  } catch (e) {
    console.error(e);
  }
};
AppRegistry.registerHeadlessTask('location', () => foregroundTask);

const App = () => {
  React.useEffect(() => {}, []);

  const create = async () => {
    if ((Platform.OS == 'android', Platform.Version >= 26)) {
      let notificationConfig = {
        id: 3,
        title: 'Conveyence location service',
        message: `Conveyence location service`,
        visibility: 'public',
        importance: 'low',
        number: String(1),
      };

      await ForegroundService.startService(notificationConfig);

      await ForegroundService.runTask({
        taskName: 'location',
        delay: 10000,
      });
    } else {
      Alert.alert('Platform not Supported');
    }
  };
  const stop = async () => {
    // await VIForegroundService.stopService();
    await ForegroundService.stopServiceAll();
    // stop service when no longer needed
  };

  return (
    <View style={styles.scrollView}>
      <Button title={'Start Location Service'} onPress={create} />
      <View style={styles.div} />
      <Button title={'Stop Location Service'} onPress={stop} />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
    padding: 10,
  },
  div: {
    width: '100%',
    height: 10,
  },
});

export default App;
